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
    // NOTE: Pending *deletes* are not reflected in the pendingCount indicator.
    // Firestore applies deletes to the local cache 
    // doc disappears from this snapshot immediately — before the delete has
    // actually reached the server. This is an accepted gap: worst case is a
    // deleted item reappearing if the delete never syncs (e.g. offline + app
    // closed before reconnecting), which is recoverable. Tracking pending
    // deletes properly would require watching docChanges with
    // type === "removed" and maintaining a separate pending-deletion set -
    // not worth the added complexity for this edge case.
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
      },
    );
  }
}
