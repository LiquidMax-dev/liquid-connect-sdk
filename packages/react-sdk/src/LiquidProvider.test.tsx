import * as React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { LiquidProvider } from "./LiquidProvider";
import { useLiquid } from "./LiquidContext";
import { BrowserSDK, AddressType } from "@liquid/browser-sdk";
import type { BrowserSDKConfig } from "@liquid/browser-sdk";

const createMockSdk = () => ({
  autoConnect: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  off: jest.fn(),
  configureDebug: jest.fn(),
  getAddresses: jest.fn().mockResolvedValue([]),
  disconnect: jest.fn().mockResolvedValue(undefined),
});

// Mock BrowserSDK
jest.mock("@liquid/browser-sdk", () => ({
  AddressType: {
    solana: "solana",
    ethereum: "ethereum",
  },
  BrowserSDK: jest.fn().mockImplementation(() => createMockSdk()),
  isMobileDevice: jest.fn().mockReturnValue(false),
}));

describe("LiquidProvider", () => {
  const mockConfig: BrowserSDKConfig = {
    appId: "test-app-id",
    providers: ["google", "apple"],
    embeddedWalletType: "user-wallet",
    addressTypes: [AddressType.solana],
    apiBaseUrl: "https://api.test.com",
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LiquidProvider config={mockConfig}>{children}</LiquidProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("isLoading state", () => {
    it("should start with isLoading as true", () => {
      const { result } = renderHook(() => useLiquid(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it("should set isLoading to false after initialization completes", async () => {
      const { result } = renderHook(() => useLiquid(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should set isLoading to false even if autoConnect fails", async () => {
      // Mock autoConnect to reject
      const mockAutoConnect = jest.fn().mockRejectedValue(new Error("AutoConnect failed"));
      (BrowserSDK as unknown as jest.Mock).mockImplementation(() => ({
        autoConnect: mockAutoConnect,
        on: jest.fn(),
        off: jest.fn(),
        configureDebug: jest.fn(),
      }));

      const { result } = renderHook(() => useLiquid(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockAutoConnect).toHaveBeenCalled();
    });

    it("should have SDK ready when isLoading is false", async () => {
      const { result } = renderHook(() => useLiquid(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sdk).not.toBeNull();
      expect(result.current.isClient).toBe(true);
    });
  });

  describe("SDK initialization", () => {
    it("should create SDK instance on client", async () => {
      const { result } = renderHook(() => useLiquid(), { wrapper });

      await waitFor(() => {
        expect(result.current.sdk).not.toBeNull();
      });

      expect(BrowserSDK).toHaveBeenCalledWith(mockConfig);
    });

    it("should call autoConnect during initialization", async () => {
      const mockAutoConnect = jest.fn().mockResolvedValue(undefined);
      (BrowserSDK as unknown as jest.Mock).mockImplementation(() => ({
        autoConnect: mockAutoConnect,
        on: jest.fn(),
        off: jest.fn(),
        configureDebug: jest.fn(),
      }));

      renderHook(() => useLiquid(), { wrapper });

      await waitFor(() => {
        expect(mockAutoConnect).toHaveBeenCalled();
      });
    });
  });

  describe("event handling", () => {
    it("should normalize undefined connect payload to a safe user object", async () => {
      const sdkMock = createMockSdk();
      const registeredHandlers = new Map<string, (...args: any[]) => void | Promise<void>>();
      sdkMock.on.mockImplementation((event: string, handler: (...args: any[]) => void | Promise<void>) => {
        registeredHandlers.set(event, handler);
      });
      (BrowserSDK as unknown as jest.Mock).mockImplementation(() => sdkMock);

      const { result } = renderHook(() => useLiquid(), { wrapper });

      await waitFor(() => {
        expect(result.current.sdk).not.toBeNull();
      });

      const connectHandler = registeredHandlers.get("connect");
      expect(typeof connectHandler).toBe("function");

      await connectHandler?.(undefined);

      await waitFor(() => {
        expect(result.current.user).toEqual({ addresses: [] });
      });
    });
  });
});
