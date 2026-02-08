import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { cn } from "@/shared/utils";
import { Ban } from "lucide-react";
import { toast } from "sonner";

interface PanelGroupSettingsProps {
  title: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
  disabledItems?: string[];
  getDisabledReason: (item: string) => string | null;
}

export const PanelGroupSettings = (props: PanelGroupSettingsProps) => {
  const {
    title,
    items,
    value,
    onChange,
    disabledItems = [],
    getDisabledReason,
  } = props;

  return (
    <div className="flex w-full flex-col gap-3">
      <h4 className="text-muted-foreground ml-1 text-[10px] font-bold tracking-widest uppercase opacity-70">
        {title}
      </h4>

      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(newValue) => {
          if (newValue) {
            onChange(newValue);
          }
        }}
        className="flex w-full items-center justify-start gap-2"
      >
        {items.map((option) => {
          const isDisabled = disabledItems.includes(option);
          const isActive = value === option;

          return (
            <div
              key={option}
              className="flex-1"
              onClickCapture={(e) => {
                if (isDisabled) {
                  e.stopPropagation();
                  e.preventDefault();

                  const reason = getDisabledReason
                    ? getDisabledReason(option)
                    : "This option is unavailable.";

                  toast.custom(() => (
                    <div className="bg-destructive/5 text-destructive border-destructive/20 flex items-center gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md">
                      <div className="bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-full">
                        <Ban className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-semibold">{reason}</p>
                    </div>
                  ));
                }
              }}
            >
              <ToggleGroupItem
                value={option}
                aria-label={`${option} panels`}
                disabled={false}
                aria-disabled={isDisabled}
                className={cn(
                  "h-12 w-full rounded-2xl border text-sm font-medium transition-all duration-300 ease-out",

                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-primary/20 shadow-md ring-0"
                    : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent",

                  isDisabled &&
                    "bg-secondary/10 border-border/50 text-muted-foreground/50 hover:bg-secondary/10 cursor-not-allowed border-dashed opacity-40",
                )}
              >
                {option}
              </ToggleGroupItem>
            </div>
          );
        })}
      </ToggleGroup>
    </div>
  );
};
