import { Button } from "@/shared/components/ui/button";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils";

interface MobileStepsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
  canPrev: boolean;
}

export const MobileSteps = (props: MobileStepsProps) => {
  const { currentStep, totalSteps, onNext, onPrev, canNext, canPrev } = props;

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-background/95 border-border/40 pb-safe sticky right-0 bottom-0 left-0 z-50 border-t backdrop-blur-xl">
      <div className="bg-secondary h-1 w-full">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrev}
          disabled={!canPrev}
          className={cn(
            "text-muted-foreground hover:text-foreground gap-1 pl-0",
            !canPrev && "invisible",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Step Indicator (Text) */}
        <div className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
          Step {currentStep} <span className="text-border">/</span> {totalSteps}
        </div>

        <Button
          onClick={onNext}
          disabled={!canNext}
          size="sm"
          className="shadow-primary/20 rounded-full px-6 shadow-sm"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
