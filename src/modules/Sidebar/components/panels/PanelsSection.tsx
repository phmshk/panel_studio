import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useMemo } from "react";
import {
  MIN_SURFACE_HEIGHT_FOR_PANEL,
  MIN_SURFACE_WIDTH_FOR_PANEL,
} from "@/shared/constants";
import { Info } from "lucide-react";
import { SurfacesSelection } from "./SurfacesSelection/SurfacesSelection";
import { PanelsSelection } from "./PanelSelection/PanelSelection";
import { PanelsPositioning } from "./PanelsPositioning/PanelsPositioning";
import { PanelsListView } from "./PanelsListView/PanelsListView";
import {
  useCurrentSurface,
  useSurfaces,
  useProjectActions,
  useSelectedPanelGroupId,
  usePanelMode,
} from "@/app/store/selectors";

export const PanelsSection = () => {
  const surfaces = useSurfaces();
  const panelModeIsOn = usePanelMode();
  const selectedPanelGroupId = useSelectedPanelGroupId();
  const {
    togglePanelMode,
    updatePanelGroup,
    setSelectedSurfaceId,
    setSelectedPanelGroupId,
  } = useProjectActions();
  const activeSurface = useCurrentSurface();

  const canAddPanelsToAny = useMemo(
    () =>
      surfaces.some(
        (surface) =>
          surface.height >= MIN_SURFACE_HEIGHT_FOR_PANEL &&
          surface.width >= MIN_SURFACE_WIDTH_FOR_PANEL,
      ),
    [surfaces],
  );

  const activePanelGroup = useMemo(() => {
    if (!activeSurface.panelGroups.length) return undefined;

    return activeSurface.panelGroups.find(
      (group) => group.id === selectedPanelGroupId,
    );
  }, [activeSurface.panelGroups, selectedPanelGroupId]);

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-1 text-center lg:text-left">
        <h2 className="text-foreground text-3xl font-light tracking-tight">
          Arrangement
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          Configure modules & layout
        </p>
      </div>

      <div className="group border-border/50 bg-secondary/10 hover:bg-secondary/20 hover:border-primary/20 flex items-center justify-between rounded-2xl border p-5 transition-all duration-300">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="add-panels"
            className="text-foreground cursor-pointer text-base font-medium"
          >
            Enable Panel Layout
          </Label>
          <span className="text-muted-foreground text-xs">
            Unlock positioning tools for this surface
          </span>
        </div>
        <Switch
          disabled={!panelModeIsOn && !canAddPanelsToAny}
          checked={panelModeIsOn}
          onCheckedChange={togglePanelMode}
          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/20"
          id="add-panels"
        />
      </div>

      {!canAddPanelsToAny && (
        <div className="animate-in fade-in zoom-in-95 bg-destructive/5 border-destructive/20 text-destructive flex items-start gap-4 rounded-xl border p-4 shadow-sm">
          <Info className="mt-0.5 h-5 w-5 shrink-0 opacity-80" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Dimensions Alert
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              Surface area is insufficient for module placement. Minimum
              required dimensions are 45x45cm. Please adjust the surface size.
            </p>
          </div>
        </div>
      )}

      {panelModeIsOn && canAddPanelsToAny && (
        <div className="animate-in slide-in-from-top-4 fade-in fill-mode-both flex flex-col gap-8 duration-500">
          {activePanelGroup && (
            <div className="space-y-8">
              {/* Separator Line */}
              <div className="bg-border/30 h-px w-full" />

              <SurfacesSelection
                activeSurface={activeSurface}
                surfaces={surfaces}
                setSelectedSurfaceId={setSelectedSurfaceId}
                isDisabled={!!activePanelGroup}
              />

              <PanelsSelection
                surface={activeSurface}
                updatePanelGroup={updatePanelGroup}
                activePanelGroup={activePanelGroup}
              />

              <PanelsPositioning
                surface={activeSurface}
                updatePanelGroup={(data) =>
                  updatePanelGroup(activeSurface.id, activePanelGroup.id, data)
                }
                activePanelGroup={activePanelGroup}
                onAddPanel={() => setSelectedPanelGroupId(null)}
              />
            </div>
          )}

          <div className="pt-2">
            <PanelsListView activeSurface={activeSurface} />
          </div>
        </div>
      )}
    </div>
  );
};
