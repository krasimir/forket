import { login } from "./components/App.js";
const actions = {
  $FSA_f_1: login
};
async function forketServerActions(req, res) {
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
  const context = {
    request: req,
    response: res
  };
  try {
    const result = await actions[id](req.body.data || {}, context);
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
