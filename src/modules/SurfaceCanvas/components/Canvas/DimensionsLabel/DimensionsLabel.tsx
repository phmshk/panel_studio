import { SURFACE_SIZE_TEXT, SURFACE_SIZE_TEXT_GAP } from "@/shared/constants";

interface DimensionLabelProps {
  x: number;
  yBase: number;
  width: number;
  height: number;
  scaleFactor: number;
}

export const DimensionLabel = ({
  x,
  yBase,
  width,
  height,
  scaleFactor,
}: DimensionLabelProps) => {
  return (
    <text
      x={x}
      y={yBase + SURFACE_SIZE_TEXT_GAP * scaleFactor}
      textAnchor="middle"
      dominantBaseline="hanging"
      fontSize={scaleFactor * SURFACE_SIZE_TEXT}
      className="fill-secondary-foreground pointer-events-none font-medium select-none"
    >
      {`${width} x ${height} cm`}
    </text>
  );
};
