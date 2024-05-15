const queryCollectionByConditions = async (
  firestoreInstance,
  collection,
  conditions,
) => {
  var query = firestoreInstance
    .collection(collection);

  conditions.forEach(({key, value, operator}) => {
        query = query.where(key, operator, value)
    });
    
  var rawResults = await query.get();

  const results = [];
  rawResults.forEach((doc) =>
    results.push({ path: doc.ref.path, ...doc.data() })
  );

  return results;
};

module.exports = queryCollectionByConditions;
