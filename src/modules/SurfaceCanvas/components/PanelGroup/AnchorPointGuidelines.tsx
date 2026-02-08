import type { PanelGroupInfo } from "@/shared/types";
import { SURFACE_SIZE_TEXT, PANEL_SIZE } from "@/shared/constants";

interface AnchorPointGuidelinesProps {
  currGroup: PanelGroupInfo;
  surfaceHeight: number;
  scaleFactor: number;
}
export function AnchorPointGuidelnes(props: AnchorPointGuidelinesProps) {
  const { currGroup, surfaceHeight, scaleFactor } = props;

  const textStrokeProps = {
    stroke: "white",
    strokeWidth: SURFACE_SIZE_TEXT * scaleFactor * 0.2,
    paintOrder: "stroke",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <g className="pointer-events-none">
      {/*HORIZONTAL LINE*/}
      <line
        x1={currGroup.anchorPoint.x}
        x2={currGroup.anchorPoint.x}
        y1={surfaceHeight}
        y2={currGroup.anchorPoint.y}
        strokeDasharray="2"
        strokeWidth={0.2}
        className="stroke-secondary-foreground"
      />
      <text
        x={currGroup.anchorPoint.x / 2}
        y={currGroup.anchorPoint.y}
        dy={-PANEL_SIZE * scaleFactor}
        textAnchor="middle"
        fontSize={SURFACE_SIZE_TEXT * scaleFactor}
        className="fill-primary-foreground"
        {...textStrokeProps}
      >
        {currGroup.anchorPoint.x.toFixed(1)} cm
      </text>
      {/* VERTICAL LINE*/}
      <line
        x1={0}
        x2={currGroup.anchorPoint.x}
        y1={currGroup.anchorPoint.y}
        y2={currGroup.anchorPoint.y}
        strokeDasharray="2"
        strokeWidth={0.2}
        className="stroke-secondary-foreground"
      />

      <text
        x={currGroup.anchorPoint.x}
        dx={PANEL_SIZE * scaleFactor}
        y={(currGroup.anchorPoint.y + surfaceHeight) / 2}
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={SURFACE_SIZE_TEXT * scaleFactor}
        className="fill-primary-foreground"
        {...textStrokeProps}
      >
        {(surfaceHeight - currGroup.anchorPoint.y).toFixed(1)} cm
      </text>

      <circle
        cx={currGroup.anchorPoint.x}
        cy={currGroup.anchorPoint.y}
        r={0.5}
        className="fill-accent"
      />
    </g>
  );
}
