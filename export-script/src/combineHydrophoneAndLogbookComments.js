const addGpsMarkToComments = require("./addGpsMarkToComments");

const combineHydrophoneAndLogbookComments = (gpsMark = "", values = "") => {

 let comment = "";
 comment += !values.hydrophoneComments ? "" : values.hydrophoneComments + ". ";
 comment += !values.logbookComments ? "" : values.logbookComments;

  if (!values.latitude || !values.longitude) {
    return (
      addGpsMarkToComments(gpsMark, comment)
    );
  } else {
    return comment;
  }
};

module.exports = combineHydrophoneAndLogbookComments;
