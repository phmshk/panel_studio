import { Button } from "@/shared/components/ui/button";
import {
  MAX_SURFACE_HEIGHT,
  MAX_SURFACE_WIDTH,
  MIN_SURFACE_HEIGHT,
  MIN_SURFACE_WIDTH,
} from "@/shared/constants";
import type { Surface } from "@/shared/types";
import { Trash2, X } from "lucide-react";
import { DimensionInput } from "./DimensionsInput";
import { cn } from "@/shared/utils";

interface SurfaceDimensionsProps {
  surface: Surface;
  count: number;
  isSelected: boolean;
  onDelete: () => void;
  lastSurface: boolean;
  onDimensionsChange: (width: number, height: number) => void;
}

export const SurfaceDimensions = (props: SurfaceDimensionsProps) => {
  const {
    surface,
    count,
    isSelected,
    onDelete,
    lastSurface,
    onDimensionsChange,
  } = props;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-3xl border p-5 transition-all duration-300 ease-out",
        isSelected
          ? "bg-background border-primary/20 shadow-primary/5 ring-primary/10 shadow-lg ring-1"
          : "bg-background/40 hover:bg-background/80 hover:border-border/30 border-transparent hover:shadow-sm",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {count}
          </span>
          <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            Zone
          </span>
        </div>

        {!lastSurface && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 h-7 w-7 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <DimensionInput
          dimension="width"
          isSelected={isSelected}
          max={MAX_SURFACE_WIDTH}
          min={MIN_SURFACE_WIDTH}
          defaultValue={surface.width}
          onValueChange={(newWidth) =>
            onDimensionsChange(newWidth, surface.height)
          }
        />

        <div className="text-muted-foreground/20 flex items-center justify-center">
          <X className="h-4 w-4" />
        </div>

        <DimensionInput
          dimension="height"
          isSelected={isSelected}
          max={MAX_SURFACE_HEIGHT}
          min={MIN_SURFACE_HEIGHT}
          defaultValue={surface.height}
          onValueChange={(newHeight) =>
            onDimensionsChange(surface.width, newHeight)
          }
        />
      </div>
    </div>
  );
};
