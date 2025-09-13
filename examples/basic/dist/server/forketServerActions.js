import { updateUsername as f_61 } from "./components/server-functions-with-form-actions/actions.js";
import { updateMyName as f_60 } from "./components/server-functions-with-actions/actions.js";
import { createNote as f_59 } from "./components/importing-server-functions-from-client-components/actions.js";
import { createNoteAction as f_58 } from "./components/creating-server-function-from-server-component/Page.js";
import { getLikeCount as f_57 } from "./components/calling-server-function-outside-form/actions.js";
import { incrementLike as f_56 } from "./components/calling-server-function-outside-form/actions.js";
const actions = {
  $FSA_f_52_incrementLike: f_56,
  $FSA_f_39_getLikeCount: f_57,
  $FSA_f_41_createNoteAction: f_58,
  $FSA_f_53_createNote: f_59,
  $FSA_f_54_updateMyName: f_60,
  $FSA_f_55_updateUsername: f_61
};
async function forketServerActions(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (!req.body && !req.files) {
    console.warn(`\u200E\u{10090} Forket: the request object has no body.`);
    res.status(400).json({
      error: "No body provided"
    });
    return;
  }
  if (!req.body.__actionId) {
    console.warn(`\u200E\u{10090} Forket: the request object body has no id.`);
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
    console.error(`\u200E\u{10090} Forket: error in server action ${id}:`, error);
    res.status(200).json({
      error: error.message || `Error in server action ${id}`
    });
  }
}
export {
  forketServerActions as default
};
