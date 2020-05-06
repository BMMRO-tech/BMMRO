import { Datastore } from "../datastore";

jest.mock("firebase");

describe("Datastore with firestore", () => {
  it("should add expected data to habitat use collection", async () => {
    const firestoreMock = {
      collection: jest.fn().mockReturnValue({
        add: jest.fn().mockResolvedValue({ id: "abc123" }),
      }),
    };

    const datastore = new Datastore(firestoreMock);

    const result = await datastore.createHabitatUse({ value1: "123" });

    expect(firestoreMock.collection).toHaveBeenCalledTimes(1);
    expect(firestoreMock.collection().add).toHaveBeenCalledWith({
      value1: "123",
    });
    expect(result).toEqual("abc123");
  });

  it("should throw exception", async () => {
    const firestoreMock = {
      collection: jest.fn().mockReturnValue({
        add: jest.fn().mockRejectedValue(new Error("mango")),
      }),
    };

    const datastore = new Datastore(firestoreMock);

    await expect(datastore.createHabitatUse("123")).rejects.toThrow(
      new Error("in createHabitatUse: mango")
    );
  });
});
