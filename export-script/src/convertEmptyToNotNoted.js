const convertEmptyToNotNoted = (option) => {
  if (!option) {
    return "Not Noted";
  }
  return option;
};

module.exports = convertEmptyToNotNoted;
