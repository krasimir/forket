import React, { createContext, ReactNode, useState } from "react";
import { Image } from "../types";

export const ImagesContext = createContext<{
  images: any[];
  setImages: (images: Image[]) => void;
}>({
  images: [],
  setImages: () => {}
});

export default function ImagesProvider({ initialImages, children }: { initialImages: Image[]; children: ReactNode }) {
  const [images, setImages] = useState<Image[]>(initialImages);
  return <ImagesContext.Provider value={{ images, setImages }}>{children}</ImagesContext.Provider>;
}
