import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CanvasNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export const CanvasNavigation = ({
  onPrev,
  onNext,
  canPrev,
  canNext,
}: CanvasNavigationProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        disabled={!canPrev}
        className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-white/50 hover:bg-white md:left-4"
      >
        <ChevronLeft className="size-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!canNext}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-white/50 hover:bg-white md:right-4"
      >
        <ChevronRight className="size-6" />
      </Button>
    </>
  );
};
