import f_23 from "./server-actions/db.ts";
import { andMore as f_22 } from "./server-actions/db.ts";
import { somethingElse as f_21 } from "./server-actions/db.ts";
import { superSaveNote as f_20 } from "./server-actions/db.ts";
import f_19 from "./server-actions/db.ts";
import { saveNote as f_18 } from "./server-actions/db.ts";
const actions = {
    $FSA_f_11_saveNote: f_18,
    $FSA_f_13_getNodes: f_19,
    $FSA_f_12_superSaveNote: f_20,
    $FSA_f_16_somethingElse: f_21,
    $FSA_f_17_andMore: f_22,
    $FSA_f_15_getNodes2: f_23
};
export default async function forketServerActions(req, res) {
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
    try {
        const context = {
            request: req,
            response: res
        };
        const result = await actions[id](req.body || {}, context);
        res.status(200).json({
            result
        });
    } catch (error) {
        console.error(`‎𐂐 Forket: error in server action ${id}:`, error);
        res.status(200).json({
            error: error.message || `Error in server action ${id}`
        });
    }
}
