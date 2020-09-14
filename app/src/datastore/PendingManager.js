export class PendingManager {
  constructor(firestore, callback) {
    this.firestore = firestore;
    this.collections = {};
    this.setPendingCallback = callback;
  }

  addCollection(name, details) {
    this.collections[name] = details;

    if (details.isSubcollection) {
      this._addCollectionListener(name, this.firestore.collectionGroup(name));
    } else {
      this._addCollectionListener(name, this.firestore.collection(name));
    }
  }

  _checkPendingRecords() {
    let hasPending = false;

    Object.keys(this.collections).forEach((key) => {
      if (this.collections[key].pending === true) {
        hasPending = true;
      }
    });

    this.setPendingCallback(hasPending);
  }

  _addCollectionListener(collectionName, collectionReference) {
    collectionReference.where("exported", "==", false).onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        if (
          querySnapshot.docChanges({ includeMetadataChanges: true }).length !==
          0
        ) {
          if (querySnapshot.metadata.hasPendingWrites) {
            this.collections[collectionName].pending = true;
          } else {
            this.collections[collectionName].pending = false;
          }
          this._checkPendingRecords();
        }
      },
      (e) => {
        console.log(e);
      }
    );
  }
}
