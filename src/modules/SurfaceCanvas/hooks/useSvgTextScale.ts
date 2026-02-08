import { useEffect, useRef, useState, type RefObject } from "react";

interface UseSvgTextScaleResult {
  svgRef: RefObject<SVGSVGElement | null>;
  scaleFactor: number;
}

export function useSvgTextScale(
  viewBox: string | undefined,
): UseSvgTextScaleResult {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const viewBoxWidth = viewBox ? parseInt(viewBox.split(" ")[2]) : 0;

    const updateScale = () => {
      const clientWidth = svgEl.clientWidth;
      if (clientWidth > 0 && viewBoxWidth > 0) {
        setScaleFactor(viewBoxWidth / clientWidth);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(svgEl);

    return () => observer.disconnect();
  }, [viewBox]);

  return { svgRef, scaleFactor };
}
