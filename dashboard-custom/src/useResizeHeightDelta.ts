import { useRef, useCallback } from "react";

const useResizeHeightDelta = ({ onResizeHeightDelta }) => {
  const observerRef = useRef(null);
  const lastHeightRef = useRef(0);

  const setRef = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        lastHeightRef.current = node.offsetHeight;
        const observer = new ResizeObserver(() => {
          requestAnimationFrame(() => {
            const delta = node.offsetHeight - lastHeightRef.current;
            if (delta !== 0) {
              onResizeHeightDelta(delta);
              lastHeightRef.current = node.offsetHeight;
            }
          });
        });
        observer.observe(node);
        observerRef.current = observer;
      }
    },
    [onResizeHeightDelta],
  );

  return { setRef, observerRef };
};

export default useResizeHeightDelta;
