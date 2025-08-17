'use client';
import React, { useActionState } from "react";

export default function ImageUploader({ processImage }) {
  const [result, formAction, isPending] = useActionState(async (currentState, formData) => {
    return await processImage(formData);
  }, null);

  function uploadImage(e) {
    const form = e.currentTarget.form;
    if (e.currentTarget.files?.length > 0 && form) {
      // Triggers a real submit event that React can intercept for the server action
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); // fallback
    }
  }

  console.log(result);

  return (
    <div className="image-uploader">
      <form action={formAction}>
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
            disabled={isPending}
          />
        </label>
      </form>
    </div>
  );
}