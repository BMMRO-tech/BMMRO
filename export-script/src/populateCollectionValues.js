const populateCollectionValues = (
  collectionEntries,
  subcollectionEntries,
  fieldsToPopulateMap
) => {
  const populatedSubcollectionEntries = [];

  collectionEntries.forEach((collectionEntry) => {
    const filteredSubcollectionEntries = subcollectionEntries.filter(
      (subcollectionEntry) =>
        subcollectionEntry.parentPath === collectionEntry.path
    );

    filteredSubcollectionEntries.forEach((subcollectionEntry) => {
      const populatedSubcollectionEntry = { ...subcollectionEntry };
     
      for (const [key, value] of Object.entries(fieldsToPopulateMap)) {
        populatedSubcollectionEntry[key] = collectionEntry[value];
      }
      populatedSubcollectionEntries.push(populatedSubcollectionEntry);
    });
  });
  return populatedSubcollectionEntries;
};

module.exports = populateCollectionValues;
