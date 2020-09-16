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
    let pendingCount = 0;

    Object.keys(this.collections).forEach((key) => {
      Object.keys(this.collections[key].pending).forEach((pendingKey) => {
        if (this.collections[key].pending[pendingKey]) {
          pendingCount++;
        }
      });
    });

    this.setPendingCallback(pendingCount);
  }

  _addCollectionListener(collectionName, collectionReference) {
    collectionReference.where("exported", "==", false).onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        if (
          querySnapshot.docChanges({ includeMetadataChanges: true }).length !==
          0
        ) {
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites) {
              this.collections[collectionName].pending[doc.id] = true;
            } else {
              this.collections[collectionName].pending[doc.id] = false;
            }
          });
          this._checkPendingRecords();
        }
      },
      (e) => {
        console.log(e);
      }
    );
  }
}
