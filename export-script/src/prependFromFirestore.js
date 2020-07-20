const prependFromFirestore = (inputString) => {
  return `From cloud firestore: ${inputString ? inputString : ""}`;
};

module.exports = prependFromFirestore;
