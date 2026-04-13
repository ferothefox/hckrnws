const TIME_UNITS = [
  { label: "year", seconds: 60 * 60 * 24 * 365 },
  { label: "month", seconds: 60 * 60 * 24 * 30 },
  { label: "day", seconds: 60 * 60 * 24 },
  { label: "hour", seconds: 60 * 60 },
  { label: "minute", seconds: 60 },
] as const;

export function prettyTime(unixTimestamp: number): string {
  const elapsedSeconds = Math.max(
    0,
    Math.floor(Date.now() / 1000) - unixTimestamp,
  );

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds}s`;
  }

  for (const unit of TIME_UNITS) {
    if (elapsedSeconds >= unit.seconds) {
      return `${Math.floor(elapsedSeconds / unit.seconds)}${unit.label.charAt(0)}`;
    }
  }

  return "0s";
}
