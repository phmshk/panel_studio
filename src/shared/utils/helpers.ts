import { PANEL_SIZE, PANEL_GAP } from "@/shared/constants";
import type { PanelGroup, PanelGroupInfo } from "@/shared/types";

/** Function to get information about a panel group: full coordinates, group width and length
 * @param group - PanelGroup
 * @returns - object with calculated values
 * */
export function calculateValuesForPanelGroup(
  sg: PanelGroup,
): PanelGroupInfo {
  const halfSize = PANEL_SIZE / 2;
  const totalLength = sg.count * PANEL_SIZE + (sg.count - 1) * PANEL_GAP;

  const width = sg.orientation === "vertical" ? PANEL_SIZE : totalLength;
  const height = sg.orientation === "vertical" ? totalLength : PANEL_SIZE;
  const coordinates = {
    x1: Number((sg.x - halfSize).toFixed(1)),
    x2: Number((sg.x - halfSize + width).toFixed(1)),
    y1: Number((sg.y + halfSize).toFixed(1)),
    y2: Number((sg.y + halfSize - height).toFixed(1)),
  };

  const anchorPoint = { x: sg.x, y: sg.y };
  return { id: sg.id, width, height, coordinates, anchorPoint };
}

/** Function to check if two panel groups intersect including gap between them
 * @param a - first panel group information with coordinate
 * @param b - second panel group information with coordinates
 * @param margin - margin around second group
 * @returns - true if panel groups intersect else false
 * */
export function checkIntersection(
  a: PanelGroupInfo,
  b: PanelGroupInfo,
  margin: number = 0,
): boolean {
  const cA = a.coordinates;
  const cB = b.coordinates;

  // spent too much time mixing coordinates up, which led to bugs
  // normalizing coordinates
  const aX1 = Math.min(cA.x1, cA.x2);
  const aX2 = Math.max(cA.x1, cA.x2);
  const aY1 = Math.min(cA.y1, cA.y2);
  const aY2 = Math.max(cA.y1, cA.y2);

  const bX1 = Math.min(cB.x1, cB.x2);
  const bX2 = Math.max(cB.x1, cB.x2);
  const bY1 = Math.min(cB.y1, cB.y2);
  const bY2 = Math.max(cB.y1, cB.y2);

  return (
    aX1 <= bX2 + margin &&
    aX2 >= bX1 - margin &&
    aY1 <= bY2 + margin &&
    aY2 >= bY1 - margin
  );
}

export const getUpdatedPanelGroup = (
  originalGroup: PanelGroup,
  updates: Partial<PanelGroup>,
): PanelGroup => {
  const newGroup = { ...originalGroup, ...updates };

  if (updates.count !== undefined && updates.count !== originalGroup.count) {
    const countDiff = updates.count - originalGroup.count;

    const sizeChange = countDiff * (PANEL_SIZE + PANEL_GAP);

    const orientation = newGroup.orientation;

    if (orientation === "vertical") {
      const roundedY = Number((newGroup.y + sizeChange).toFixed(1));
      newGroup.y = roundedY;
    }
  }

  return newGroup;
};
