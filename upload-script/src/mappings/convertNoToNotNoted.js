const convertNoToNotNoted = (value) => {
  return value === "No" ? "not-noted" : value;
};

module.exports = convertNoToNotNoted;
