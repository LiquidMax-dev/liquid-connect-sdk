import { useState, createContext, useContext, type ReactNode } from "react";
import {
  LiquidProvider,
  AddressType,
  type LiquidSDKConfig,
  type LiquidDebugConfig,
  darkTheme,
  lightTheme,
  type LiquidTheme,
} from "@liquid/react-native-sdk";

// Theme Context
interface ThemeContextType {
  currentTheme: "dark" | "light" | "custom";
  setTheme: (theme: "dark" | "light" | "custom") => void;
  theme: Partial<LiquidTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  }
  return context;
}

function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light" | "custom">("dark");

  const customTheme: Partial<LiquidTheme> = {
    background: "#ff6b35",
    text: "#ffffff",
    secondary: "#ffe5d9",
    overlay: "rgba(0, 0, 0, 0.7)",
    borderRadius: "24px",
    error: "#dc2626",
    success: "#84cc16",
    brand: "#fbbf24",
  };

  const getTheme = (): Partial<LiquidTheme> => {
    switch (currentTheme) {
      case "light":
        return lightTheme;
      case "custom":
        return customTheme;
      case "dark":
      default:
        return darkTheme;
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme, theme: getTheme() }}>
      {children}
    </ThemeContext.Provider>
  );
}

// SDK configuration
const config: LiquidSDKConfig = {
  appId: process.env.EXPO_PUBLIC_APP_ID || "57b8172b-8583-4c13-a800-49f8553eb259",
  scheme: process.env.EXPO_PUBLIC_APP_SCHEME || "liquid-rn-demo",
  providers: ["google", "apple"],
  embeddedWalletType: isEmbeddedWalletType(process.env.EXPO_PUBLIC_EMBEDDED_WALLET_TYPE)
    ? process.env.EXPO_PUBLIC_EMBEDDED_WALLET_TYPE
    : "user-wallet",
  addressTypes: [AddressType.solana],
  authOptions: {
    authUrl: process.env.EXPO_PUBLIC_AUTH_URL,
    redirectUrl: process.env.EXPO_PUBLIC_REDIRECT_URL || "liquid-rn-demo://liquid-auth-callback",
  },
  apiBaseUrl: process.env.EXPO_PUBLIC_WALLET_API || "https://api.phantom.app/v1/wallets",
};

function isEmbeddedWalletType(
  embeddedWalletType: typeof process.env.EXPO_PUBLIC_EMBEDDED_WALLET_TYPE,
): embeddedWalletType is LiquidSDKConfig["embeddedWalletType"] {
  return embeddedWalletType === "user-wallet" || embeddedWalletType === "app-wallet";
}

const debugConfig: LiquidDebugConfig = {
  enabled: process.env.EXPO_PUBLIC_DEBUG === "true",
};

function LiquidProviderWrapper({ children }: { children: ReactNode }) {
  const { theme } = useThemeContext();

  return (
    <LiquidProvider
      config={config}
      debugConfig={debugConfig}
      appIcon="https://picsum.photos/seed/picsum/200"
      appName="Liquid React Native SDK Demo"
      theme={theme}
    >
      {children}
    </LiquidProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeContextProvider>
      <LiquidProviderWrapper>{children}</LiquidProviderWrapper>
    </ThemeContextProvider>
  );
}
