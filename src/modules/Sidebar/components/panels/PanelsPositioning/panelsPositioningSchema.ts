import { z } from "zod";

export const panelsPositioningSchema = (min: number, max: number) =>
  z.coerce
    .number()
    .min(min, {
      message: `The distance to the outer sides of the surface must be at least ${min} cm`,
    })
    .max(max, {
      message: `The distance to the outer sides of the surface must be at least ${min} cm`,
    })
    .refine(
      (n) => {
        const decimalPart = n.toString().split(".")[1];
        return !decimalPart || decimalPart.length < 2;
      },
      { message: `The distance may only have one decimal place` },
    );
