import { renderHook, act } from "@testing-library/react";
import { useIsExtensionInstalled } from "./useIsExtensionInstalled";
import { waitForLiquidExtension } from "@liquid/browser-sdk";

jest.mock("@liquid/browser-sdk", () => ({
  waitForLiquidExtension: jest.fn(),
}));

const mockWaitForLiquidExtension = waitForLiquidExtension as jest.Mock;

describe("useIsExtensionInstalled", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets installed state when extension is available", async () => {
    mockWaitForLiquidExtension.mockResolvedValue(true);

    const { result } = renderHook(() => useIsExtensionInstalled());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isInstalled).toBe(false);

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockWaitForLiquidExtension).toHaveBeenCalledWith(3000);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInstalled).toBe(true);
  });

  it("sets installed false when extension is unavailable", async () => {
    mockWaitForLiquidExtension.mockResolvedValue(false);

    const { result } = renderHook(() => useIsExtensionInstalled());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInstalled).toBe(false);
  });

  it("handles errors by setting installed false", async () => {
    mockWaitForLiquidExtension.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useIsExtensionInstalled());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInstalled).toBe(false);
  });
});
