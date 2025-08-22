'use client'
import React, { useState, useTransition } from "react";
// import { processImage } from '../server-actions/data.js';

import ImageUploader from './ImageUploader.js';
import ImagesList from './ImagesList.js';
import { Image } from '../types';

type ImagesManagerProps = {
  username: string;
  updateImage: Function;
  initialImages?: Image[];
  getImages: (data: any) => Promise<Image[]>;
  deleteImage: Function
};

export default function ImagesManager({
  username,
  updateImage,
  initialImages = [],
  getImages,
  deleteImage
}: ImagesManagerProps) {
  const [images, setImages] = useState<Image[]>(initialImages);
  const [isUpdating, startUpdating] = useTransition();

  async function onImageUpdated() {
    startUpdating(async () => {
      const images = await getImages(username);
      setImages(images);
    });
  }
  async function onDeleteImage(id: string) {
    startUpdating(async () => {
      await deleteImage(id);
      const images = await getImages(username);
      setImages(images);
    });
  }
  const processImage = async () => {}
  return (
    <>
      <ImageUploader processImage={processImage} updateImage={updateImage} onImageUpdated={onImageUpdated} />
      <ImagesList images={images} updating={isUpdating} onDeleteImage={onDeleteImage} />
    </>
  );
}