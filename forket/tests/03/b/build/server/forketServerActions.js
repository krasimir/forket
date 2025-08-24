import getNodes2 from "./server-actions/db";
import { andMore } from "./server-actions/db";
import { somethingElse } from "./server-actions/db";
import { superSaveNote } from "./server-actions/db";
import getNodes from "./server-actions/db";
import { saveNote } from "./server-actions/db";
const actions = {
    $FSA_saveNote: saveNote,
    $FSA_getNodes: getNodes,
    $FSA_superSaveNote: superSaveNote,
    $FSA_somethingElse: somethingElse,
    $FSA_andMore: andMore,
    $FSA_getNodes2: getNodes2
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
