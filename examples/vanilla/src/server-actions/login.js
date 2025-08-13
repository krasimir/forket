export default async function login(data, context) {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
  if (!data.username || data.username === "") {
    return false;
  }
  context.response.cookie("forket", data.username, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
    secure: false // allow in local dev without HTTPS
  });
  return true;
}