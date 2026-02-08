import { cn } from "@/shared/utils";
import { dimensionSchema } from "./dimensionsSchema";
import { ValidatedNumberInput } from "@/modules/Sidebar/components/shared/ValidatedNumberInput";

interface DimensionsInputProps {
  dimension: "height" | "width";
  defaultValue: number;
  min: number;
  max: number;
  isSelected: boolean;
  onValueChange: (value: number) => void;
}

export const DimensionInput = (props: DimensionsInputProps) => {
  const { dimension, isSelected, min, max, defaultValue, onValueChange } =
    props;

  const label = dimension === "width" ? "Width" : "Height";
  const schema = dimensionSchema(min, max, label);

  return (
    <div
      className={cn(
        "group flex flex-col items-center justify-center rounded-2xl p-3 transition-all duration-300",
        isSelected
          ? "bg-secondary/50 ring-foreground/5 ring-1 ring-inset"
          : "bg-secondary/20 hover:bg-secondary/30",
      )}
    >
      <span className="text-muted-foreground mb-0.5 text-xs font-bold tracking-widest uppercase opacity-70">
        {label}
      </span>

      <div className="w-full">
        <ValidatedNumberInput
          onValueChange={onValueChange}
          max={max}
          min={min}
          schema={schema}
          value={defaultValue}
          suffix="cm"
        />
      </div>

      <div className="flex justify-center opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
        <span className="text-muted-foreground/60 text-xs font-medium">
          {min} - {max} cm
        </span>
      </div>
    </div>
  );
};
