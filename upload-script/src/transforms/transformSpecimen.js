import convertDateToTimestamp from "../mappings/convertDateToTimestamp.js";

const transformSpecimen = (specimens) => {
  specimens.map((specimen) => {
    specimen.dateTaken = convertDateToTimestamp(specimen.dateTaken);
  });

  return specimens;
};

export default transformSpecimen;
