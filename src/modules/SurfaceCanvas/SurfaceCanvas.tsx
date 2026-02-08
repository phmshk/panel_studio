import { Surface } from "./components/Surface/Surface";
import { useCanvasLayout } from "./hooks/useCanvasLayout";
import { CanvasNavigation } from "./components/Canvas/CanvasNavigation/CanvasNavigation";
import { DimensionLabel } from "./components/Canvas/DimensionsLabel/DimensionsLabel";
import { useSvgTextScale } from "./hooks/useSvgTextScale";
import {
  useActiveStep,
  useCurrentSurface,
  useSurfaces,
  useProjectActions,
  useSelectedPanelGroupId,
} from "@/app/store/selectors";
import { cn } from "@/shared/utils";

export const SurfaceCanvas = () => {
  const surfaces = useSurfaces();
  const activeStep = useActiveStep();
  const selectedPanelGroupId = useSelectedPanelGroupId();
  const { setSelectedSurfaceId, setSelectedPanelGroupId } = useProjectActions();

  const activeSurface = useCurrentSurface();

  const layout = useCanvasLayout({ surfaces, activeStep, activeSurface });

  const { svgRef, scaleFactor } = useSvgTextScale(layout.viewBox);

  const currentSurfaceIndex = surfaces.findIndex(
    (p) => p.id === activeSurface.id,
  );
  const showNavigation = activeStep !== "dimensions" && surfaces.length > 1;
  const showDimensions = activeStep !== "dimensions";

  const handlePrevSurface = () => {
    if (selectedPanelGroupId) {
      setSelectedPanelGroupId(null);
    }

    const prevIndex = currentSurfaceIndex - 1;
    if (prevIndex >= 0) setSelectedSurfaceId(surfaces[prevIndex].id);
  };

  const handleNextSurface = () => {
    if (selectedPanelGroupId) {
      setSelectedPanelGroupId(null);
    }

    const nextIndex = currentSurfaceIndex + 1;
    if (nextIndex < surfaces.length)
      setSelectedSurfaceId(surfaces[nextIndex].id);
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-10 md:p-20">
      {showNavigation && (
        <CanvasNavigation
          onPrev={handlePrevSurface}
          onNext={handleNextSurface}
          canPrev={currentSurfaceIndex > 0}
          canNext={currentSurfaceIndex < surfaces.length - 1}
        />
      )}
      <svg
        viewBox={layout.viewBox}
        className="max-h-full max-w-full touch-none overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
      >
        {layout.visibleSurfaces.map(({ surface, xPosition, globalX }) => {
          const isSelected = activeSurface.id === surface.id;
          const isOverviewMode = activeStep === "dimensions";

          const centerX = xPosition + surface.width / 2;
          const centerY = layout.maxHeight - surface.height / 2;

          return (
            <g
              key={surface.id}
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              className={cn(
                "origin-center touch-none transition-all duration-500 ease-out",
                isSelected ? "drop-shadow-xs" : "",
                isOverviewMode ? "cursor-pointer" : "",
              )}
            >
              <Surface
                surface={surface}
                xPosition={xPosition}
                maxHeight={layout.maxHeight}
                bgImgGlobalWidth={layout.globalTotalWidth}
                bgImgGlobalHeight={layout.globalMaxHeight}
                bgImgGlobalX={globalX}
                selectedPanelGroupId={selectedPanelGroupId}
                scaleFactor={scaleFactor}
              />

              {showDimensions && (
                <DimensionLabel
                  x={xPosition + surface.width / 2}
                  yBase={layout.maxHeight}
                  width={surface.width}
                  height={surface.height}
                  scaleFactor={scaleFactor}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
