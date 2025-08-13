export default async function login(data, context) {
    "use server";
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    if (!data.username || data.username === "") {
        return false;
    }
    context.response.cookie("forket", data.username, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false
    });
    return true;
}
