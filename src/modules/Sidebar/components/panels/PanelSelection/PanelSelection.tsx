import type { Surface, PanelGroup } from "@/shared/types";
import { PanelGroupSettings } from "./PanelGroupSettings";
import type { CountType, OrientationType } from "@/shared/types/types";
import { canPlaceGroup, findNextAvailablePosition } from "@/shared/utils";
import { getUpdatedPanelGroup } from "@/shared/utils/helpers";
import { Settings2 } from "lucide-react";

interface PanelsSelectionProps {
  surface: Surface;
  activePanelGroup: PanelGroup;
  updatePanelGroup: (
    surfaceId: string,
    groupId: string,
    data: Partial<PanelGroup>,
  ) => void;
}

export const PanelsSelection = (props: PanelsSelectionProps) => {
  const { surface, updatePanelGroup, activePanelGroup } = props;

  const currentGroup = surface.panelGroups.find(
    (group) => group.id === activePanelGroup.id,
  );

  if (!currentGroup) return null;

  const isGroupSizeValid = (countStr: string) => {
    const newCount = parseInt(countStr, 10) as CountType;
    if (newCount === currentGroup.count) return true;

    const testGroup = getUpdatedPanelGroup(currentGroup, { count: newCount });
    if (canPlaceGroup(testGroup, surface, currentGroup.id)) return true;

    const nextPos = findNextAvailablePosition(
      surface,
      newCount,
      currentGroup.orientation,
      currentGroup.id,
    );

    return !!nextPos;
  };

  const isGroupOrientationValid = (orientationStr: string): boolean => {
    const newOrientation =
      orientationStr === "Horizontal" ? "horizontal" : "vertical";
    if (newOrientation === currentGroup.orientation) return true;

    const testGroup = getUpdatedPanelGroup(currentGroup, {
      orientation: newOrientation,
    });
    if (canPlaceGroup(testGroup, surface, currentGroup.id)) return true;
    const nextPos = findNextAvailablePosition(
      surface,
      currentGroup.count,
      newOrientation,
      currentGroup.id,
    );

    return !!nextPos;
  };

  const getDisabledReasonForCount = (item: string): string | null => {
    if (isGroupSizeValid(item)) return null;
    return "Not enough space for this number of solar panels.";
  };

  const getDisabledReasonForOrientation = (item: string): string | null => {
    if (isGroupOrientationValid(item)) return null;
    return "Not enough space to rotate the solar panels.";
  };

  const handleCountChange = (val: string) => {
    const newCount = parseInt(val, 10) as CountType;
    const updatedData = { count: newCount };

    const testGroup = getUpdatedPanelGroup(currentGroup, updatedData);
    if (canPlaceGroup(testGroup, surface, currentGroup.id)) {
      updatePanelGroup(surface.id, currentGroup.id, testGroup);
      return;
    }

    const nextPos = findNextAvailablePosition(
      surface,
      newCount,
      currentGroup.orientation,
      currentGroup.id,
    );

    if (nextPos) {
      updatePanelGroup(surface.id, currentGroup.id, {
        ...updatedData,
        x: nextPos.x,
        y: nextPos.y,
      });
    }
  };

  const handleOrientationChange = (val: string) => {
    const newOrientation: OrientationType =
      val === "Horizontal" ? "horizontal" : "vertical";
    const updatedData = { orientation: newOrientation };
    const testGroup = getUpdatedPanelGroup(currentGroup, updatedData);

    if (canPlaceGroup(testGroup, surface, currentGroup.id)) {
      updatePanelGroup(surface.id, currentGroup.id, updatedData);
      return;
    }

    const nextPos = findNextAvailablePosition(
      surface,
      currentGroup.count,
      newOrientation,
      currentGroup.id,
    );

    if (nextPos) {
      updatePanelGroup(surface.id, currentGroup.id, {
        ...updatedData,
        x: nextPos.x,
        y: nextPos.y,
      });
    }
  };

  const countItems = ["1", "2", "3", "4", "5"];
  const orientationItems = ["Horizontal", "Vertical"];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 opacity-80">
        <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-md">
          <Settings2 className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          Module Configuration
        </h3>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-secondary/10 hover:bg-secondary/20 flex flex-col justify-center rounded-[2rem] p-4 transition-colors">
          <PanelGroupSettings
            title="Module Quantity"
            items={countItems}
            value={currentGroup.count.toString()}
            onChange={handleCountChange}
            disabledItems={countItems.filter((item) => !isGroupSizeValid(item))}
            getDisabledReason={getDisabledReasonForCount}
          />
        </div>

        <div className="bg-secondary/10 hover:bg-secondary/20 flex flex-col justify-center rounded-[2rem] p-4 transition-colors">
          <PanelGroupSettings
            title="Orientation"
            items={orientationItems}
            value={
              currentGroup.orientation === "horizontal"
                ? "Horizontal"
                : "Vertical"
            }
            onChange={handleOrientationChange}
            disabledItems={orientationItems.filter(
              (item) => !isGroupOrientationValid(item),
            )}
            getDisabledReason={getDisabledReasonForOrientation}
          />
        </div>
      </div>
    </div>
  );
};
