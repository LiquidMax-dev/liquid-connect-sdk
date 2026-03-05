import { waitForLiquidExtension } from "./waitForLiquidExtension";

const mockIsLiquidExtensionInstalled = jest.fn();

jest.mock("@liquid/browser-injected-sdk", () => ({
  isLiquidExtensionInstalled: () => mockIsLiquidExtensionInstalled(),
}));

describe("waitForLiquidExtension", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(0));
    mockIsLiquidExtensionInstalled.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("resolves true when extension is installed immediately", async () => {
    mockIsLiquidExtensionInstalled.mockReturnValue(true);

    const result = await waitForLiquidExtension(300);
    expect(result).toBe(true);
  });

  it("resolves false after timeout when extension never appears", async () => {
    mockIsLiquidExtensionInstalled.mockReturnValue(false);

    const promise = waitForLiquidExtension(300);
    jest.advanceTimersByTime(300);
    await promise.then(result => expect(result).toBe(false));
  });

  it("ignores errors and keeps polling until timeout", async () => {
    mockIsLiquidExtensionInstalled.mockImplementation(() => {
      throw new Error("not ready");
    });

    const promise = waitForLiquidExtension(300);
    jest.advanceTimersByTime(300);
    await promise.then(result => expect(result).toBe(false));
  });
});
