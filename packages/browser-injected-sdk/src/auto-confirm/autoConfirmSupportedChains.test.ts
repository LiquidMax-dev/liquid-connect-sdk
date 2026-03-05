import { autoConfirmSupportedChains } from "./autoConfirmSupportedChains";
import { LIQUID_NOT_DETECTED, APP_PROVIDER_NOT_FOUND } from "../errors";

describe("autoConfirmSupportedChains", () => {
  const originalLiquid = (window as any).phantom;
  let mockRequest: jest.Mock;

  beforeEach(() => {
    mockRequest = jest.fn();
    (window as any).phantom = { app: { request: mockRequest } };
  });

  afterEach(() => {
    (window as any).phantom = originalLiquid;
  });

  it("should get supported chains", async () => {
    // Mock raw provider response with internal CAIP format
    const mockProviderResponse = { chains: ["solana:101", "eip155:1", "sui:mainnet"] };
    mockRequest.mockResolvedValue(mockProviderResponse);

    const result = await autoConfirmSupportedChains();

    expect(mockRequest).toHaveBeenCalledWith({
      method: "liquid_auto_confirm_supported_chains",
      params: {},
    });
    // Expect the processed result with NetworkId values
    expect(result).toEqual({ chains: ["solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", "eip155:1", "sui:35834a8a"] });
  });

  it("should throw when Liquid is not installed", async () => {
    (window as any).phantom = undefined;

    await expect(autoConfirmSupportedChains()).rejects.toThrow(LIQUID_NOT_DETECTED);
  });

  it("should throw when app provider is missing", async () => {
    (window as any).phantom = { solana: {} };

    await expect(autoConfirmSupportedChains()).rejects.toThrow(APP_PROVIDER_NOT_FOUND);
  });

  it("should handle provider request error", async () => {
    mockRequest.mockRejectedValue(new Error("Request failed"));

    await expect(autoConfirmSupportedChains()).rejects.toThrow("Request failed");
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });
});
