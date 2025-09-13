import { getTotalNumberOfQuotes as f_13 } from "./server-actions/quotes.ts";
import { getQuote as f_12 } from "./server-actions/quotes.ts";
import FormDataFallback from 'form-data';
import multer from "multer";
const actions = {
    $FSA_f_11_getQuote: f_12,
    $FSA_f_10_getTotalNumberOfQuotes: f_13
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
