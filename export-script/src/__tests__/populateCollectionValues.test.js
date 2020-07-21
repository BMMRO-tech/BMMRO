const populateCollectionValues = require("../populateCollectionValues");

describe("populateCollectionValues", () => {
  it("populates values given one collection and one subcollection entry", () => {
    const collectionEntries = [
      {
        id: "123",
        a: "test1",
        b: "test2",
      },
    ];

    const subcollectionEntries = [{ parentId: "123", d: "test4" }];

    const fieldMapConfig = { a: "a", b2: "b" };

    const result = populateCollectionValues(
      collectionEntries,
      subcollectionEntries,
      fieldMapConfig
    );

    expect(result).toEqual([
      {
        parentId: "123",
        d: "test4",
        a: "test1",
        b2: "test2",
      },
    ]);
  });

  it("populates values given multiple collection and subcollection entries", () => {
    const collectionEntries = [
      {
        id: "123",
        a: "test1",
        b: "test2",
      },
      {
        id: "345",
        a: "test3",
        b: "test4",
      },
    ];

    const subcollectionEntries = [
      { parentId: "123", d: "test5" },
      { parentId: "123", d: "test6" },
      { parentId: "345", d: "test5" },
      { parentId: "345", d: "test7" },
      { parentId: "345", d: "test6" },
    ];

    const fieldMapConfig = { a: "a", b2: "b" };

    const result = populateCollectionValues(
      collectionEntries,
      subcollectionEntries,
      fieldMapConfig
    );

    expect(result).toEqual([
      {
        parentId: "123",
        d: "test5",
        a: "test1",
        b2: "test2",
      },
      {
        parentId: "123",
        d: "test6",
        a: "test1",
        b2: "test2",
      },
      {
        parentId: "345",
        d: "test5",
        a: "test3",
        b2: "test4",
      },
      {
        parentId: "345",
        d: "test7",
        a: "test3",
        b2: "test4",
      },
      {
        parentId: "345",
        d: "test6",
        a: "test3",
        b2: "test4",
      },
    ]);
  });

  it("filters out subcollection entries that don't match any collection entry", () => {
    const collectionEntries = [
      {
        id: "123",
        a: "test1",
        b: "test2",
      },
    ];

    const subcollectionEntries = [
      { parentId: "123", d: "test4" },
      { parentId: "345", d: "test5" },
    ];

    const fieldMapConfig = { a: "a", b2: "b" };

    const result = populateCollectionValues(
      collectionEntries,
      subcollectionEntries,
      fieldMapConfig
    );

    expect(result).toEqual([
      {
        parentId: "123",
        d: "test4",
        a: "test1",
        b2: "test2",
      },
    ]);
  });
  it("returns an empty array if no matching subcollection entries are found", () => {
    const collectionEntries = [
      {
        id: "123",
        a: "test1",
        b: "test2",
      },
    ];

    const subcollectionEntries = [
      { parentId: "345", d: "test4" },
      { parentId: "456", d: "test5" },
    ];

    const fieldMapConfig = { a: "a", b2: "b" };

    const result = populateCollectionValues(
      collectionEntries,
      subcollectionEntries,
      fieldMapConfig
    );

    expect(result).toEqual([]);
  });
});
