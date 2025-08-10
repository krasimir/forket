import { login } from "./components/App.js";
const actions = {
  $FSA_f_1: login
};
function forketServerActions(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (!req.body) {
    console.warn(`\u200E\u{10090} Forket: the request object has no body.`);
    res.status(400).json({
      error: "No body provided"
    });
    return;
  }
  if (!req.body.id) {
    console.warn(`\u200E\u{10090} Forket: the request object body has no id.`);
    res.status(400).json({
      error: "No id provided"
    });
    return;
  }
  const id = req.body.id;
  res.json(actions[id](req.body.data || {}));
}
export {
  forketServerActions as default
};
