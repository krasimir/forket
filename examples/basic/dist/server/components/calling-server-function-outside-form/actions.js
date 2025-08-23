"use server";
let likeCount = 0;
async function incrementLike() {
  likeCount++;
  return likeCount;
}
function getLikeCount() {
  return likeCount;
}
export {
  getLikeCount,
  incrementLike
};
