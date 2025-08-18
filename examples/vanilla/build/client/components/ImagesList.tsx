'use client';

import React from 'react';

import { Image } from '../types';
import ImageComponent from './Image.js';

type ImagesListProps = {
  images: Image[];
};

export default function ImagesList({ images }: ImagesListProps) {
  if (!images || images.length === 0) {
    return null;
  } else {
    return (
      <div className="grid2 gap03 mt1">
        {images.map((image) => (
          <ImageComponent key={image.id} id={image.id}>
            <p className="reset">{image.content}</p>
          </ImageComponent>
        ))}
      </div>
    );
  }
}