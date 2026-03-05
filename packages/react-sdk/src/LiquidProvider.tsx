import type { ReactNode } from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { BrowserSDK } from "@liquid/browser-sdk";
import type {
  BrowserSDKConfig,
  AuthOptions,
  DebugConfig,
  ConnectEventData,
  WalletAddress,
  ConnectResult,
} from "@liquid/browser-sdk";
import { mergeTheme, darkTheme, ThemeProvider, type LiquidTheme } from "@liquid/wallet-sdk-ui";
import { LiquidContext, type LiquidContextValue, type LiquidErrors } from "./LiquidContext";
import { ModalProvider } from "./ModalProvider";

export type LiquidSDKConfig = BrowserSDKConfig;

export interface LiquidDebugConfig extends DebugConfig {}

export interface ConnectOptions {
  embeddedWalletType?: "app-wallet" | "user-wallet";
  authOptions?: AuthOptions;
}

export interface LiquidProviderProps {
  children: ReactNode;
  config: LiquidSDKConfig;
  debugConfig?: LiquidDebugConfig;
  theme?: Partial<LiquidTheme>;
  appIcon?: string;
  appName?: string;
}

export function LiquidProvider({ children, config, debugConfig, theme, appIcon, appName }: LiquidProviderProps) {
  // Memoized config to avoid unnecessary SDK recreation
  const memoizedConfig: BrowserSDKConfig = useMemo(() => config, [config]);

  // Memoized theme - defaults to darkTheme if not provided
  const resolvedTheme = useMemo(() => mergeTheme(theme || darkTheme), [theme]);

  const [sdk, setSdk] = useState<BrowserSDK | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<LiquidErrors>({});
  const [addresses, setAddresses] = useState<WalletAddress[]>([]);
  const [user, setUser] = useState<ConnectResult | null>(null);

  // Initialize client flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create SDK only on client side
  useEffect(() => {
    if (!isClient) return;

    const sdkInstance = new BrowserSDK(memoizedConfig);
    setSdk(sdkInstance);

    // No cleanup - let the SDK persist across page navigations
    // The SDK manages its own state and should only disconnect when explicitly called
  }, [isClient, memoizedConfig]);

  // Event listener management - only when SDK exists
  useEffect(() => {
    if (!sdk) return;
    // Event handlers that need to be referenced for cleanup
    const handleConnectStart = () => {
      setIsConnecting(true);
      setErrors((prev: LiquidErrors) => ({ ...prev, connect: undefined }));
    };

    const handleConnect = async (data?: ConnectEventData) => {
      try {
        setIsConnected(true);
        setIsConnecting(false);

        const addrs = await sdk.getAddresses();
        setAddresses(addrs);

        // Some injected wallet flows can dispatch connect without a full payload.
        // Normalize to a minimal object so consumers never receive `undefined`.
        const normalizedUser = (data ?? { addresses: addrs }) as ConnectResult;
        setUser(normalizedUser);
      } catch (err) {
        console.error("Error connecting:", err);

        // Call disconnect to reset state if an error occurs
        try {
          await sdk.disconnect();
        } catch (err) {
          console.error("Error disconnecting:", err);
        }
      }
    };

    const handleConnectError = (errorData: any) => {
      setIsConnecting(false);
      setIsConnected(false);

      // Don't treat "No valid session found" or "No trusted connections available" from auto-connect as errors
      // These are expected states when no session exists, not actual errors
      const isAutoConnectNoSession =
        errorData?.source === "auto-connect" &&
        (errorData?.error === "No valid session found" || errorData?.error === "No trusted connections available");

      if (isAutoConnectNoSession) {
        // Clear any previous error state, but don't set a new error for this expected case
        setErrors((prev: LiquidErrors) => ({ ...prev, connect: undefined }));
      } else {
        setErrors((prev: LiquidErrors) => ({
          ...prev,
          connect: new Error(errorData?.error || "Connection failed"),
        }));
      }

      setAddresses([]);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsConnecting(false);
      setErrors({});
      setAddresses([]);
      setUser(null);
    };

    const handleSpendingLimitReached = () => {
      setErrors((prev: LiquidErrors) => ({ ...prev, spendingLimit: true }));
    };

    // Add event listeners to SDK
    sdk.on("connect_start", handleConnectStart);
    sdk.on("connect", handleConnect);
    sdk.on("connect_error", handleConnectError);
    sdk.on("disconnect", handleDisconnect);
    sdk.on("spending_limit_reached", handleSpendingLimitReached);

    // Cleanup function to remove event listeners when SDK changes or component unmounts
    return () => {
      sdk.off("connect_start", handleConnectStart);
      sdk.off("connect", handleConnect);
      sdk.off("connect_error", handleConnectError);
      sdk.off("disconnect", handleDisconnect);
      sdk.off("spending_limit_reached", handleSpendingLimitReached);
    };
  }, [sdk]);

  // Handle debug configuration changes separately to avoid SDK reinstantiation
  useEffect(() => {
    if (!debugConfig || !sdk) return;

    sdk.configureDebug(debugConfig);
  }, [sdk, debugConfig]);

  // Initialize connection state and auto-connect - only on client side
  useEffect(() => {
    // Skip initialization if not on client or SDK not ready
    if (!isClient || !sdk) return;

    const initialize = async () => {
      try {
        await sdk.autoConnect();
      } catch (error) {
        // Silent fail - auto-connect shouldn't break the app
        console.error("Auto-connect error:", error);
      }

      // Mark SDK as done loading after initialization complete
      setIsLoading(false);
    };

    initialize();
  }, [sdk, isClient]);

  const clearError = useCallback((key: keyof LiquidErrors) => {
    setErrors((prev: LiquidErrors) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value: LiquidContextValue = useMemo(
    () => ({
      sdk,
      isConnected,
      isConnecting,
      isLoading,
      errors,
      addresses,
      isClient,
      user,
      theme: resolvedTheme,
      allowedProviders: memoizedConfig.providers,
      clearError,
    }),
    [
      sdk,
      isConnected,
      isConnecting,
      isLoading,
      errors,
      addresses,
      isClient,
      user,
      resolvedTheme,
      memoizedConfig.providers,
      clearError,
    ],
  );

  return (
    <ThemeProvider theme={resolvedTheme}>
      <LiquidContext.Provider value={value}>
        <ModalProvider appIcon={appIcon} appName={appName}>
          {children}
        </ModalProvider>
      </LiquidContext.Provider>
    </ThemeProvider>
  );
}
