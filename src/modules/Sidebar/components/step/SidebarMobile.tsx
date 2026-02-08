import { BgImgSettings } from "../BgImgSettings/BgImgSettings";
import { MobileSteps } from "./MobileSteps";
import type { StepConfig } from "./useSidebarSteps";
import { useActiveStep, useProjectActions } from "@/app/store/selectors";

interface SidebarMobileProps {
  steps: StepConfig[];
}

export const SidebarMobile = ({ steps }: SidebarMobileProps) => {
  const activeStep = useActiveStep();
  const { setActiveStep } = useProjectActions();

  const currentIndex = steps.findIndex((s) => s.value === activeStep);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const currentStep = steps[safeIndex];

  const goToNext = () => {
    if (safeIndex < steps.length - 1) setActiveStep(steps[safeIndex + 1].value);
  };

  const goToPrev = () => {
    if (safeIndex > 0) setActiveStep(steps[safeIndex - 1].value);
  };

  return (
    <div className="bg-background flex min-h-full flex-col">
      <MobileSteps
        currentStep={safeIndex + 1}
        totalSteps={steps.length}
        canPrev={safeIndex > 0}
        canNext={safeIndex < steps.length - 1}
        onPrev={goToPrev}
        onNext={goToNext}
      />

      <div className="flex-1 p-5">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Configuration
          </h2>
          <p className="text-muted-foreground text-sm">
            Select your preferences below.
          </p>
        </div>
        <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
          {currentStep.component}
        </div>
        <div className="border-border/40 mt-8 border-t pt-8">
          <BgImgSettings />
        </div>
      </div>
    </div>
  );
};
