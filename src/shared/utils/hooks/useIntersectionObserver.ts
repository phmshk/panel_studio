import { useEffect, useRef, useState, type RefObject } from "react";

interface ObserverItem {
  id: string;
  ref: RefObject<HTMLElement | null>;
}

export function useIntersectionObserver(
  items: ObserverItem[],
  options: IntersectionObserverInit,
) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const intersectionMap = useRef<Map<string, IntersectionObserverEntry>>(
    new Map(),
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id) {
          intersectionMap.current.set(entry.target.id, entry);
        }
      });

      const visibleEntries = Array.from(
        intersectionMap.current.values(),
      ).filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) =>
          prev.intersectionRect.height > current.intersectionRect.height
            ? prev
            : current,
        );

        if (mostVisible?.target?.id) {
          setActiveId(mostVisible.target.id);
        }
      }
    }, options);

    intersectionMap.current.clear();
    items.forEach((item) => {
      if (item.ref.current) {
        if (item.id && !item.ref.current.id) {
          item.ref.current.id = item.id;
        }
        observer.observe(item.ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items, options]);

  return { activeId, setActiveId };
}
