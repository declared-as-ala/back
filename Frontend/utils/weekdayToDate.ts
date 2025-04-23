// utils/weekdayToDate.ts
export function weekdayToDate(
  weekday: string, // e.g. "Monday"
  reference = new Date() // today by default
) {
  // Build a map  Sun(0)…Sat(6)
  const idxOfWeekday =
    {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    }[weekday.toLowerCase()] ?? 0;

  const ref = new Date(reference);
  const diff = (idxOfWeekday + 7 - ref.getDay()) % 7; // days ahead this week
  ref.setDate(ref.getDate() + diff);
  // format YYYY‑MM‑DD for <Calendar />
  return ref.toISOString().split("T")[0];
}
