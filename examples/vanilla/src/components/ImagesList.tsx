'use client';

import React, { useContext } from 'react';

import { Image } from '../types';
import ImageComponent from './Image.js';
import { ImagesContext } from '../contexts/ImagesContext.js';

export default function ImagesList() {
  const { images } = useContext(ImagesContext);
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