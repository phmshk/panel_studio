import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { SurfaceDimensions } from "./SurfaceDimensions/SurfaceDimensions";
import {
  useCurrentSurface,
  useSurfaces,
  useProjectActions,
} from "@/app/store/selectors";
import { cn } from "@/shared/utils";

export const DimensionsSelection = () => {
  const surfaces = useSurfaces();
  const { setSelectedSurfaceId, deleteSurface, resizeSurface, addSurface } =
    useProjectActions();
  const activeSurface = useCurrentSurface();

  return (
    <div className="flex w-full flex-col gap-6 pb-8">
      <div className="flex flex-col gap-1 text-center lg:text-left">
        <h2 className="text-foreground text-3xl font-light tracking-tight">
          Dimensions
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          Specify the area size for each zone
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {surfaces.map((surface, index) => (
          <div
            className="group outline-none"
            tabIndex={-1}
            onClick={() => setSelectedSurfaceId(surface.id)}
            key={surface.id}
          >
            <SurfaceDimensions
              count={index + 1}
              surface={surface}
              isSelected={activeSurface.id === surface.id}
              onDelete={() => deleteSurface(surface.id)}
              onDimensionsChange={(width: number, height: number) =>
                resizeSurface(surface.id, width, height)
              }
              lastSurface={surfaces.length === 1}
            />
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        className={cn(
          "relative flex h-20 w-full cursor-pointer items-center justify-center gap-3 rounded-3xl border-2 border-dashed transition-all duration-300",
          "border-border/60 text-muted-foreground bg-transparent",
          "hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
        )}
        onClick={(e) => {
          e.stopPropagation();
          const id = addSurface();
          setSelectedSurfaceId(id);
        }}
      >
        <div className="bg-secondary/50 group-hover:bg-primary group-hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors">
          <Plus className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium">Add Surface Zone</span>
      </Button>
    </div>
  );
};
