export default function processChunk(res) {
  function replaceAllBoundaryTags(html) {
    html = html
      .replace(/<boundary_f_(\d+)>/g, (_, n) => `<!-- $f_${n} -->`)
      .replace(/<\/boundary_f_(\d+)>/g, (_, n) => `<!-- /$f_${n} -->`)
      .replace(/<boundary_children_f_(\d+)>/g, (_, n) => `<script type="forket/children" id="f_${n}_children">`)
      .replace(/<\/boundary_children_f_(\d+)>/g, (_, n) => `</script>`)
      .replace(/<boundary_props_f_(\d+)>/g, (_, n) => `<script type="forket/props" id="f_${n}_props">`)
      .replace(/<\/boundary_props_f_(\d+)>/g, (_, n) => `</script>`)
      .replace(/<boundary_setup_f_(\d+)>/g, (_, n) => `<script id="f_${n}_setup">`)
      .replace(/<\/boundary_setup_f_(\d+)>/g, (_, n) => `</script>`);
    return html;
  }
  const originalWrite = res.write;
  res.write = (chunk) => {
    let str;
    if (Buffer.isBuffer(chunk)) {
      str = chunk.toString("utf8");
    } else if (chunk instanceof Uint8Array) {
      str = Buffer.from(chunk).toString("utf8");
    } else if (typeof chunk === "string") {
      str = chunk;
    } else {
      console.warn("Unknown chunk type:", chunk);
      str = String(chunk);
    }
    str = replaceAllBoundaryTags(str);
    originalWrite.call(res, Buffer.from(str, "utf8"));
  };
}