import { updateImage as f_40 } from "./server-actions/data.js";
import { processImage as f_39 } from "./server-actions/data.js";
import { login as f_38 } from "./server-actions/auth.js";
import { logout as f_37 } from "./server-actions/auth.js";
import { AFf_7 as f_36 } from "./components/App.tsx";
import { AFf_6 as f_35 } from "./components/App.tsx";
import FormDataFallback from 'form-data';
import multer from "multer";
const actions = {
    $FSA_f_23_AFf_6: f_35,
    $FSA_f_24_AFf_7: f_36,
    $FSA_f_25_logout: f_37,
    $FSA_f_26_login: f_38,
    $FSA_f_33_processImage: f_39,
    $FSA_f_34_updateImage: f_40
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
