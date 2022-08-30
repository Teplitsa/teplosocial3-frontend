export const roundDownMinutes = (duration: number) => {
  return Math.trunc((duration % 60) / 15) * 15;
};
