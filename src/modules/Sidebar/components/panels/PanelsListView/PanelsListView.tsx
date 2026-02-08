import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import {
  Trash2,
  Pencil,
  MoreVertical,
  Info,
  CircleCheck,
  Plus,
  Box,
} from "lucide-react";
import { useMemo, type MouseEvent } from "react";
import { findNextAvailablePosition } from "@/shared/utils";
import type { Surface } from "@/shared/types";
import {
  useSurfaces,
  useProjectActions,
  useSelectedPanelGroupId,
} from "@/app/store/selectors";

interface PanelsListViewProps {
  activeSurface: Surface;
}

export const PanelsListView = (props: PanelsListViewProps) => {
  const { activeSurface } = props;

  const surfaces = useSurfaces();
  const selectedPanelGroupId = useSelectedPanelGroupId();
  const {
    addPanelGroup,
    removePanelGroup,
    setSelectedSurfaceId,
    setSelectedPanelGroupId,
    setHoveredPanelGroupId,
  } = useProjectActions();
  const totalPanelGroupsCount = surfaces.reduce(
    (acc, surface) => acc + surface.panelGroups.length,
    0,
  );

  const handleSelectPanelGroup = (groupId: string, surfaceId: string) => {
    setSelectedSurfaceId(surfaceId);
    setSelectedPanelGroupId(groupId);
  };

  const nextAvailablePosition = useMemo(
    () => findNextAvailablePosition(activeSurface, 1, "horizontal"),
    [activeSurface],
  );

  const canAddMore = !!nextAvailablePosition;

  const handleAddPanelGroup = () => {
    if (nextAvailablePosition) {
      const id = addPanelGroup(activeSurface.id, nextAvailablePosition);
      if (id) setSelectedPanelGroupId(id);
    }
  };

  const handleSelect = (
    groupId: string,
    surfaceId: string,
    e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    handleSelectPanelGroup(groupId, surfaceId);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Status Badge */}
      {selectedPanelGroupId && totalPanelGroupsCount > 1 && (
        <div className="animate-in fade-in slide-in-from-top-2 mx-auto flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-600">
          <CircleCheck className="h-3.5 w-3.5" />
          <span>Configuration saved</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {surfaces.map((surface, index) =>
          surface.panelGroups.map((group) => {
            if (group.id === selectedPanelGroupId) return null;
            return (
              <div
                aria-label="Solar array configuration card"
                key={group.id}
                className="group border-border/40 bg-card hover:border-primary/20 hover:shadow-primary/5 relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                onClick={(e) => handleSelect(group.id, surface.id, e)}
                onMouseEnter={() => setHoveredPanelGroupId(group.id)}
                onMouseLeave={() => setHoveredPanelGroupId(null)}
              >
                <div className="flex items-center gap-4">
                  {/* Icon Box */}
                  <div className="bg-secondary/30 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                    <Box className="h-6 w-6 stroke-1" />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-0.5">
                    <div className="text-muted-foreground/70 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                      <span>Zone {index + 1}</span>
                      <span className="text-border">•</span>
                      <span>
                        {surface.width} × {surface.height}cm
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground text-lg font-semibold">
                        {group.count} Module(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actns Dropdown */}
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground/50 hover:text-foreground h-8 w-8 rounded-full"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-border/50 rounded-xl p-1 shadow-xl"
                    >
                      <DropdownMenuItem
                        className="focus:bg-primary/5 focus:text-primary cursor-pointer rounded-lg py-2 text-xs font-medium"
                        onClick={() =>
                          handleSelectPanelGroup(group.id, surface.id)
                        }
                      >
                        <Pencil className="mr-2 h-3.5 w-3.5 opacity-70" />
                        Edit Configuration
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => removePanelGroup(surface.id, group.id)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg py-2 text-xs font-medium"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5 opacity-70" />
                        Delete Array
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          }),
        )}
      </div>

      {!canAddMore && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-600 shadow-sm">
          <Info className="h-5 w-5 shrink-0" />
          <p className="text-xs leading-relaxed font-medium">
            Capacity Limit Reached. Expand zone size to add more.
          </p>
        </div>
      )}

      {!selectedPanelGroupId && (
        <Button
          variant="ghost"
          className="group border-border/60 hover:border-primary/40 hover:bg-primary/5 relative flex h-20 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all"
          onClick={handleAddPanelGroup}
          disabled={!canAddMore}
        >
          <div className="bg-secondary/50 flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:scale-110">
            <Plus className="text-foreground h-4 w-4" />
          </div>
          <span className="text-muted-foreground group-hover:text-primary text-xs font-semibold">
            {nextAvailablePosition ? "Deploy New Array" : "No space available"}
          </span>
        </Button>
      )}
    </div>
  );
};
