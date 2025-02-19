const padToTwo = (number: number) => (number <= 9 ? `0${number}` : number);

export const displayTime = (secs: number) => {
  let mins = 0;

  if (secs < 0) {
    secs = 0;
  }

  if (secs < 60) {
    return `00:${padToTwo(secs)}`;
  }

  let secsRemainder = secs % 60;
  mins = (secs - secsRemainder) / 60;

  return `${padToTwo(mins)}:${padToTwo(secsRemainder)}`;
};

export const displayShotClock = (secs: number) => {
  if (secs < 0) {
    secs = 0;
  }

  return `${padToTwo(secs)}`;
};
