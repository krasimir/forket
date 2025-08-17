'use client';

import React from 'react';

import { Image } from '../types';
import ImageComponent from './Image.js';

type ImagesListProps = {
  images: Image[]
}

export default function ImagesList({ images }: ImagesListProps) {
  if (!images || images.length === 0) {
    return <p className="p1">No images uploaded yet.</p>;
  } else {
    return (
      <div className="grid gap1">
        {images.map((image) => (
          <ImageComponent key={image.id} className="mb1" id={image.id}>
            <p>{image.content}</p>
          </ImageComponent>
        ))}
      </div>
    );
  }
}