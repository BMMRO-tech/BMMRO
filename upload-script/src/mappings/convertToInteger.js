const convertToInteger = (value) => {
  if (!isNaN(value)) {
    return Math.floor(value);
  }
  return 0;
};

export default convertToInteger;
