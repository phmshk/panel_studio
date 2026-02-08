import type { StateCreator } from "zustand";
import type { SurfacesSlice, ProjectState } from "./types";
import { MIN_SURFACE_WIDTH, MIN_SURFACE_HEIGHT } from "@/shared/constants";
import type { Surface } from "@/shared/types";

export const createSurfacesSlice: StateCreator<
  ProjectState,
  [["zustand/immer", never]],
  [],
  SurfacesSlice
> = (set) => ({
  surfaces: [
    {
      id: crypto.randomUUID(),
      width: MIN_SURFACE_WIDTH,
      height: MIN_SURFACE_HEIGHT,
      panelGroups: [],
    },
  ],
  bgImgUrl: null,
  addSurface: () => {
    const newID = crypto.randomUUID();
    set((state) => {
      state.surfaces.push({
        id: newID,
        width: MIN_SURFACE_WIDTH,
        height: MIN_SURFACE_HEIGHT,
        panelGroups: [],
      });
    });

    return newID;
  },

  deleteSurface: (id: string) =>
    set((state) => {
      if (state.surfaces.length < 2) return; // at least one surface should remain
      state.surfaces = state.surfaces.filter(
        (surface: Surface) => surface.id !== id,
      ); // filter selected surface out

      if (state.selectedSurfaceId === id) {
        state.selectedSurfaceId = state.surfaces[0].id;
      }
    }),

  resizeSurface: (id: string, width: number, height: number) =>
    set((state) => {
      const surface = state.surfaces.find(
        (surface: Surface) => surface.id === id,
      );
      if (surface) {
        surface.width = width;
        surface.height = height;
        surface.panelGroups = []; // remove panels on resizr
        state.selectedPanelGroupId = null; // delete panel group selection
      }
    }),
  setBgImgUrl: (url) => set({ bgImgUrl: url }),
});
