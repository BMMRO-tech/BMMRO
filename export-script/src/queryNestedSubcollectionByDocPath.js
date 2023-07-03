const queryNestedSubcollectionByDocPath = async (
    firestoreInstance,
    path,
    subCollection,
    nestedSubCollection
  ) => {
    const splitPathArray = path.split("/");

    const parentPath = `${splitPathArray[0]}/${splitPathArray[1]}`
    const childPath = `/${splitPathArray[3]}`

    const rawResults = await firestoreInstance
      .doc(parentPath)
      .collection(subCollection)
      .doc(childPath)
      .collection(nestedSubCollection)
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
  
  module.exports = queryNestedSubcollectionByDocPath;
  