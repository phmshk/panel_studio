import type { StateCreator } from "zustand";
import type { ProjectState, UISlice } from "./types";
import type { ActiveStep, Surface } from "@/shared/types";
import {
  MIN_SURFACE_HEIGHT_FOR_PANEL,
  MIN_SURFACE_WIDTH_FOR_PANEL,
} from "@/shared/constants";

export const createUISlice: StateCreator<
  ProjectState,
  [["zustand/immer", never]],
  [],
  UISlice
> = (set) => ({
  activeStep: "dimensions",
  selectedSurfaceId: "",
  selectedPanelGroupId: null,
  hoveredPanelGroupId: null,
  panelModeIsOn: false,
  onboardingCompleted: false,

  setActiveStep: (step: ActiveStep) => set({ activeStep: step }),
  setSelectedSurfaceId: (id: string) => set({ selectedSurfaceId: id }),
  setSelectedPanelGroupId: (id: string | null) =>
    set({ selectedPanelGroupId: id }),
  setHoveredPanelGroupId: (id: string | null) =>
    set({ hoveredPanelGroupId: id }),

  togglePanelMode: () =>
    set((state) => {
      if (state.panelModeIsOn) {
        // if on => clear all panelGroups and turn off
        state.surfaces.forEach(
          (surface: Surface) => (surface.panelGroups = []),
        );
        state.panelModeIsOn = false;
        state.selectedPanelGroupId = null;
      } else {
        // else place one panelGroup in the middle of the first surface
        // with proper sizes and turn on
        // if no such surface was found just return all surfaces
        const validSurfaceToAddOn = state.surfaces.findIndex(
          (surface: Surface) =>
            surface.width >= MIN_SURFACE_WIDTH_FOR_PANEL &&
            surface.height >= MIN_SURFACE_HEIGHT_FOR_PANEL,
        );

        if (validSurfaceToAddOn !== -1) {
          const surface = state.surfaces[validSurfaceToAddOn];
          const newGroupId = crypto.randomUUID();

          surface.panelGroups.push({
            id: newGroupId,
            count: 1,
            orientation: "vertical",
            x: Number((surface.width / 2).toFixed(1)),
            y: Number((surface.height / 2).toFixed(1)),
          });

          state.panelModeIsOn = true;
          state.selectedPanelGroupId = newGroupId;
          state.selectedSurfaceId = surface.id;
        }
      }
    }),
  setOnboardingCompleted: (completed: boolean) =>
    set({ onboardingCompleted: completed }),
});
