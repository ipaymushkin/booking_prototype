import { DayInterface } from "../config/types.ts";

export const getAvailableDates = ({
  dates,
  checkAvailableSlots = false,
}: {
  dates: DayInterface[];
  checkAvailableSlots?: boolean;
}) => {
  const arr = [] as string[];
  dates?.forEach((day: DayInterface) => {
    if (
      !checkAvailableSlots ||
      Object.values(day.places)?.some((place) =>
        place.some((slot) => slot.available),
      )
    ) {
      arr.push(day.date);
    }
  });
  return arr;
};
