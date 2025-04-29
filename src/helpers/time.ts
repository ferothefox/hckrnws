export const prettyTime = (time: number): string => {
  const pastDate = new Date(time * 1000);
  const timeAgoString = calculateTimeAgoString(pastDate);

  return formatTimeShorthand(timeAgoString);
};

const formatTimeShorthand = (convertedString: string): string => {
  const splitString = convertedString.split(" ");
  if (splitString.length < 2) {
    return convertedString;
  }
  const value = splitString[0];
  const unit = splitString[1];

  return `${value}${unit.charAt(0)}`;
};

const calculateTimeAgoString = (pastDate: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInMonth = secondsInDay * 30; // Approximation
  const secondsInYear = secondsInDay * 365; // Approximation

  if (diffInSeconds < secondsInMinute) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""}`;
  } else if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else if (diffInSeconds < secondsInMonth) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return `${days} day${days !== 1 ? "s" : ""}`;
  } else if (diffInSeconds < secondsInYear) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return `${months} month${months !== 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(diffInSeconds / secondsInYear);
    return `${years} year${years !== 1 ? "s" : ""}`;
  }
};
