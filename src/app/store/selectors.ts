import { useProjectStore } from ".";
import { useShallow } from "zustand/react/shallow";

export const useActiveStep = () => useProjectStore((s) => s.activeStep);
export const usePanelMode = () => useProjectStore((s) => s.panelModeIsOn);
export const useSelectedSurfaceId = () =>
  useProjectStore((s) => s.selectedSurfaceId);
export const useSelectedPanelGroupId = () =>
  useProjectStore((s) => s.selectedPanelGroupId);
export const useHoveredPanelGroupId = () =>
  useProjectStore((s) => s.hoveredPanelGroupId);

export const useSurfaces = () => useProjectStore(useShallow((s) => s.surfaces));

export const useCurrentSurface = () => {
  return useProjectStore(
    useShallow(
      (s) =>
        s.surfaces.find((surface) => surface.id === s.selectedSurfaceId) ||
        s.surfaces[0],
    ),
  );
};

export const useProjectActions = () => {
  return useProjectStore(
    useShallow((state) => ({
      setActiveStep: state.setActiveStep,
      addSurface: state.addSurface,
      deleteSurface: state.deleteSurface,
      resizeSurface: state.resizeSurface,
      togglePanelMode: state.togglePanelMode,
      addPanelGroup: state.addPanelGroup,
      removePanelGroup: state.removePanelGroup,
      updatePanelGroup: state.updatePanelGroup,
      movePanelGroupToDifferentSurface: state.movePanelGroupToDifferentSurface,
      setSelectedSurfaceId: state.setSelectedSurfaceId,
      setSelectedPanelGroupId: state.setSelectedPanelGroupId,
      setHoveredPanelGroupId: state.setHoveredPanelGroupId,
      setBgImgUrl: state.setBgImgUrl,
    })),
  );
};

export const useBgImgUrl = () => useProjectStore((s) => s.bgImgUrl);
export const useOnboardingCompleted = () =>
  useProjectStore((s) => s.onboardingCompleted);

export const useSetOnboardingCompleted = () =>
  useProjectStore((s) => s.setOnboardingCompleted);
