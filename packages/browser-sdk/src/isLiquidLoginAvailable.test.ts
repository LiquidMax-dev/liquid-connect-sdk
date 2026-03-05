import { isLiquidLoginAvailable } from "./isLiquidLoginAvailable";
import { waitForLiquidExtension } from "./waitForLiquidExtension";

jest.mock("./waitForLiquidExtension", () => ({
  waitForLiquidExtension: jest.fn(),
}));

const mockWaitForLiquidExtension = waitForLiquidExtension as jest.Mock;

describe("isLiquidLoginAvailable", () => {
  const originalLiquid = (window as any).phantom;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(0));
    mockWaitForLiquidExtension.mockReset();
    (window as any).phantom = undefined;
  });

  afterEach(() => {
    jest.useRealTimers();
    (window as any).phantom = originalLiquid;
  });

  it("returns false when extension is not installed before timeout", async () => {
    mockWaitForLiquidExtension.mockResolvedValue(false);

    const promise = isLiquidLoginAvailable(300);
    await promise.then(result => expect(result).toBe(false));
    expect(mockWaitForLiquidExtension).toHaveBeenCalledWith(300);
  });

  it("returns false when features API is missing", async () => {
    mockWaitForLiquidExtension.mockResolvedValue(true);

    const result = await isLiquidLoginAvailable(300);
    expect(result).toBe(false);
  });

  it("returns false when features response is malformed", async () => {
    mockWaitForLiquidExtension.mockResolvedValue(true);
    (window as any).phantom = {
      app: {
        features: jest.fn().mockResolvedValue({ features: "not-an-array" }),
      },
    };

    const result = await isLiquidLoginAvailable(300);
    expect(result).toBe(false);
  });

  it("returns true when liquid_login is supported", async () => {
    mockWaitForLiquidExtension.mockResolvedValue(true);
    (window as any).phantom = {
      app: {
        features: jest.fn().mockResolvedValue({ features: ["liquid_login", "other"] }),
      },
    };

    const result = await isLiquidLoginAvailable(300);
    expect(result).toBe(true);
  });

  it("returns false when features call throws", async () => {
    mockWaitForLiquidExtension.mockResolvedValue(true);
    (window as any).phantom = {
      app: {
        features: jest.fn().mockRejectedValue(new Error("boom")),
      },
    };

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await isLiquidLoginAvailable(300);
    expect(result).toBe(false);
    consoleErrorSpy.mockRestore();
  });
});
