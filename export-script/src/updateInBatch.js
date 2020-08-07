const updateInBatch = async (firestoreInstance, entries, update) => {
  const batch = firestoreInstance.batch();

  entries.forEach((entry) => {
    const docRef = firestoreInstance.doc(entry.path);
    batch.update(docRef, update);
  });

  await batch.commit();
};

module.exports = updateInBatch;
