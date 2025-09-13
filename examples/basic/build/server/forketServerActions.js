import { updateUsername as f_61 } from "./components/server-functions-with-form-actions/actions.ts";
import { updateMyName as f_60 } from "./components/server-functions-with-actions/actions.ts";
import { createNote as f_59 } from "./components/importing-server-functions-from-client-components/actions.ts";
import { createNoteAction as f_58 } from "./components/creating-server-function-from-server-component/Page.tsx";
import { getLikeCount as f_57 } from "./components/calling-server-function-outside-form/actions.ts";
import { incrementLike as f_56 } from "./components/calling-server-function-outside-form/actions.ts";
import FormDataFallback from 'form-data';
import multer from "multer";
const actions = {
    $FSA_f_52_incrementLike: f_56,
    $FSA_f_39_getLikeCount: f_57,
    $FSA_f_41_createNoteAction: f_58,
    $FSA_f_53_createNote: f_59,
    $FSA_f_54_updateMyName: f_60,
    $FSA_f_55_updateUsername: f_61
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
                    if (typeof a === 'object' && a && a.__fd === true) {
                        let fd;
                        if (typeof FormData !== "undefined") {
                            fd = new FormData();
                        } else {
                            fd = new FormDataFallback();
                        }
                        Object.keys(a).forEach((k)=>{
                            if (k === '__fd') return;
                            fd.append(k, a[k]);
                        });
                        args.push(fd);
                        return;
                    }
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
