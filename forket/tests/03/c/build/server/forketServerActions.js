import { saveData as f_14 } from "./components/case02/actions.ts";
import f_13 from "./components/case01/actions.ts";
const actions = {
    $FSA_f_11_saveData: f_13,
    $FSA_f_12_saveData: f_14
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
