import {
  useProjectActions,
  useSelectedPanelGroupId,
} from "@/app/store/selectors";
import type { Surface } from "@/shared/types";
import { cn, findNextAvailablePosition } from "@/shared/utils";
import { Info, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

interface SurfacesSelectionProps {
  surfaces: Surface[];
  setSelectedSurfaceId: (id: string) => void;
  activeSurface: Surface;
  isDisabled: boolean;
}

export const SurfacesSelection = (props: SurfacesSelectionProps) => {
  const { surfaces, setSelectedSurfaceId, activeSurface, isDisabled } = props;

  const selectedPanelGroupId = useSelectedPanelGroupId();
  const { movePanelGroupToDifferentSurface } = useProjectActions();

  const selectedPanelGroup = activeSurface.panelGroups.find(
    (g) => g.id === selectedPanelGroupId,
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 opacity-80">
        <LayoutGrid className="text-primary h-4 w-4" />
        <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          Active Zone
        </h3>
      </div>

      <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto pb-2">
        {surfaces.map((surface, index) => {
          const isSelected = activeSurface.id === surface.id;

          const canFitSelectedPanelGroup = selectedPanelGroup
            ? findNextAvailablePosition(
                surface,
                selectedPanelGroup.count,
                selectedPanelGroup.orientation,
              )
            : false;

          const handleClick = () => {
            if (isDisabled) {
              if (isSelected) return;

              if (canFitSelectedPanelGroup) {
                movePanelGroupToDifferentSurface(surface.id);
              } else {
                toast.custom(() => (
                  <div className="bg-destructive/5 text-destructive border-destructive/20 flex items-center gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md">
                    <Info className="h-4 w-4" />
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-semibold">Capacity Alert</h3>
                      <p className="text-xs opacity-90">
                        Zone dimensions insufficient.
                      </p>
                    </div>
                  </div>
                ));
              }
              return;
            }
            setSelectedSurfaceId(surface.id);
          };

          const showNotAllowed =
            isDisabled && !canFitSelectedPanelGroup && !isSelected;

          return (
            <button
              key={surface.id}
              onClick={handleClick}
              className={cn(
                "group relative flex h-24 min-w-24 cursor-pointer flex-col items-center overflow-hidden rounded-2xl border p-3 transition-all duration-300",
                isSelected
                  ? "border-primary bg-primary/5 ring-primary/20 shadow-md ring-1"
                  : "border-border/50 bg-secondary/10 hover:border-primary/30 hover:bg-secondary/20",
                showNotAllowed && "cursor-not-allowed opacity-40 grayscale",
              )}
            >
              <div className="flex w-full flex-1 items-center justify-center">
                <div
                  className={cn(
                    "rounded border opacity-60 transition-all duration-300",
                    isSelected
                      ? "border-primary bg-primary/20"
                      : "border-foreground/20 bg-foreground/5 group-hover:border-primary/40",
                  )}
                  style={{
                    aspectRatio: `${surface.width} / ${surface.height}`,
                    width: surface.width >= surface.height ? "60%" : "auto",
                    height: surface.width >= surface.height ? "auto" : "60%",
                  }}
                />
              </div>

              <div className="mt-auto flex flex-col items-center">
                <span
                  className={cn(
                    "text-xs font-bold transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  Zone {index + 1}
                </span>
                <span className="text-muted-foreground/60 text-[10px] leading-tight">
                  {surface.width} × {surface.height}cm
                </span>
              </div>

              {isSelected && (
                <span className="bg-primary absolute top-2 right-2 h-1.5 w-1.5 animate-pulse rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
