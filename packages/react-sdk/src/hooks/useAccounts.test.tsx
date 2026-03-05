import { renderHook } from "@testing-library/react";
import { useAccounts } from "./useAccounts";
import { useLiquid } from "../LiquidContext";

jest.mock("../LiquidContext", () => ({
  useLiquid: jest.fn(),
}));

const mockUseLiquid = useLiquid as jest.Mock;

describe("useAccounts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when not connected", () => {
    mockUseLiquid.mockReturnValue({
      isConnected: false,
      addresses: ["addr1"],
    });

    const { result } = renderHook(() => useAccounts());
    expect(result.current).toBe(null);
  });

  it("returns addresses when connected", () => {
    const addresses = ["addr1", "addr2"];
    mockUseLiquid.mockReturnValue({
      isConnected: true,
      addresses,
    });

    const { result } = renderHook(() => useAccounts());
    expect(result.current).toEqual(addresses);
  });
});
