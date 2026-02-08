import type { ActiveStep } from "@/shared/types";
import { useMemo, useRef } from "react";
import { DimensionsSelection } from "@/modules/Sidebar/components/dimensions/DimensionsSelection";
import { PanelsSection } from "@/modules/Sidebar/components/panels/PanelsSection";

export interface StepConfig {
  id: string;
  value: ActiveStep;
  ref: React.RefObject<HTMLDivElement | null>;
  component: React.ReactNode;
}

export const useSidebarSteps = () => {
  const dimensionsRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  const steps: StepConfig[] = useMemo(
    () => [
      {
        id: "section-dimensions",
        value: "dimensions",
        ref: dimensionsRef,
        component: <DimensionsSelection />,
      },
      {
        id: "section-panels",
        value: "panels",
        ref: panelsRef,
        component: <PanelsSection />,
      },
    ],
    [],
  );

  return steps;
};
