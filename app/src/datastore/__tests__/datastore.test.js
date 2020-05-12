import { Datastore } from "../datastore";

describe("Datastore with firestore", () => {
  const buildDatastoreMock = (mock) => {
    const firestoreMock = {
      collection: jest.fn().mockReturnValue(mock),
    };

    return new Datastore(firestoreMock);
  };

  describe("createHabitatUse", () => {
    it("should add expected data to habitat use collection", async () => {
      const collectionReturnMock = {
        add: jest.fn().mockResolvedValue({ id: "abc123" }),
      };
      const datastore = buildDatastoreMock(collectionReturnMock);

      const actual = await datastore.createHabitatUse({ value1: "123" });
      expect(actual).toEqual("abc123");
    });

    it("should throw exception", async () => {
      const collectionReturnMock = {
        add: jest.fn().mockRejectedValue(new Error("mango")),
      };
      const datastore = buildDatastoreMock(collectionReturnMock);

      await expect(datastore.createHabitatUse("123")).rejects.toThrow(
        new Error("in createHabitatUse: mango")
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
      datastore.listenForPendingHabitatUseRecords(saveRecords);

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
      datastore.listenForPendingHabitatUseRecords(saveRecords);

      const expectedRecords = [];

      expect(actualRecords).toStrictEqual(expectedRecords);
    });
  });
});
