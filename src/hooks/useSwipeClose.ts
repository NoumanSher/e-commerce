import { useEffect, useRef } from "react";

const useSwipeClose = (elementId: string, onClose: () => void, threshold = 50) => {
  const startX = useRef<number | null>(null);
  const endX = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      endX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (
        startX.current !== null &&
        endX.current !== null &&
        Math.abs(endX.current - startX.current) > threshold
      ) {
        onClose();
      }

      startX.current = null;
      endX.current = null;
    };

    const targetElement = document.getElementById(elementId);

    if (targetElement) {
      targetElement.addEventListener("touchstart", handleTouchStart);
      targetElement.addEventListener("touchmove", handleTouchMove);
      targetElement.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (targetElement) {
        targetElement.removeEventListener("touchstart", handleTouchStart);
        targetElement.removeEventListener("touchmove", handleTouchMove);
        targetElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [elementId, onClose, threshold]);
};

export default useSwipeClose;
