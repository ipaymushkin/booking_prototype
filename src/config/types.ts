export interface RouteInterface {
  path: string;
}

export interface DayInterface {
  date: string; // yyyy-mm-dd
  places: {
    [key: number]: {
      time: string; // hh:mm
      available: boolean;
    }[];
  };
}
