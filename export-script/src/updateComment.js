const addGpsMarkToComments = require("./addGpsMarkToComments");
const prependFromFirestore = require("./mappings/prependFromFirestore");

const updateComment = (
    gpsMark = "",
    comment = ""
  ) => {
    console.log(gpsMark);
    //console.log(comment.comments);
    return prependFromFirestore(addGpsMarkToComments(gpsMark, comment.comments));
  };
  
  module.exports = updateComment;