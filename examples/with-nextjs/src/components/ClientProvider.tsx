"use client";
import { LiquidProvider, AddressType } from "@liquid/react-sdk";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <LiquidProvider
      config={{
        providers: ["injected"],
        addressTypes: [AddressType.solana],
      }}
    >
      {children}
    </LiquidProvider>
  );
}
