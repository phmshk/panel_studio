export type OrientationType = "vertical" | "horizontal";
export type CountType = 1 | 2 | 3 | 4 | 5;
export type ActiveStep = "dimensions" | "panels";

export interface PanelGroup {
  id: string;
  count: CountType;
  x: number;
  y: number;
  orientation: OrientationType;
}

export interface PanelGroupInfo {
  id: string;
  width: number;
  height: number;
  coordinates: { x1: number; x2: number; y1: number; y2: number };
  anchorPoint: { x: number; y: number };
}

export interface Surface {
  id: string;
  width: number;
  height: number;
  panelGroups: PanelGroup[];
}

export interface Coordinates {
  x: number;
  y: number;
}
