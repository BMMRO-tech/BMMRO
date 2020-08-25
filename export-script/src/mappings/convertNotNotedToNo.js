const convertNotNotedToNo = (value) => {
  return value === "not-noted" ? "No" : value;
};

module.exports = convertNotNotedToNo;
