const exportedFieldName = "exported";

const queryCollectionByTimeRange = async (
  startDate,
  endDate,
  timestampFieldName,
  firestoreInstance,
  collection,
  onlyUnexported
) => {
  const exportedConditions = onlyUnexported ? [false] : [true, false];

  const rawResults = await firestoreInstance
    .collection(collection)
    .where(timestampFieldName, ">=", startDate)
    .where(timestampFieldName, "<", endDate)
    .where(exportedFieldName, "in", exportedConditions)
    .get();

  const results = [];
  rawResults.forEach((doc) =>
    results.push({ path: doc.ref.path, ...doc.data() })
  );
  return results;
};

module.exports = queryCollectionByTimeRange;
