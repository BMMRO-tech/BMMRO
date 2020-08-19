export const getCurrentDate = () =>
  new Date(new Date(Date.now()).setMilliseconds(0));

export const constructDateTime = (date, time) => {
  const [hours, minutes, seconds = 0] = time.split(":");

  return new Date(date).setHours(hours, minutes, seconds);
};
