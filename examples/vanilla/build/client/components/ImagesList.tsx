import React, { useContext } from 'react';
import { Image } from '../types';
import ImageComponent from './Image.js';
type ImagesListProps = {
    images: Image[];
    updating?: boolean;
    onDeleteImage: (id: string) => void;
};
export default function ImagesList({ images, updating, onDeleteImage }: ImagesListProps) {
    if (!images || images.length === 0) {
        return (<div className="loading-box mt1 pt1 tac">
        No images yet ...
      </div>);
    } else {
        return (<div className="loading-box grid2 gap03 mt1 pt1" data-loading={updating}>
        {images.map((image)=>(<ImageComponent key={image.id} id={image.id}>
            <p className="reset">{image.content}</p>
            <button className="reset abs" onClick={async ()=>{
                if (confirm('Are you sure?')) {
                    onDeleteImage(image.id);
                }
            }} style={{
                top: "12px",
                right: "18px"
            }}>
              ✖
            </button>
          </ImageComponent>))}
      </div>);
    }
}
