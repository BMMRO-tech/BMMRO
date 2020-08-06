const queryCollectionByTimeRange = async (
  startDate,
  endDate,
  timestampFieldName,
  firestoreInstance,
  collection
) => {
  const rawResults = await firestoreInstance
    .collection(collection)
    .where(timestampFieldName, ">=", startDate)
    .where(timestampFieldName, "<", endDate)
    .get();

  const results = [];
  rawResults.forEach((doc) =>
    results.push({ path: doc.ref.path, ...doc.data() })
  );
  return results;
};

module.exports = queryCollectionByTimeRange;
