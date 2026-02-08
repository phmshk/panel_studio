import type { StateCreator } from "zustand";
import type { ProjectState, PanelsSlice } from "./types";
import type { Coordinates, Surface, PanelGroup } from "@/shared/types";
import { canPlaceGroup, findNextAvailablePosition } from "@/shared/utils";

export const createPanelsSlice: StateCreator<
  ProjectState,
  [["zustand/immer", never]],
  [],
  PanelsSlice
> = (set) => ({
  addPanelGroup: (surfaceId: string, panelPosition?: Coordinates) => {
    const panelId = crypto.randomUUID();

    set((state) => {
      const surface = state.surfaces.find((surface: Surface) => surface.id === surfaceId);
      if (surface) {
        surface.panelGroups.push({
          id: panelId,
          count: 1,
          orientation: "vertical",
          x: panelPosition
            ? panelPosition.x
            : Number((surface.width / 2).toFixed(1)),
          y: panelPosition
            ? panelPosition.y
            : Number((surface.height / 2).toFixed(1)),
        });
      }
    });

    return panelId;
  },

  removePanelGroup: (surfaceId: string, groupId: string) =>
    set((state) => {
      const surface = state.surfaces.find((surface: Surface) => surface.id === surfaceId);
      if (surface) {
        surface.panelGroups = surface.panelGroups.filter(
          (group: PanelGroup) => group.id !== groupId,
        );

        // remove selection if selected group was removed
        if (state.selectedPanelGroupId === groupId) {
          state.selectedPanelGroupId = null;
        }
      }
    }),

  updatePanelGroup: (
    surfaceId: string,
    groupId: string,
    data: Partial<PanelGroup>,
  ) =>
    set((state) => {
      const surface = state.surfaces.find((surface: Surface) => surface.id === surfaceId);
      if (!surface) return;

      const group = surface.panelGroups.find(
        (group: PanelGroup) => group.id === groupId,
      );
      if (!group) return;

      const potentialGroup = { ...group, ...data };
      if (canPlaceGroup(potentialGroup, surface, groupId)) {
        Object.assign(group, data);
      }
    }),

  movePanelGroupToDifferentSurface: (targetSurfaceId: string) =>
    set((state) => {
      if (!state.panelModeIsOn || !state.selectedPanelGroupId) return;
      if (state.selectedSurfaceId === targetSurfaceId) return;

      const sourceSurface = state.surfaces.find(
        (surface: Surface) => surface.id === state.selectedSurfaceId,
      );
      const targetSurface = state.surfaces.find(
        (surface: Surface) => surface.id === targetSurfaceId,
      );

      if (!sourceSurface || !targetSurface) return;

      const groupToMoveIndex = sourceSurface.panelGroups.findIndex(
        (group: PanelGroup) => group.id === state.selectedPanelGroupId,
      );
      if (groupToMoveIndex === -1) return;

      const groupToMove = sourceSurface.panelGroups[groupToMoveIndex];
      const newPos = findNextAvailablePosition(
        targetSurface,
        groupToMove.count,
        groupToMove.orientation,
      );

      if (newPos) {
        // delete from curr and add to new
        sourceSurface.panelGroups.splice(groupToMoveIndex, 1);

        targetSurface.panelGroups.push({
          ...groupToMove,
          x: newPos.x,
          y: newPos.y,
        });

        state.selectedSurfaceId = targetSurfaceId;
      }
    }),
});
