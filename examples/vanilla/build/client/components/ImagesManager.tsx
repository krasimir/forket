'use client'
import React from 'react';

import ImageUploader from './ImageUploader.js';
import ImagesList from './ImagesList.js';
import { Image } from '../types';

type ImagesManagerProps = {
  processImage: (formData: FormData) => Promise<any>;
  updateImage: Function;
  images?: Image[];
}

export default function ImagesManager({ processImage, updateImage, images = [] }: ImagesManagerProps) {
  return (
    <>
      <ImageUploader processImage={processImage} updateImage={updateImage} />
      <ImagesList images={images} />
    </>
  );
}