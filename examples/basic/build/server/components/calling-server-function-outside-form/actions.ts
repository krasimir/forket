"use server";
let likeCount = 0;
export async function incrementLike() {
    likeCount++;
    return likeCount;
}
export function getLikeCount() {
    return likeCount;
}
