import getMessage from "./constants/getMessage.js";
import Status from "./helpers/Status.js";

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

export default updateInBatch;
