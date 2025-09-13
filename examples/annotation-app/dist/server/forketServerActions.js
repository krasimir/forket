import { updateImage as f_40 } from "./server-actions/data.js";
import { processImage as f_39 } from "./server-actions/data.js";
import { login as f_38 } from "./server-actions/auth.js";
import { logout as f_37 } from "./server-actions/auth.js";
import { AFf_7 as f_36 } from "./components/App.js";
import { AFf_6 as f_35 } from "./components/App.js";
const actions = {
  $FSA_f_23_AFf_6: f_35,
  $FSA_f_24_AFf_7: f_36,
  $FSA_f_25_logout: f_37,
  $FSA_f_26_login: f_38,
  $FSA_f_33_processImage: f_39,
  $FSA_f_34_updateImage: f_40
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
