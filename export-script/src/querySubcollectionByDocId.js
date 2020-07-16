const querySubcollectionByDocId = async (
  firestoreInstance,
  id,
  collection,
  subCollection
) => {
  const rawResults = await firestoreInstance
    .collection(collection)
    .doc(id)
    .collection(subCollection)
    .get();

  const results = [];
  rawResults.forEach((doc) => results.push(doc.data()));
  return results;
};

module.exports = querySubcollectionByDocId;
