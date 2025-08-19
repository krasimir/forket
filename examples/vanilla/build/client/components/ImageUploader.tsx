import React, { useActionState, useState, useTransition } from "react";
import Image from "./Image.js";
import { Suggestion } from "../types.js";

type ImageUploaderProps = {
  processImage: (formData: FormData) => Promise<any>;
  updateImage: Function;
}
type ProcessedImageResponse = { id: string; suggestions: Suggestion[] };

export default function ImageUploader({ processImage, updateImage }: ImageUploaderProps) {
  const [processedImage, setProcessedImage] = useState<ProcessedImageResponse | null>(null);
  const [ isImageUpdating, startImageUpdate ] = useTransition();
  let [_, formAction, isPending] = useActionState(async (currentState, formData) => {
    const result = await processImage(formData);
    setProcessedImage(result);
  }, null);

  function uploadImage(e) {
    const form = e.currentTarget.form;
    if (e.currentTarget.files?.length > 0 && form) {
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  }
  function setImageContent(id, content) {
    startImageUpdate(async () => {
      await updateImage(id, content)
      setProcessedImage(null);
    });
  }

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="image" className="p1">
          <span className="btn" aria-disabled={isPending}>
            {isPending ? "Reading the image ..." : "Upload image"}
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
      {isPending && <Image isPlaceholder className="mt1" />}
      {!isPending && processedImage && (
        <Image className="mt1" id={processedImage.id}>
          <ul className="reset">
            {processedImage.suggestions.map((item, index) => (
              <li key={index}>
                <button
                  className="reset"
                  onClick={() => setImageContent(processedImage.id, item.label)}
                  disabled={isImageUpdating}
                >
                  {Math.round(item.score * 100)}% - <strong>{item.label}</strong>
                </button>
              </li>
            ))}
          </ul>
        </Image>
      )}
    </div>
  );
}