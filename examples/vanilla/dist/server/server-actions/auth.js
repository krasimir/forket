import { COOKIES } from "../constants.js";
async function login(data, context) {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 1e3));
  if (!data.name || data.name === "" || !data.job || data.job === "") {
    return false;
  }
  context.response.cookie(COOKIES.name, data.name, {
    httpOnly: true,
    maxAge: 1e3 * 60 * 60,
    secure: false
  });
  context.response.cookie(COOKIES.job, data.job, {
    httpOnly: true,
    maxAge: 1e3 * 60 * 60,
    secure: false
  });
  return true;
}
function logout(data, context) {
  "use server";
  context.response.clearCookie(COOKIES.name);
  context.response.clearCookie(COOKIES.job);
  return true;
}
export {
  login,
  logout
};
