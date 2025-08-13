async function login(data, context) {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 1e3));
  if (!data.username || data.username === "") {
    return false;
  }
  context.response.cookie("forket", data.username, {
    httpOnly: true,
    maxAge: 1e3 * 60 * 60,
    secure: false
  });
  return true;
}
export {
  login
};
