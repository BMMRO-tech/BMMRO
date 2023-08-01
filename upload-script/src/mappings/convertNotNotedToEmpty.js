const convertNotNotedToEmpty = (option) => {
  if (option === "Not Noted") {
    return "";
  }
  return option;
};

export default convertNotNotedToEmpty;
