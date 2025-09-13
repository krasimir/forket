import f_23 from "./server-actions/db.ts";
import { andMore as f_22 } from "./server-actions/db.ts";
import { somethingElse as f_21 } from "./server-actions/db.ts";
import { superSaveNote as f_20 } from "./server-actions/db.ts";
import f_19 from "./server-actions/db.ts";
import { saveNote as f_18 } from "./server-actions/db.ts";
import FormDataFallback from 'form-data';
import multer from "multer";
const actions = {
    $FSA_f_11_saveNote: f_18,
    $FSA_f_13_getNodes: f_19,
    $FSA_f_12_superSaveNote: f_20,
    $FSA_f_16_somethingElse: f_21,
    $FSA_f_17_andMore: f_22,
    $FSA_f_15_getNodes2: f_23
};
const fromDataHandler = multer({
    storage: multer.memoryStorage()
});
export default async function forketServerActions(req, res) {
    fromDataHandler.any()(req, res, async ()=>{
        res.setHeader("Content-Type", "application/json");
        if (!req.body && !req.files) {
            console.warn(`‎𐂐 Forket: the request object has no body.`);
            res.status(400).json({
                error: "No body provided"
            });
            return;
        }
        if (!req.body.__actionId) {
            console.warn(`‎𐂐 Forket: the request object body has no id.`);
            res.status(400).json({
                error: "No id provided"
            });
            return;
        }
        const id = req.body.__actionId;
        const actionArgs = parseArgs(req.body.__args);
        const kind = req.body.__kind || "json";
        try {
            const context = {
                request: req,
                response: res
            };
            const args = [];
            if (kind === "formdata") {
                let fd;
                if (typeof FormData !== 'undefined') {
                    fd = new FormData();
                } else {
                    fd = new FormDataFallback();
                }
                for (const [key, value] of Object.entries(req.body)){
                    fd.append(key, value);
                }
                args.push(fd);
            } else {
                actionArgs.forEach((a)=>{
                    args.push(a);
                });
            }
            args.push(context);
            const result = await actions[id](...args);
            res.status(200).json({
                result
            });
        } catch (error) {
            console.error(`‎𐂐 Forket: error in server action ${id}:`, error);
            res.status(200).json({
                error: error.message || `Error in server action ${id}`
            });
        }
    });
}
function parseArgs(str) {
    if (!str) return [];
    let args = [];
    try {
        args = JSON.parse(str);
    } catch (e) {
        console.warn(`‎𐂐 Forket: could not parse action args:`, e);
    }
    return args;
}
