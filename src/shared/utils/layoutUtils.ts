import {
  MIN_SURFACE_HEIGHT_FOR_PANEL,
  MIN_SURFACE_WIDTH_FOR_PANEL,
  PANEL_MARGIN_FROM_EDGE,
  PANEL_MARGIN_FROM_GROUP,
} from "@/shared/constants";
import type { PanelGroup, Surface } from "@/shared/types";
import { calculateValuesForPanelGroup, checkIntersection } from "./helpers";

/**
 * Function to check if panel group can be placed on surface
 * @param group - panel group to be placed
 * @param surface - surface to place on
 * @param excludeGroupId group to ignore
 */
export const canPlaceGroup = (
  group: PanelGroup,
  surface: Surface,
  excludeGroupId?: string,
): boolean => {
  const groupInfo = calculateValuesForPanelGroup(group);
  const { coordinates: c } = groupInfo;

  // normalize coordinates
  const x1 = Math.min(c.x1, c.x2);
  const x2 = Math.max(c.x1, c.x2);
  const y1 = Math.min(c.y1, c.y2);
  const y2 = Math.max(c.y1, c.y2);

  if (
    x1 < PANEL_MARGIN_FROM_EDGE ||
    y1 < PANEL_MARGIN_FROM_EDGE ||
    x2 > surface.width - PANEL_MARGIN_FROM_EDGE ||
    y2 > surface.height - PANEL_MARGIN_FROM_EDGE
  ) {
    return false;
  }

  const marginForIntersection = PANEL_MARGIN_FROM_GROUP * 2;

  return !surface.panelGroups.some((existingGroup) => {
    if (existingGroup.id === excludeGroupId) return false;

    const existingGroupInfo = calculateValuesForPanelGroup(existingGroup);

    return checkIntersection(
      groupInfo,
      existingGroupInfo,
      marginForIntersection,
    );
  });
};

/**
 * Function to find first free space for panel group
 * @param surface - surface to search on
 * @param size - size of group to add 1 - 5
 * @param orientation - orientation of group to add "horizontal" or "vertical"
 * @returns first free position or null
 */
export const findNextAvailablePosition = (
  surface: Surface,
  size: 1 | 2 | 3 | 4 | 5,
  orientation: "horizontal" | "vertical",
  excludeGroupId?: string,
): { x: number; y: number } | null => {
  if (
    surface.width < MIN_SURFACE_WIDTH_FOR_PANEL ||
    surface.height < MIN_SURFACE_HEIGHT_FOR_PANEL
  )
    return null;

  const step = 0.5;
  const tempGroup: PanelGroup = {
    id: "temp",
    x: 0,
    y: 0,
    count: size,
    orientation: orientation,
  } as PanelGroup;

  for (let y = PANEL_MARGIN_FROM_EDGE; y <= surface.height; y += step) {
    for (let x = PANEL_MARGIN_FROM_EDGE; x <= surface.width; x += step) {
      tempGroup.x = x;
      tempGroup.y = y;

      if (canPlaceGroup(tempGroup, surface, excludeGroupId)) {
        return { x, y };
      }
    }
  }

  return null;
};
