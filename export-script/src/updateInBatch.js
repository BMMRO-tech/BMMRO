const getMessage = require("./constants/getMessage");
const Status = require("./helpers/Status");

const updateInBatch = async (firestoreInstance, entries, update) => {
  const batch = firestoreInstance.batch();

  entries.forEach((entry) => {
    const docRef = firestoreInstance.doc(entry.path);
    batch.update(docRef, update);
  });

  try {
    await batch.commit();
    return new Status("SUCCESS", getMessage("BATCH_UPDATE_SUCCESSFUL"));
  } catch (err) {
    return new Status("BATCH_UPDATE_FAILED", getMessage("BATCH_UPDATE_FAILED"));
  }
};

module.exports = updateInBatch;
