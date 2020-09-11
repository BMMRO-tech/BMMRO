export class PendingManager {
  constructor(firestore) {
    this.firestore = firestore;
    this.collections = [];
  }

  addCollection(newCollection) {
    const index = this.collections.push(newCollection) - 1;

    if (newCollection.subcollection) {
      this._addCollectionListener(
        index,
        this.firestore.collectionGroup(this.collections[index].name)
      );
    } else {
      this._addCollectionListener(
        index,
        this.firestore.collection(this.collections[index].name)
      );
    }
  }

  hasPendingRecords() {
    let hasPending = false;

    this.collections.forEach((collection) => {
      if (collection.pending === true) {
        hasPending = true;
      }
    });

    return hasPending;
  }

  _addCollectionListener(collectionIndex, collectionReference) {
    collectionReference.where("exported", "==", false).onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        if (
          querySnapshot.docChanges({ includeMetadataChanges: true }).length !==
          0
        ) {
          if (querySnapshot.metadata.hasPendingWrites) {
            this.collections[collectionIndex].pending = true;
          } else {
            this.collections[collectionIndex].pending = false;
          }
        }
      },
      (e) => {
        console.log(e);
      }
    );
  }
}
