const addGpsMarkToComments = require("./addGpsMarkToComments");
const prependFromFirestore = require("./mappings/prependFromFirestore");

const updateComment = (gpsMark = "", comment = "") => {
  if (!comment.latitude || !comment.longitude) {
    return prependFromFirestore(
      addGpsMarkToComments(gpsMark, comment.comments)
    );
  } else {
    return prependFromFirestore(comment.comments);
  }
};

module.exports = updateComment;
