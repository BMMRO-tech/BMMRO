const convertDateToTimestamp = (date) => {

  return Math.floor(new Date(date + " 12:00:00").getTime() / 1000);


};

export default convertDateToTimestamp;
