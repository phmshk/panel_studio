import {
  PANEL_SIZE,
  PANEL_MARGIN_FROM_EDGE,
  PANEL_MARGIN_FROM_GROUP,
} from "@/shared/constants";
import type { PanelGroup } from "@/shared/types";
import { calculateValuesForPanelGroup, checkIntersection } from "./helpers";

interface CalculatePositionParams {
  newX: number;
  newY: number;
  panelGroup: PanelGroup;
  allGroups: PanelGroup[];
  surfaceWidth: number;
  surfaceHeight: number;
}
/**
 * Calculates the next valid position for a panel group during dragging.
 *
 * @param newX - target X coordinate (mouse cursor position)
 * @param newY - target Y coordinate (mouse cursor position)
 * @param panelGroup - current panel group being dragged
 * @param allGroups - array of all groups on the canvas (for collision checking)
 * @param surfaceHeight - height of the surface for boundary checking.
 * @param surfaceWidth - width of the surface for boundary checking
 * @returns an object `{ x, y, isBlocked }` where
 * x and y are the final safe coordinates to use
 * isBlocked is a flag indicating if the movement was blocked by a wall or another group
 */
export const calculateNextPosition = ({
  newX,
  newY,
  panelGroup,
  allGroups,
  surfaceHeight,
  surfaceWidth,
}: CalculatePositionParams): { x: number; y: number; isBlocked: boolean } => {
  const currGroupValues = calculateValuesForPanelGroup(panelGroup);

  const minX = PANEL_SIZE / 2;
  const minY = currGroupValues.height - PANEL_SIZE / 2;
  const maxX = surfaceWidth - currGroupValues.width + PANEL_SIZE / 2;
  const maxY = surfaceHeight - PANEL_SIZE / 2;

  // set inner borders
  const clampedXStr = Math.max(
    minX + PANEL_MARGIN_FROM_EDGE,
    Math.min(newX, maxX - PANEL_MARGIN_FROM_EDGE),
  ).toFixed(1);

  const clampedYStr = Math.max(
    minY + PANEL_MARGIN_FROM_EDGE,
    Math.min(newY, maxY - PANEL_MARGIN_FROM_EDGE),
  ).toFixed(1);

  const clampedX = Number(clampedXStr);
  const clampedY = Number(clampedYStr);

  // collision checking
  const currentX = panelGroup.x;
  const currentY = panelGroup.y;

  const hasCollision = (targetX: number, targetY: number) => {
    const self = calculateValuesForPanelGroup({
      ...panelGroup,
      x: targetX,
      y: targetY,
    });

    return allGroups
      .filter((item) => item.id !== panelGroup.id)
      .some((item) => {
        const target = calculateValuesForPanelGroup(item);
        return checkIntersection(self, target, PANEL_MARGIN_FROM_GROUP * 2);
      });
  };

  const hitWallX = Math.abs(newX - clampedX) > 0.1;
  const hitWallY = Math.abs(newY - clampedY) > 0.1;
  const isWallHit = hitWallX || hitWallY;

  // trying to move to both new coordinates
  if (!hasCollision(clampedX, clampedY)) {
    return { x: clampedX, y: clampedY, isBlocked: isWallHit };
  }

  // trying to move on x axis, so leave y as it is now
  if (!hasCollision(clampedX, currentY)) {
    return { x: clampedX, y: currentY, isBlocked: true };
  }

  // trying to move on y axis, so leave x as it is now
  if (!hasCollision(currentX, clampedY)) {
    return { x: currentX, y: clampedY, isBlocked: true };
  }

  // if here => no possible movement
  return { x: currentX, y: currentY, isBlocked: true };
};
