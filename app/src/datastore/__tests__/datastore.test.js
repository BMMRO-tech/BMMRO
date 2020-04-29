import { Datastore } from "../datastore";

jest.mock("firebase");

describe("Datastore with firestore", () => {
  it("should add expected data to habitat use collection", () => {
    const firestore = {
      collection: jest
        .fn()
        .mockReturnValue({
          add: jest.fn().mockResolvedValue({ id: "abc123" }),
        }),
    };

    const datastore = new Datastore(firestore);

    datastore.recordHabitatUse({ value1: "123" });

    expect(firestore.collection).toHaveBeenCalledTimes(1);
    expect(firestore.collection().add).toHaveBeenCalledWith({ value1: "123" });
  });
});
