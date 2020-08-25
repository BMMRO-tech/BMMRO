const convertNotNotedToZero = (value) => {
  return value === "not-noted" ? 0 : value;
};

module.exports = convertNotNotedToZero;
