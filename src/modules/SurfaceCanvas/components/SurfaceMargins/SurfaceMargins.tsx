import { PANEL_MARGIN_FROM_EDGE } from "@/shared/constants";

interface SurfaceMarginsProps {
  width: number;
  height: number;
}

export const SurfaceMargins = ({ width, height }: SurfaceMarginsProps) => {
  return (
    <rect
      x={PANEL_MARGIN_FROM_EDGE}
      y={PANEL_MARGIN_FROM_EDGE}
      width={width - PANEL_MARGIN_FROM_EDGE * 2}
      height={height - PANEL_MARGIN_FROM_EDGE * 2}
      strokeWidth="2"
      strokeDasharray="4 6"
      fill="transparent"
      className="stroke-secondary-foreground pointer-events-none"
      vectorEffect="non-scaling-stroke"
    />
  );
};
