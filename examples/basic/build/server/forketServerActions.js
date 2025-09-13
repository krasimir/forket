import { updateUsername as f_61 } from "./components/server-functions-with-form-actions/actions.ts";
import { updateMyName as f_60 } from "./components/server-functions-with-actions/actions.ts";
import { createNote as f_59 } from "./components/importing-server-functions-from-client-components/actions.ts";
import { createNoteAction as f_58 } from "./components/creating-server-function-from-server-component/Page.tsx";
import { getLikeCount as f_57 } from "./components/calling-server-function-outside-form/actions.ts";
import { incrementLike as f_56 } from "./components/calling-server-function-outside-form/actions.ts";
const actions = {
    $FSA_f_52_incrementLike: f_56,
    $FSA_f_39_getLikeCount: f_57,
    $FSA_f_41_createNoteAction: f_58,
    $FSA_f_53_createNote: f_59,
    $FSA_f_54_updateMyName: f_60,
    $FSA_f_55_updateUsername: f_61
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
