import { processImage } from "./server-actions/data.js";
import { updateImage } from "./server-actions/data.js";
import { login } from "./server-actions/auth.js";
import { logout } from "./server-actions/auth.js";
import { AFf_7 } from "./components/App.js";
import { AFf_6 } from "./components/App.js";
const actions = {
  $FSA_AFf_6: AFf_6,
  $FSA_AFf_7: AFf_7,
  $FSA_logout: logout,
  $FSA_login: login,
  $FSA_updateImage: updateImage,
  $FSA_processImage: processImage
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
