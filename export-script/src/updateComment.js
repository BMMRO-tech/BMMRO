const addGpsMarkToComments = require("./addGpsMarkToComments");

const updateComment = (gpsMark = "", comment = "") => {
  if (!comment.latitude || !comment.longitude) {
    return (
      addGpsMarkToComments(gpsMark, comment.comments)
    );
  } else {
    return comment.comments;
  }
};

module.exports = updateComment;
