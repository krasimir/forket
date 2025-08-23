import { updateName } from "./components/server-fucntions-with-actions/actions.js";
import { updateUsername } from "./components/server-functions-with-form-actions/actions.js";
import { createNote } from "./components/importing-server-functions-from-client-components/actions.js";
import { createNoteAction } from "./components/creating-server-function-from-server-component/Page.js";
import { getLikeCount } from "./components/calling-server-function-outside-form/actions.js";
import { incrementLike } from "./components/calling-server-function-outside-form/actions.js";
const actions = {
  $FSA_incrementLike: incrementLike,
  $FSA_getLikeCount: getLikeCount,
  $FSA_createNoteAction: createNoteAction,
  $FSA_createNote: createNote,
  $FSA_updateUsername: updateUsername,
  $FSA_updateName: updateName
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
