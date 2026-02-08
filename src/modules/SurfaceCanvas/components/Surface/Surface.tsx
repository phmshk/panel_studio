import type { Surface as SurfaceType } from "@/shared/types";
import { PanelGroup } from "../PanelGroup/PanelGroup";
import { useState } from "react";
import { SurfaceMargins } from "../SurfaceMargins/SurfaceMargins";
import { BgImgRenderer } from "./BgImgRenderer/BgImgRenderer";

interface SurfaceProps {
  surface: SurfaceType;
  xPosition: number;
  maxHeight: number;
  selectedPanelGroupId: string | null;
  scaleFactor: number;
  bgImgGlobalWidth: number;
  bgImgGlobalHeight: number;
  bgImgGlobalX: number;
}

export const Surface = (props: SurfaceProps) => {
  const {
    surface,
    xPosition,
    maxHeight,
    selectedPanelGroupId,
    scaleFactor,
    bgImgGlobalWidth,
    bgImgGlobalHeight,
    bgImgGlobalX,
  } = props;

  const [overlayNode, setOverlayNode] = useState<SVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <svg
      width={surface.width}
      height={surface.height}
      x={xPosition}
      y={maxHeight - surface.height}
      viewBox={`0 0 ${surface.width} ${surface.height}`}
      className="overflow-visible"
    >
      <rect
        className="surface-layout-bounds"
        width={surface.width}
        height={surface.height}
        fill="none"
        pointerEvents="none"
      />
      <BgImgRenderer
        surfaceWidth={surface.width}
        totalWidth={bgImgGlobalWidth}
        maxHeight={bgImgGlobalHeight}
        surfaceHeight={surface.height}
        surfaceX={bgImgGlobalX}
        surfaceId={surface.id}
      />

      {surface.panelGroups.map((item) => (
        <PanelGroup
          key={item.id}
          panelGroup={item}
          surfaceId={surface.id}
          surfaceWidth={surface.width}
          surfaceHeight={surface.height}
          allGroups={surface.panelGroups}
          overlayNode={overlayNode}
          onDragStateChange={setIsDragging}
          selectedPanelGroupId={selectedPanelGroupId}
          scaleFactor={scaleFactor}
        />
      ))}
      {/* Overlay for guidelines */}
      <g ref={setOverlayNode} className="pointer-events-none touch-none" />
      {/* Surface margins */}
      {isDragging && (
        <SurfaceMargins width={surface.width} height={surface.height} />
      )}
    </svg>
  );
};
