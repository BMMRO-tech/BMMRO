const updateInBatch = async (firestoreInstance, entries, update) => {
  const batch = firestoreInstance.batch();

  const docRef = firestoreInstance.doc(entries[0].path);
  batch.update(docRef, update);

  await batch.commit();
};

module.exports = updateInBatch;
