const populateCollectionValues = require("../populateCollectionValues");

describe("populateCollectionValues", () => {
  it("populates values given one collection and one subcollection entry", () => {
    const collectionEntries = [
      {
        path: "abc/123",
        a: "test1",
        b: "test2",
      },
    ];

    const subcollectionEntries = [{ parentPath: "abc/123", d: "test4" }];

    const fieldMapConfig = { a: "a", b2: "b" };

    const result = populateCollectionValues(
      collectionEntries,
      subcollectionEntries,
      fieldMapConfig
    );

    expect(result).toEqual([
      {
        parentPath: "abc/123",
        d: "test4",
        a: "test1",
        b2: "test2",
      },
    ]);
  });

  it("populates values given multiple collection and subcollection entries", () => {
    const collectionEntries = [
      {
        path: "abc/123",
        a: "test1",
        b: "test2",
      },
      {
        path: "abc/345",
        a: "test3",
        b: "test4",
      },
    ];

    const subcollectionEntries = [
      { parentPath: "abc/123", d: "test5" },
      { parentPath: "abc/123", d: "test6" },
      { parentPath: "abc/345", d: "test5" },
      { parentPath: "abc/345", d: "test7" },
      { parentPath: "abc/345", d: "test6" },
    ];

    const fieldMapConfig = { a: "a", b2: "b" };

    const result = populateCollectionValues(
      collectionEntries,
      subcollectionEntries,
      fieldMapConfig
    );

    expect(result).toEqual([
      {
        parentPath: "abc/123",
        d: "test5",
        a: "test1",
        b2: "test2",
      },
      {
        parentPath: "abc/123",
        d: "test6",
        a: "test1",
        b2: "test2",
      },
      {
        parentPath: "abc/345",
        d: "test5",
        a: "test3",
        b2: "test4",
      },
      {
        parentPath: "abc/345",
        d: "test7",
        a: "test3",
        b2: "test4",
      },
      {
        parentPath: "abc/345",
        d: "test6",
        a: "test3",
        b2: "test4",
      },
    ]);
  });

  it("filters out subcollection entries that don't match any collection entry", () => {
    const collectionEntries = [
      {
        path: "abc/123",
        a: "test1",
        b: "test2",
      },
    ];

    const subcollectionEntries = [
      { parentPath: "abc/123", d: "test4" },
      { parentPath: "abc/345", d: "test5" },
    ];

    const fieldMapConfig = { a: "a", b2: "b" };

    const result = populateCollectionValues(
      collectionEntries,
      subcollectionEntries,
      fieldMapConfig
    );

    expect(result).toEqual([
      {
        parentPath: "abc/123",
        d: "test4",
        a: "test1",
        b2: "test2",
      },
    ]);
  });
  it("returns an empty array if no matching subcollection entries are found", () => {
    const collectionEntries = [
      {
        path: "abc/123",
        a: "test1",
        b: "test2",
      },
    ];

    const subcollectionEntries = [
      { parentPath: "abc/345", d: "test4" },
      { parentPath: "abc/456", d: "test5" },
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
