import { useState, useEffect } from "react";

function useMediaLoaded(mediaURL: string) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (isLoaded) return;

    const media = document.createElement("img");

    const handleMediaLoad = () => setIsLoaded(true);
    const handleMediaError = () =>
      console.error(
        `Не удалось загрузить изображение по данному URL: ${mediaURL}.`
      );

    media.addEventListener("load", handleMediaLoad);

    media.addEventListener("error", handleMediaError);

    media.src = mediaURL;
    media.onerror;

    return () => {
      media.removeEventListener("load", handleMediaLoad);
      media.removeEventListener("error", handleMediaError);
    };
  }, [isLoaded]);

  return isLoaded;
}

export default useMediaLoaded;
