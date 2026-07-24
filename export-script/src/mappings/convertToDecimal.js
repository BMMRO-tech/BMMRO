const convertToDecimal = (value) => {
  if (Number.isInteger(value)) {
    return value.toFixed(1);
  }
  return value;
};

export default convertToDecimal;
