import { z } from "zod";

export const dimensionSchema = (min: number, max: number, label: string) =>
  z.coerce
    .number()
    .min(min, {
      message: `The ${label} must be between ${min} and ${max} cm`,
    })
    .max(max, {
      message: `The ${label} must be between ${min} and ${max} cm`,
    })
    .refine(
      (n) => {
        const decimalPart = n.toString().split(".")[1];
        return !decimalPart || decimalPart.length < 2;
      },
      { message: `The ${label} may only have one decimal place` },
    );
