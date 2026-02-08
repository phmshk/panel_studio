import { useCallback, useEffect, useRef, useState } from "react";

interface UseDragNDropParams {
  initialX: number;
  initialY: number;
  onDrag: (x: number, y: number) => void;
  onDragEnd: (x: number, y: number) => void;
}

export const useDragNDrop = ({
  initialX,
  initialY,
  onDrag,
  onDragEnd,
}: UseDragNDropParams) => {
  const [dragStart, setDragStart] = useState<{
    mouseX: number;
    mouseY: number;
    originalX: number;
    originalY: number;
    scaleX: number;
    scaleY: number;
    pointerId: number;
    target: Element;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const callbacksRef = useRef({ onDrag, onDragEnd });

  useEffect(() => {
    callbacksRef.current = { onDrag, onDragEnd };
  }, [onDrag, onDragEnd]);

  const requestRef = useRef<number | null>(null);

  const startDragging = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // helps not to loose the element on quick dragging (found in the web)
      (e.target as Element).setPointerCapture(e.pointerId);

      const parentSurface = (e.target as Element).closest("svg");

      if (!parentSurface) {
        console.error("No parent surface found");
        return;
      }

      const refRect = parentSurface.querySelector(".surface-layout-bounds");
      const measureTarget = refRect || parentSurface;

      // get size of surface in px
      const domRect = measureTarget.getBoundingClientRect();

      // get size of surface in cm
      const viewBoxWidth = parentSurface.viewBox.baseVal.width;
      const viewBoxHeight = parentSurface.viewBox.baseVal.height;

      // find scaling between px and cm
      const scaling = {
        x: viewBoxWidth / domRect.width,
        y: viewBoxHeight / domRect.height,
      };

      setDragStart({
        mouseX: e.clientX,
        mouseY: e.clientY,
        originalX: initialX,
        originalY: initialY,
        scaleX: scaling.x,
        scaleY: scaling.y,
        pointerId: e.pointerId,
        target: e.target as Element,
      });
      setIsDragging(true);
    },
    [initialX, initialY],
  );

  useEffect(() => {
    if (!isDragging || !dragStart) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerId !== dragStart.pointerId) return;

      e.preventDefault();

      // mouse position change in px
      const dPxX = e.clientX - dragStart.mouseX;
      const dPxY = e.clientY - dragStart.mouseY;

      // px to cm
      const dCmX = dPxX * dragStart.scaleX;
      const dCmY = dPxY * dragStart.scaleY;

      const newCmX = dragStart.originalX + dCmX;
      const newCmY = dragStart.originalY + dCmY;

      if (requestRef.current) return;

      requestRef.current = requestAnimationFrame(() => {
        callbacksRef.current.onDrag(newCmX, newCmY);
        requestRef.current = null;
      });
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerId !== dragStart.pointerId) return;

      dragStart.target.releasePointerCapture(dragStart.pointerId);

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }

      // calculate position again to pass it to parent
      // mouse position change in px
      const dPxX = e.clientX - dragStart.mouseX;
      const dPxY = e.clientY - dragStart.mouseY;

      // px to cm
      const dCmX = dPxX * dragStart.scaleX;
      const dCmY = dPxY * dragStart.scaleY;

      const finalX = dragStart.originalX + dCmX;
      const finalY = dragStart.originalY + dCmY;

      callbacksRef.current.onDragEnd(finalX, finalY);

      setIsDragging(false);
      setDragStart(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isDragging, dragStart]);

  return { isDragging, startDragging };
};
