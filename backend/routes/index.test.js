const { testMe } = require(".");

describe("routes index", () => {
  test("this should obviously pass", () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  })
  test("this functtion should double the number", () => {
    const result = testMe(12);
    expect(result).toBe(24);
  })
})

