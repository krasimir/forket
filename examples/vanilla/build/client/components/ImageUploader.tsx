'use client';
import React from 'react';

export default function ImageUploader({ processImage }) {
  function uploadImage(e) {
    const form = e.currentTarget.form;
    if (e.currentTarget.files?.length > 0 && form) {
      // Triggers a real submit event that React can intercept for the server action
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); // fallback
    }
  }
  return (
    <div className="image-uploader">
      <form action={processImage} encType="multipart/form-data">
        <label htmlFor="image">
          <span className="btn">Upload image</span>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            className="hide"
            onChange={uploadImage}
          />
        </label>
      </form>
    </div>
  );
}