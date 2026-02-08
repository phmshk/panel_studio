import { PANEL_SIZE } from "@/shared/constants";
import { Bolt } from "lucide-react";

interface PanelProps {
  x: number;
  y: number;
}

export const Panel = (props: PanelProps) => {
  const { x, y } = props;

  return (
    <g className="group touch-none">
      <rect
        x={x}
        y={y}
        width={PANEL_SIZE}
        height={PANEL_SIZE}
        className="fill-accent"
      />
      <Bolt
        x={x}
        y={y}
        width={PANEL_SIZE}
        height={PANEL_SIZE}
        className="pointer-events-none"
      />
    </g>
  );
};
