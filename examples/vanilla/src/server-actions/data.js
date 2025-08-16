export async function processImage(data, context) {
  "use server";
  
  const file = context.request.files[0];
  if (!file) throw new Error("No file uploaded");

  const buffer = file.buffer;
  return "ok";
}
