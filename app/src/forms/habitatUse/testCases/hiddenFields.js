module.exports = [
  {
    id: "timestamp",
    testCases: [
      { value: new Date("2013-07-23T22:22") },
      { value: "01-01-2013", error: "invalid-date-format" },
    ],
  },
];
