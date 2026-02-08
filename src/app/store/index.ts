import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createSurfacesSlice } from "./slices/surfacesSlice";
import type { ProjectState } from "./slices/types";
import { createUISlice } from "./slices/uiSlice";
import { createPanelsSlice } from "./slices/panelsSlice";

export const useProjectStore = create<ProjectState>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createSurfacesSlice(...a),
        ...createUISlice(...a),
        ...createPanelsSlice(...a),
      })),
      {
        name: "project-storage", // persist (local storage key)
        partialize: (state) => ({
          surfaces: state.surfaces,
          activeStep: state.activeStep,
          panelModeIsOn: state.panelModeIsOn,
          selectedSurfaceId: state.selectedSurfaceId,
          onboardingCompleted: state.onboardingCompleted,
        }),
      },
    ),
    { name: "ProjectStore" }, // DevTools name
  ),
);
