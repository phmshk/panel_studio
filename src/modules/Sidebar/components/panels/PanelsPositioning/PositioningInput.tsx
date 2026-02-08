import { panelsPositioningSchema } from "./panelsPositioningSchema";
import { PANEL_MARGIN_FROM_EDGE, PANEL_SIZE } from "@/shared/constants";
import { ValidatedNumberInput } from "@/modules/Sidebar/components/shared/ValidatedNumberInput";

interface PositioningProps {
  limit: number;
  defaultValue: number;
  onValueChange: (value: number) => void;
  inverted?: boolean;
  onValidate?: (value: number) => boolean;
}

export const PositioningInput = (props: PositioningProps) => {
  const { limit, defaultValue, onValueChange, inverted, onValidate } = props;
  const min = PANEL_MARGIN_FROM_EDGE + PANEL_SIZE / 2;
  const max = limit - (PANEL_MARGIN_FROM_EDGE + PANEL_SIZE / 2);

  const displayedValue = inverted
    ? parseFloat((limit - defaultValue).toFixed(1))
    : defaultValue;

  const handleValueChange = (newValue: number) => {
    const finalValue = inverted
      ? parseFloat((limit - newValue).toFixed(1))
      : newValue;
    onValueChange(finalValue);
  };

  const schema = panelsPositioningSchema(min, max).refine(
    (val) => {
      if (!onValidate) return true;
      const finalValue = inverted ? parseFloat((limit - val).toFixed(1)) : val;
      return onValidate(finalValue);
    },
    { message: "Collision detected" },
  );

  return (
    <div className="group bg-secondary/10 hover:bg-secondary/20 hover:border-primary/10 flex w-full flex-col items-center justify-center rounded-2xl border border-transparent p-2 transition-all">
      <ValidatedNumberInput
        onValueChange={handleValueChange}
        value={displayedValue}
        max={max}
        min={min}
        schema={schema}
        suffix="cm"
        className="text-xl font-light"
      />
    </div>
  );
};
