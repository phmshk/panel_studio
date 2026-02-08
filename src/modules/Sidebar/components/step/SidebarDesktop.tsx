import type { StepConfig } from "./useSidebarSteps";
import { useActiveStep, useProjectActions } from "@/app/store/selectors";
import { BgImgSettings } from "../BgImgSettings/BgImgSettings";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/utils";
import type { ActiveStep } from "@/shared/types";

interface SidebarDesktopProps {
  steps: StepConfig[];
}

export const SidebarDesktop = ({ steps }: SidebarDesktopProps) => {
  const { setActiveStep } = useProjectActions();
  const activeStep = useActiveStep();

  const currentStep = steps.find((s) => s.value === activeStep) || steps[0];

  return (
    <div className="flex h-full flex-col gap-6">
      <Tabs
        value={activeStep}
        onValueChange={(step) => setActiveStep(step as ActiveStep)}
        className="flex min-h-0 flex-1 flex-col gap-6"
      >
        <div className="flex-none px-1">
          <TabsList className="bg-secondary/30 h-auto w-full flex-wrap justify-stretch gap-1 rounded-2xl p-1">
            {steps.map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.value}
                className={cn(
                  "flex-1 basis-[45%] lg:basis-auto",
                  "rounded-xl px-3 py-2 text-sm font-medium capitalize transition-all",
                  "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm",
                  "hover:text-primary/80",
                )}
              >
                {step.value}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="relative min-h-0 flex-1 overflow-x-hidden">
          {currentStep.component}
        </div>
      </Tabs>
      <div className="border-border/40 mt-4 flex-none border-t pt-4">
        <BgImgSettings />
      </div>
    </div>
  );
};
