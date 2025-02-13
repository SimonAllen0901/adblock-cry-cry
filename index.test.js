import AdBlockCryCry from "./index";

describe("AdBlockCryCry", () => {
  let detector;

  beforeEach(() => {
    detector = new AdBlockCryCry();
    document.body.innerHTML = "";
  });

  test("Should properly initialize AdBlockCryCry", () => {
    expect(detector).toBeInstanceOf(AdBlockCryCry);
    expect(detector.elementIds).toContain("AdHeader");
  });
});
