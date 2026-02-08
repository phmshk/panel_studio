import type {
  ActiveStep,
  Coordinates,
  Surface,
  PanelGroup,
} from "@/shared/types"; //

export interface UISlice {
  activeStep: ActiveStep;
  selectedSurfaceId: string;
  selectedPanelGroupId: string | null;
  hoveredPanelGroupId: string | null;
  panelModeIsOn: boolean;
  onboardingCompleted: boolean;

  setActiveStep: (step: ActiveStep) => void;
  setSelectedSurfaceId: (id: string) => void;
  setSelectedPanelGroupId: (id: string | null) => void;
  setHoveredPanelGroupId: (id: string | null) => void;
  togglePanelMode: () => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

export interface SurfacesSlice {
  surfaces: Surface[];
  bgImgUrl: string | null;
  addSurface: () => string;
  deleteSurface: (id: string) => void;
  resizeSurface: (id: string, newWidth: number, newHeight: number) => void;
  setBgImgUrl: (url: string | null) => void;
}

export interface PanelsSlice {
  addPanelGroup: (surfaceId: string, panelPosition?: Coordinates) => string;
  removePanelGroup: (surfaceId: string, groupId: string) => void;
  updatePanelGroup: (
    surfaceId: string,
    groupId: string,
    data: Partial<PanelGroup>,
  ) => void;
  movePanelGroupToDifferentSurface: (targetSurfaceId: string) => void;
}

export type ProjectState = UISlice & SurfacesSlice & PanelsSlice;
