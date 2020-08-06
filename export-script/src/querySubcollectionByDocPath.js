const querySubcollectionByDocPath = async (
  firestoreInstance,
  path,
  subCollection
) => {
  const rawResults = await firestoreInstance
    .doc(path)
    .collection(subCollection)
    .get();

  const results = [];
  rawResults.forEach((doc) => {
    results.push({
      parentPath: path,
      path: doc.ref.path,
      ...doc.data(),
    });
  });
  return results;
};

module.exports = querySubcollectionByDocPath;
