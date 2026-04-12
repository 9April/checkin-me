/** Consistent date+time for dashboard / bookings (uses runtime locale). */
export function formatSubmittedAt(d: Date): string {
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
