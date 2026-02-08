import {
  PANEL_GAP,
  PANEL_MARGIN_FROM_GROUP,
  PANEL_SIZE,
} from "@/shared/constants";
import type { PanelGroup as PanelGroupType } from "@/shared/types";
import { Panel } from "../Panel/Panel.tsx";
import { useDragNDrop } from "../../hooks/useDragNDrop.ts";
import { createPortal } from "react-dom";
import { AnchorPointGuidelnes } from "./AnchorPointGuidelines.tsx";
import { useEffect, useState, useMemo, useRef } from "react";
import { calculateNextPosition } from "@/shared/utils/dragUtils.ts";
import {
  calculateValuesForPanelGroup,
  checkIntersection,
} from "@/shared/utils/helpers.ts";
import { cn } from "@/shared/utils/index.ts";
import {
  useActiveStep,
  useHoveredPanelGroupId,
  useProjectActions,
} from "@/app/store/selectors.ts";

interface PanelGroupProps {
  panelGroup: PanelGroupType;
  surfaceId: string;
  surfaceHeight: number;
  surfaceWidth: number;
  allGroups: PanelGroupType[];
  overlayNode: SVGElement | null;
  selectedPanelGroupId: string | null;
  onDragStateChange: (isDragging: boolean) => void;
  scaleFactor: number;
}

export const PanelGroup = (props: PanelGroupProps) => {
  const {
    panelGroup,
    surfaceId,
    surfaceHeight,
    surfaceWidth,
    allGroups,
    overlayNode,
    selectedPanelGroupId,
    onDragStateChange,
    scaleFactor,
  } = props;

  const activeStep = useActiveStep();
  const hoveredPanelGroupId = useHoveredPanelGroupId();
  const { updatePanelGroup, setSelectedPanelGroupId } = useProjectActions();

  // local state for position while dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMovementBlocked, setIsMovementBlocked] = useState(false);
  const [collidedGroups, setCollidedGroups] = useState<PanelGroupType[]>([]);

  const lastValidPos = useRef({ x: panelGroup.x, y: panelGroup.y });
  const isInteractivityEnabled = activeStep === "panels";

  useEffect(() => {
    lastValidPos.current = { x: panelGroup.x, y: panelGroup.y };
  }, [panelGroup.x, panelGroup.y]);

  const currentPanelGroup = useMemo(
    () => ({
      ...panelGroup,
      x: panelGroup.x + dragOffset.x,
      y: panelGroup.y + dragOffset.y,
    }),
    [panelGroup, dragOffset],
  );

  const currGroupCalculated = useMemo(
    () => calculateValuesForPanelGroup(currentPanelGroup),
    [currentPanelGroup],
  );

  // Drag and Drop
  const { isDragging, startDragging } = useDragNDrop({
    initialX: panelGroup.x,
    initialY: panelGroup.y,
    onDrag: (newX: number, newY: number) => {
      const dynamicPanelGroup = {
        ...panelGroup,
        x: lastValidPos.current.x,
        y: lastValidPos.current.y,
      };

      const result = calculateNextPosition({
        newX,
        newY,
        panelGroup: dynamicPanelGroup,
        allGroups,
        surfaceWidth,
        surfaceHeight,
      });

      setIsMovementBlocked(result.isBlocked);

      if (result.isBlocked) {
        const selfRect = calculateValuesForPanelGroup({
          ...panelGroup,
          x: newX,
          y: newY,
        });

        const hitGroups = allGroups.filter((group) => {
          if (group.id === panelGroup.id) return false;

          const targetRect = calculateValuesForPanelGroup(group);
          return checkIntersection(
            selfRect,
            targetRect,
            PANEL_MARGIN_FROM_GROUP * 2,
          );
        });

        if (hitGroups.length !== collidedGroups.length) {
          setCollidedGroups(hitGroups);
        } else {
          const isSame = hitGroups.every(
            (g, i) => g.id === collidedGroups[i].id,
          );
          if (!isSame) setCollidedGroups(hitGroups);
        }
      } else {
        setCollidedGroups([]);
      }

      // get last valid position
      lastValidPos.current = {
        x: result.x,
        y: result.y,
      };

      // no coordinates change => nothing to update
      if (result.x === panelGroup.x && result.y === panelGroup.y) return;

      setDragOffset({
        x: result.x - panelGroup.x,
        y: result.y - panelGroup.y,
      });
    },
    onDragEnd: (newX, newY) => {
      const dynamicPanelGroup = {
        ...panelGroup,
        x: lastValidPos.current.x,
        y: lastValidPos.current.y,
      };
      const result = calculateNextPosition({
        newX,
        newY,
        panelGroup: dynamicPanelGroup,
        allGroups,
        surfaceWidth,
        surfaceHeight,
      });

      setIsMovementBlocked(false);
      setDragOffset({ x: 0, y: 0 });
      setCollidedGroups([]);

      if (result.x !== panelGroup.x || result.y !== panelGroup.y) {
        updatePanelGroup(surfaceId, panelGroup.id, {
          x: result.x,
          y: result.y,
        });
      }
    },
  });

  // improve dragging => select panel which is dragged
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractivityEnabled) return;

    if (selectedPanelGroupId !== panelGroup.id) {
      setSelectedPanelGroupId(panelGroup.id);
    }

    startDragging(e);
  };

  useEffect(() => {
    onDragStateChange(isDragging);
  }, [isDragging, onDragStateChange]);

  // cursor appearance depending on cursor position
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = isMovementBlocked
        ? "not-allowed"
        : "grabbing";
    } else {
      document.body.style.cursor = "auto";
    }

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [isDragging, isMovementBlocked]);

  const obstacleGroups = useMemo(() => {
    if (!collidedGroups) return null;
    return collidedGroups.map((group) => calculateValuesForPanelGroup(group));
  }, [collidedGroups]);

  // select which group is active or selected
  const isFaded = useMemo(() => {
    const activeId = selectedPanelGroupId || hoveredPanelGroupId;

    if (!activeId) return false;

    return activeId !== panelGroup.id;
  }, [selectedPanelGroupId, hoveredPanelGroupId, panelGroup.id]);

  return (
    <g
      onPointerDown={handlePointerDown}
      className={cn(
        "touch-none transition-opacity duration-200 select-none",
        isInteractivityEnabled
          ? isDragging
            ? isMovementBlocked
              ? "cursor-not-allowed"
              : "cursor-grabbing"
            : "cursor-grab"
          : "cursor-default",
        isFaded ? "opacity-35" : "opacity-100",
      )}
    >
      {Array.from({ length: panelGroup.count }).map((_, index) => {
        const moveBy = index * (PANEL_SIZE + PANEL_GAP);

        const currX =
          panelGroup.orientation === "horizontal"
            ? currGroupCalculated.coordinates.x1 + moveBy
            : currGroupCalculated.coordinates.x1;

        const currY =
          panelGroup.orientation === "horizontal"
            ? currGroupCalculated.coordinates.y1
            : currGroupCalculated.coordinates.y1 - moveBy;

        return <Panel key={index} x={currX} y={currY - PANEL_SIZE} />;
      })}

      {isDragging && overlayNode ? (
        <>
          {createPortal(
            <AnchorPointGuidelnes
              currGroup={currGroupCalculated}
              surfaceHeight={surfaceHeight}
              scaleFactor={scaleFactor}
            />,
            overlayNode,
          )}
          {collidedGroups &&
            obstacleGroups &&
            obstacleGroups.map((rect) =>
              createPortal(
                <g pointerEvents="none" className="touch-none" key={rect.id}>
                  <rect
                    x={rect.coordinates.x1 - PANEL_MARGIN_FROM_GROUP * 2}
                    y={rect.coordinates.y2 - PANEL_MARGIN_FROM_GROUP * 2}
                    width={rect.width + PANEL_MARGIN_FROM_GROUP * 4}
                    height={rect.height + PANEL_MARGIN_FROM_GROUP * 4}
                    fill="transparent"
                    strokeWidth="1"
                    strokeDasharray="4 1"
                    className="stroke-destructive touch-none"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>,
                overlayNode,
              ),
            )}
        </>
      ) : null}

      <rect
        x={currGroupCalculated.coordinates.x1}
        y={currGroupCalculated.coordinates.y2}
        width={currGroupCalculated.width}
        height={currGroupCalculated.height}
        fill="transparent"
        className="touch-none"
      />
    </g>
  );
};
