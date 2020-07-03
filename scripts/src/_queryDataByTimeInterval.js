const _queryDataByTimeInterval = async (
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
  rawResults.forEach((doc) => results.push(doc.data()));
  return results;
};

module.exports = _queryDataByTimeInterval;
