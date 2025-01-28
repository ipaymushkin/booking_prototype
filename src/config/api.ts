export const BASE_URL =
  import.meta.env.VITE_APP_SERVER_BASE_URL || "http://10.0.0.50:8084/api";

export const api = {
  days: (id?: number | string) => (id ? `/days/${id}` : `/days`),
};
