'use client';
import React, { useActionState } from "react";
import Image from "./Image.js";

export default function ImageUploader({ processImage }) {
  const [result, formAction, isPending] = useActionState(async (currentState, formData) => {
    return await processImage(formData);
  }, null);

  function uploadImage(e) {
    const form = e.currentTarget.form;
    if (e.currentTarget.files?.length > 0 && form) {
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  }

  return (
    <div>
      {isPending && <Image isPlaceholder className="mb1" />}
      {!isPending && result && (
        <Image className="mb1" id={result.id}>
          <p>...</p>
        </Image>
      )}
      <form action={formAction}>
        <label htmlFor="image" className="bordered p1">
          <span className="btn" aria-disabled={isPending}>
            {isPending ? 'Reading the image ...' : 'Upload image'}
          </span>
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