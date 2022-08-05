import { useState, useEffect } from "react";

function useTouchable() {
  const [isTouchable, setIsTouchable] = useState<boolean>(false);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchable(true);
    }
  }, [isTouchable]);

  return isTouchable;
}

export default useTouchable;
