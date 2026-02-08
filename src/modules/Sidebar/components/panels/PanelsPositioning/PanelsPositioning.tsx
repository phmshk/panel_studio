import {
  ArrowRightFromLine,
  ArrowUpFromLine,
  Check,
  Crosshair,
  Move,
} from "lucide-react";
import { PositioningInput } from "./PositioningInput";
import type { Surface, PanelGroup } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";
import { canPlaceGroup } from "@/shared/utils";
import { getUpdatedPanelGroup } from "@/shared/utils/helpers";

interface PanelsPositioningProps {
  surface: Surface;
  activePanelGroup: PanelGroup;
  onAddPanel: () => void;
  updatePanelGroup: (data: Partial<PanelGroup>) => void;
}

export const PanelsPositioning = (props: PanelsPositioningProps) => {
  const { surface, activePanelGroup, onAddPanel, updatePanelGroup } = props;

  const validatePosition = (val: number, axis: "x" | "y") => {
    const potentialGroup = getUpdatedPanelGroup(activePanelGroup, {
      [axis]: val,
    });
    return canPlaceGroup(potentialGroup, surface, activePanelGroup.id);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-1 flex items-center gap-2 opacity-80">
        <Move className="text-primary h-4 w-4" />
        <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          Fine-tune Position
        </h3>
      </div>

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-end gap-4">
        {/* X AXIS */}
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground ml-1 flex items-center gap-2">
            <ArrowRightFromLine className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Offset X
            </span>
          </div>
          <PositioningInput
            limit={surface.width}
            defaultValue={activePanelGroup.x}
            onValueChange={(val) => updatePanelGroup({ x: val })}
            onValidate={(val) => validatePosition(val, "x")}
          />
        </div>

        <div className="flex flex-col items-center justify-center pb-4 opacity-20">
          <div className="bg-foreground/50 h-6 w-px" />
          <Crosshair className="my-1 h-4 w-4" />
          <div className="bg-foreground/50 h-6 w-px" />
        </div>

        {/* Y AXIS */}
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground ml-1 flex items-center gap-2">
            <ArrowUpFromLine className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Offset Y
            </span>
          </div>
          <PositioningInput
            limit={surface.height}
            defaultValue={activePanelGroup.y}
            onValueChange={(val) => updatePanelGroup({ y: val })}
            inverted
            onValidate={(val) => validatePosition(val, "y")}
          />
        </div>
      </div>

      <Button
        variant="default"
        size="lg"
        className="shadow-primary/20 mt-2 w-full gap-2 rounded-xl text-sm font-semibold shadow-md transition-all hover:shadow-lg"
        onClick={onAddPanel}
      >
        <Check className="h-4 w-4" />
        Confirm Placement
      </Button>
    </div>
  );
};
