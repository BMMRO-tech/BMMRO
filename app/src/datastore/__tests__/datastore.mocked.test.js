import { Datastore, DatastoreError, initFirestore } from "../datastore";
import { DatastoreErrorType } from "../../constants/datastore";

class FirebaseErrorMock extends Error {
  constructor(code) {
    super("Firebase Error Mock");
    this.code = code;
  }
}

describe("Datastore with firestore", () => {
  const buildDatastoreMock = ({
    add = "",
    onSnapshot = "",
    doc = "",
    enablePersistence = "",
  }) => {
    const firestoreMock = {
      collection: jest.fn().mockReturnValue({
        add,
        doc,
        onSnapshot,
      }),
      enablePersistence,
    };

    return new Datastore(firestoreMock);
  };

  describe("enableOfflineStorage", () => {
    it("should throw 'DatastoreError' with code MULTIPLE_TABS when user has app open in multiple tabs", async () => {
      const collectionReturnMock = {
        enablePersistence: jest
          .fn()
          .mockRejectedValue(new FirebaseErrorMock("failed-precondition")),
      };
      const datastore = buildDatastoreMock(collectionReturnMock);

      await expect(datastore.enableOfflineStorage()).rejects.toThrow(
        new DatastoreError(DatastoreErrorType.MULTIPLE_TABS)
      );
    });

    it("should throw 'DatastoreError' with code BROWSER_NOT_SUPPORTED when Firestore offline storage is not implemented", async () => {
      const collectionReturnMock = {
        enablePersistence: jest
          .fn()
          .mockRejectedValue(new FirebaseErrorMock("unimplemented")),
      };
      const datastore = buildDatastoreMock(collectionReturnMock);

      await expect(datastore.enableOfflineStorage()).rejects.toThrow(
        new DatastoreError(DatastoreErrorType.BROWSER_NOT_SUPPORTED)
      );
    });

    it("should throw 'DatastoreError' with code UNKNOWN_OFFLINE_SUPPORT when Firebase responds with unrecognised error", async () => {
      const collectionReturnMock = {
        enablePersistence: jest.fn().mockRejectedValue(new Error()),
      };
      const datastore = buildDatastoreMock(collectionReturnMock);

      await expect(datastore.enableOfflineStorage()).rejects.toThrow(
        new DatastoreError(DatastoreErrorType.UNKNOWN_OFFLINE_SUPPORT)
      );
    });
  });
});

describe("initFirestore", () => {
  jest.mock("firebase", () => ({
    initializeApp: () => new Error(),
    firestore: () => {},
  }));

  it("should throw 'DatastoreError' with code INITIALIZATION when Firebase initialization fails", () => {
    expect(() => initFirestore({})).toThrow(
      new DatastoreError(DatastoreErrorType.INITIALIZATION)
    );
  });
});
