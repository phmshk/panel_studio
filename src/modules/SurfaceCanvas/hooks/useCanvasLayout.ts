import { useMemo } from "react";
import type { Surface } from "@/shared/types";
import { GAP_BETWEEN_SURFACES } from "@/shared/constants";

interface UseCanvasLayoutParams {
  surfaces: Surface[];
  activeStep: string;
  activeSurface: Surface;
}

export const useCanvasLayout = ({
  surfaces,
  activeStep,
  activeSurface,
}: UseCanvasLayoutParams) => {
  return useMemo(() => {
    // "global" wall with all surfaces and bgImg
    let currentGlobalX = 0;
    let maxHeight = 0;

    const layoutItems = surfaces.map((surface) => {
      const item = {
        surface,
        globalX: currentGlobalX,
      };

      // eslint-disable-next-line
      currentGlobalX += surface.width + GAP_BETWEEN_SURFACES;
      maxHeight = Math.max(maxHeight, surface.height);

      return item;
    });

    // remove last gap from global width
    const globalTotalWidth =
      currentGlobalX > 0 ? currentGlobalX - GAP_BETWEEN_SURFACES : 0;
    const globalMaxHeight = maxHeight;

    if (activeStep === "dimensions") {
      // screen view == global view
      const visibleSurfaces = layoutItems.map((item) => ({
        surface: item.surface,
        xPosition: item.globalX,
        globalX: item.globalX,
      }));

      return {
        totalWidth: globalTotalWidth,
        maxHeight: globalMaxHeight,
        visibleSurfaces,
        viewBox: `0 0 ${globalTotalWidth} ${globalMaxHeight}`,
        globalTotalWidth,
        globalMaxHeight,
      };
    } else {
      // just one surface
      const activeItem = layoutItems.find(
        (item) => item.surface.id === activeSurface.id,
      );

      // fallback if no surface dound
      const activeGlobalX = activeItem ? activeItem.globalX : 0;

      return {
        totalWidth: activeSurface.width,
        maxHeight: activeSurface.height,
        visibleSurfaces: [
          {
            surface: activeSurface,
            xPosition: 0,
            globalX: activeGlobalX,
          },
        ],
        viewBox: `0 0 ${activeSurface.width} ${activeSurface.height}`,
        globalTotalWidth,
        globalMaxHeight,
      };
    }
  }, [surfaces, activeSurface, activeStep]);
};
