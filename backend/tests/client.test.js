import { loadCSV } from "../client.js";

/**
 * Test normal cases when loading a file, which would be
 * in a normal environment something like getting from db
 */
describe("client", () => {
  // beforeEach(() => {
  //   jest.clearAllMocks(); // Clear all mocks at the start of the test
  // });

  it("should fail gracefully if it cannot read the file", async () => {
    const result = await loadCSV("fakename", "fakePath");

    expect(result).toEqual([]);
  });

  it("should return the content of the csv file", async () => {
    const result = await loadCSV("providers.csv", "providers");

    expect(result).not.toEqual([]);
    expect(result.length).toBe(13);
  });
});
