import React, { useContext } from 'react';

import { Image } from '../types';
import ImageComponent from './Image.js';

export default function ImagesList({ images }: { images?: Image[] }) {
  if (!images || images.length === 0) {
    return null;
  } else {
    return (
      <div className="images-list grid2 gap03 mt1 pt1">
        {images.map((image) => (
          <ImageComponent key={image.id} id={image.id}>
            <p className="reset">{image.content}</p>
          </ImageComponent>
        ))}
      </div>
    );
  }
}