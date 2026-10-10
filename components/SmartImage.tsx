'use client';

import { useState } from 'react';

type SmartImageProps = {
  src: string;
  alt: string;
};

/**
 * Renders an <img> for a file served from public/images. If the file is not
 * there yet, the image is removed and its parent gets the `image-missing`
 * class so the layout keeps a placeholder box instead of a broken icon.
 */
export default function SmartImage({ src, alt }: SmartImageProps) {
  const [missing, setMissing] = useState(false);

  function handleError(event: React.SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.parentElement?.classList.add('image-missing');
    setMissing(true);
  }

  if (missing) {
    return null;
  }

  return <img src={src} alt={alt} onError={handleError} />;
}
