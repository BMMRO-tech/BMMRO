const addGpsMarkToComments = require("./addGpsMarkToComments");
const prependFromApp = require("./mappings/prependFromApp");

const updateComment = (gpsMark = "", comment = "") => {
  if (!comment.latitude || !comment.longitude) {
    return prependFromApp(
      addGpsMarkToComments(gpsMark, comment.comments)
    );
  } else {
    return prependFromApp(comment.comments);
  }
};

module.exports = updateComment;
