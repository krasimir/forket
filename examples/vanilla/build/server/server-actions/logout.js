export function logout(data, context) {
    "use server";
    context.response.clearCookie("forket");
    return true;
}
