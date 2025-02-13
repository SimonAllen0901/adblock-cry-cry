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

  test("Should execute init and call the callback", (done) => {
    detector.init(() => {
      // 若這段能成功執行代表 init 有成功執行 callback
      expect(true).toBe(true);
      done();
    });
  });

  test("Should execute detect and return a boolean", async () => {
    detector.init(async () => {
      const isBlocked = await detector.detect();
      expect(typeof isBlocked).toBe("boolean");
    });
  });

  test("Should insert ad elements into document.body", () => {
    detector.init();
    const adElements = document.body.querySelectorAll("div");
    expect(adElements.length).toBeGreaterThan(0);
  });
});
