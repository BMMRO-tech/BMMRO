export const getCurrentDate = () => new Date(Date.now());

export const constructDateTime = (date, time) => {
  const [hours, minutes, seconds = 0] = time.split(":");

  return new Date(date).setHours(hours, minutes, seconds);
};
