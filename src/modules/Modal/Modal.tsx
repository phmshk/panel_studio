import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Sparkles,
  ImagePlus,
  LayoutTemplate,
  ArrowRight,
  SquareMousePointer,
} from "lucide-react";
import { cn } from "@/shared/utils";
import {
  useOnboardingCompleted,
  useSetOnboardingCompleted,
} from "@/app/store/selectors";

export const OnboardingModal = () => {
  const isCompleted = useOnboardingCompleted();
  const setCompleted = useSetOnboardingCompleted();

  const isOpen = !isCompleted;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCompleted(true);
    }
  };

  const steps = [
    {
      title: "Define Your Space",
      description:
        "Create and resize zones to match your actual walls. We handle the precision, you handle the vision.",
      icon: <SquareMousePointer className="text-primary h-5 w-5" />,
      containerClass: "bg-primary/10",
    },
    {
      title: "Upload & Style",
      description:
        "Drop your artwork or choose a pattern. If your project is wider than the image, we'll create a smart seamless pattern to keep it sharp.",
      icon: <ImagePlus className="text-primary h-5 w-5" />,
      containerClass: "bg-primary/10",
    },
    {
      title: "Perfect the Layout",
      description:
        "Arrange your modules with ease. We've started you off with your first panel to get things moving!",
      icon: <LayoutTemplate className="text-primary h-5 w-5" />,
      containerClass: "bg-primary/10",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="border-border overflow-hidden p-0 shadow-2xl sm:max-w-120">
        <DialogDescription className="sr-only">
          Welcome to Panel Studio. Follow these three steps to design your
          custom layout.
        </DialogDescription>

        <DialogHeader className="space-y-0 p-0">
          <div className="bg-secondary border-border relative border-b p-8 text-center">
            <div className="absolute top-4 right-4 opacity-20">
              <Sparkles className="text-primary h-10 w-10" />
            </div>
            <div className="bg-background border-border mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border shadow-sm">
              <LayoutTemplate className="text-primary h-7 w-7" />
            </div>

            <DialogTitle className="text-foreground text-2xl font-semibold tracking-tight">
              Welcome to Panel Studio
            </DialogTitle>

            <p className="text-muted-foreground mt-2 text-sm">
              Design your custom panel layout in three simple steps.
            </p>
          </div>
        </DialogHeader>

        <div className="bg-background space-y-6 p-6">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div
                className={cn(
                  "mt-0.5 shrink-0 rounded-lg p-2",
                  step.containerClass,
                )}
              >
                {step.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-foreground flex items-center gap-2 text-sm font-medium tracking-wide uppercase">
                  <span className="text-muted-foreground/50 font-mono text-xs">
                    0{idx + 1}
                  </span>
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-snug">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button
            className="h-11 w-full rounded-lg text-sm font-medium"
            onClick={() => setCompleted(true)}
          >
            Start Designing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
