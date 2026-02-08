import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils";
import { z } from "zod";

interface ValidatedNumberInputProps {
  value: number;
  onValueChange: (val: number) => void;
  schema: z.ZodSchema<number>;
  min: number;
  max: number;
  suffix?: string;
  className?: string;
}

export const ValidatedNumberInput = (props: ValidatedNumberInputProps) => {
  const {
    value,
    onValueChange,
    schema,
    min,
    max,
    suffix = "cm",
    className,
  } = props;

  const [localValue, setLocalValue] = useState<string>(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const validationResult = schema.safeParse(localValue);

  const clampToRange = (val: number) => {
    return parseFloat(Math.max(min, Math.min(val, max)).toFixed(1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setLocalValue(rawValue);

    const parsed = schema.safeParse(rawValue);
    if (parsed.success) {
      onValueChange(parsed.data);
    }
  };

  const handleBlur = () => {
    const parsed = schema.safeParse(localValue);

    if (!parsed.success) {
      setLocalValue(value.toString());
      return;
    }

    const numericVal = parseFloat(localValue);

    if (isNaN(numericVal)) {
      setLocalValue(value.toString());
      return;
    }

    const clamped = clampToRange(numericVal);
    setLocalValue(clamped.toString());

    if (clamped !== value) {
      onValueChange(clamped);
    }
  };

  return (
    <div className="w-full text-center">
      <div className="inline-flex items-baseline justify-center">
        <Input
          type="number"
          className={cn(
            "no-input-arrows h-auto w-full border-none bg-transparent p-0 text-center shadow-none focus-visible:ring-0",
            "text-foreground placeholder:text-muted-foreground/20 text-2xl font-light tracking-tight",
            !validationResult.success && "text-destructive",
            className,
          )}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />

        {suffix && (
          <span className="text-muted-foreground/50 ml-0.5 text-sm font-medium select-none">
            {suffix}
          </span>
        )}
      </div>

      {!validationResult.success && (
        <div className="text-destructive animate-in fade-in slide-in-from-top-1 mt-1 text-xs font-medium duration-200">
          {validationResult.error.issues[0].message}
        </div>
      )}
    </div>
  );
};
