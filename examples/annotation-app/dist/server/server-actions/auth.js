import { COOKIES } from "../constants.js";
async function login(data, context) {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 1e3));
  if (!data.name || data.name === "") {
    return false;
  }
  context.response.cookie(COOKIES.name, data.name, {
    httpOnly: true,
    maxAge: 1e3 * 60 * 60,
    secure: false
  });
  return true;
}
function logout(data, context) {
  "use server";
  context.response.clearCookie(COOKIES.name);
  return true;
}
export {
  login,
  logout
};
