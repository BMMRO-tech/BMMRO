import { Datastore, DatastoreError, initFirestore } from "../datastore";
import { DatastoreErrorType } from "../../constants/datastore";
import { CollectionNames } from "../../constants/datastore";
import { collectionData } from "../__fixtures__/collectionData";
import * as firebaseTesting from "@firebase/testing";

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

  describe("createHabitatUse", () => {
    const projectId = "project-id";
    const uid = "testId";
    let firestoreEmulator;
    let encounterId;

    beforeAll(async () => {
      const firebaseMock = firebaseTesting.initializeTestApp({
        projectId,
        auth: { uid },
      });
      firestoreEmulator = firebaseMock.firestore();

      const documentRef = await firestoreEmulator
        .collection(CollectionNames.ENCOUNTER)
        .add(collectionData);

      encounterId = documentRef.id;
    });

    afterAll(async () => {
      await firebaseTesting.clearFirestoreData({ projectId });
      await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
    });

    it("should add expected data to habitat use collection", async () => {
      const datastore = new Datastore(firestoreEmulator);

      const actual = await datastore.createHabitatUse(encounterId, {
        value1: "123",
      });

      expect(actual).not.toBe(null);
    });

    it("should throw 'DatastoreError' with code COLLECTION_ITEM_CREATION when create habitat use fails", async () => {
      const datastore = new Datastore(firestoreEmulator);

      await expect(
        datastore.createHabitatUse(encounterId, "abc")
      ).rejects.toThrow(
        new DatastoreError(DatastoreErrorType.COLLECTION_ITEM_CREATION)
      );
    });
  });

  describe("listenForPendingHabitatUseRecords", () => {
    it("should perform an action defined in the callback on pending records", () => {
      const collectionReturnMock = {
        onSnapshot: jest.fn(({}, success) =>
          success({
            docs: [
              {
                metadata: {
                  hasPendingWrites: true,
                },
                data: jest.fn(() => ({
                  date: "20/02/2020",
                  time: "15:30",
                })),
              },
            ],
          })
        ),
      };

      const datastore = buildDatastoreMock(collectionReturnMock);
      let actualRecords;
      const saveRecords = (data) => {
        actualRecords = data;
      };
      datastore.subscribeToPendingHabitatUseRecords(saveRecords);

      const expectedRecords = [
        {
          date: "20/02/2020",
          time: "15:30",
        },
      ];

      expect(actualRecords).toStrictEqual(expectedRecords);
    });

    it("should ignore not pending records", () => {
      const collectionReturnMock = {
        onSnapshot: jest.fn(({}, success) =>
          success({
            docs: [
              {
                metadata: {
                  hasPendingWrites: false,
                },
              },
            ],
          })
        ),
      };

      const datastore = buildDatastoreMock(collectionReturnMock);
      let actualRecords;
      const saveRecords = (data) => {
        actualRecords = data;
      };
      datastore.subscribeToPendingHabitatUseRecords(saveRecords);

      const expectedRecords = [];

      expect(actualRecords).toStrictEqual(expectedRecords);
    });
    it("should throw 'DatastoreError' with code UPDATES_SUBSCRIPTION when subscribing to updates fails", () => {
      const collectionReturnMock = {
        onSnapshot: jest.fn(({}, success) =>
          success({
            docs: [
              {
                metadata: {
                  hasPendingWrites: false,
                },
              },
            ],
          })
        ),
      };

      const datastore = buildDatastoreMock(collectionReturnMock);

      const saveRecords = () => {
        throw new Error();
      };

      expect(() =>
        datastore.subscribeToPendingHabitatUseRecords(saveRecords)
      ).toThrow(new DatastoreError(DatastoreErrorType.UPDATES_SUBSCRIPTION));
    });
  });

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
