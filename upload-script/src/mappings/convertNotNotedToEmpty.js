const convertNotNotedToEmpty = (option) => {
  if (option === "Not Noted" ) {
    return "";
  }
  return option;
};

module.exports = convertNotNotedToEmpty;
