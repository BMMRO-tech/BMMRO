const convertInitialsToSex = (sexInput) => {
  switch (sexInput) {
    case "M":
      return "male";
    case "F":
      return "female";
    case "U":
      return "unknown";
    default:
      return "";
  }
};

export default convertInitialsToSex;
