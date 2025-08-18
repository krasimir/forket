import React, { createContext, useState } from "react";
const ImagesContext = createContext({
  images: [],
  setImages: () => {
  }
});
function ImagesProvider({ initialImages, children }) {
  const [images, setImages] = useState(initialImages);
  return /* @__PURE__ */ React.createElement(ImagesContext.Provider, { value: { images, setImages } }, children);
}
export {
  ImagesContext,
  ImagesProvider as default
};
