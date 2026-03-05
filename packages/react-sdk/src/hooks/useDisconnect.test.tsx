import { renderHook, act } from "@testing-library/react";
import { useDisconnect } from "./useDisconnect";
import { useLiquid } from "../LiquidContext";

jest.mock("../LiquidContext", () => ({
  useLiquid: jest.fn(),
}));

const mockUseLiquid = useLiquid as jest.Mock;

describe("useDisconnect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws when sdk is not initialized", async () => {
    mockUseLiquid.mockReturnValue({ sdk: null });

    const { result } = renderHook(() => useDisconnect());

    await expect(result.current.disconnect()).rejects.toThrow("SDK not initialized");
  });

  it("calls sdk.disconnect and resets state", async () => {
    const disconnectMock = jest.fn().mockResolvedValue(undefined);
    mockUseLiquid.mockReturnValue({ sdk: { disconnect: disconnectMock } });

    const { result } = renderHook(() => useDisconnect());

    expect(result.current.isDisconnecting).toBe(false);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await result.current.disconnect();
    });

    expect(disconnectMock).toHaveBeenCalledTimes(1);
    expect(result.current.isDisconnecting).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("stores error and rethrows when disconnect fails", async () => {
    const disconnectMock = jest.fn().mockRejectedValue(new Error("disconnect failed"));
    mockUseLiquid.mockReturnValue({ sdk: { disconnect: disconnectMock } });

    const { result } = renderHook(() => useDisconnect());

    await act(async () => {
      await expect(result.current.disconnect()).rejects.toThrow("disconnect failed");
    });

    expect(result.current.isDisconnecting).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("disconnect failed");
  });
});
