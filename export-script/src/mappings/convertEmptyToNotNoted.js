const convertEmptyToNotNoted = (option) => {
  if (!option) {
    return "Not Noted";
  }
  return option;
};

export default convertEmptyToNotNoted;
