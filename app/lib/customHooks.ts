import { useEffect, useRef, useState } from 'react';

export function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(element);
    setWidth(element.offsetWidth);

    return () => observer.disconnect();
  }, [ref.current]);

  return { ref, width };
}
