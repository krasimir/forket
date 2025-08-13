import { COOKIES } from "../constants.js";
export async function login(data, context) {
    "use server";
    await new Promise((resolve)=>setTimeout(resolve, 1000));
    if (!data.name || data.name === "" || !data.job || data.job === "") {
        return false;
    }
    context.response.cookie(COOKIES.name, data.name, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false
    });
    context.response.cookie(COOKIES.job, data.job, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false
    });
    return true;
}
export function logout(data, context) {
    "use server";
    context.response.clearCookie(COOKIES.name);
    context.response.clearCookie(COOKIES.job);
    return true;
}
