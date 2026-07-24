import addGpsMarkToComments from "./addGpsMarkToComments.js";

const updateComment = (gpsMark = "", comment = "") => {
  if (!comment.latitude || !comment.longitude) {
    return (
      addGpsMarkToComments(gpsMark, comment.comments)
    );
  } else {
    return comment.comments;
  }
};

export default updateComment;
