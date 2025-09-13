import { COOKIES } from "../constants.js";
export async function login(data, context) {
    "use server";
    await new Promise((resolve)=>setTimeout(resolve, 1000));
    if (!data.get('name') || data.get('name') === "") {
        return false;
    }
    context.response.cookie(COOKIES.name, data.get('name'), {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false
    });
    return true;
}
export function logout(context) {
    "use server";
    context.response.clearCookie(COOKIES.name);
    return true;
}
