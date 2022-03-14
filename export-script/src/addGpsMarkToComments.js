const addGpsMarkToComments = (gpsMark = "", comment = "") => {
  let final = "";
  final += gpsMark == "" ? "" : "GPS mark: " + gpsMark + ". ";
  final += comment == "" ? "" : comment;

  return final;
};

module.exports = addGpsMarkToComments;
