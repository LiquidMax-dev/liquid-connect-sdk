import { useMemo, type CSSProperties } from "react";
import { useTheme } from "@liquid/wallet-sdk-ui";
import { useLiquid } from "../LiquidContext";
import { ConnectModalContent } from "./ConnectModalContent";
import { ConnectedModalContent } from "./ConnectedModalContent";

export interface ConnectBoxProps {
  maxWidth?: string | number;
  transparent?: boolean;
  appIcon?: string;
  appName?: string;
}

export function ConnectBox({ maxWidth = "350px", transparent = false, appIcon, appName }: ConnectBoxProps) {
  const theme = useTheme();
  const { isConnected } = useLiquid();

  const boxStyle: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: "100%",
      maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      position: "relative" as const,
      overflow: "hidden" as const,
    };

    if (!transparent) {
      style.backgroundColor = theme.background;
      style.borderRadius = theme.borderRadius;
    }

    return style;
  }, [maxWidth, transparent, theme.background, theme.borderRadius]);

  const noOp = () => {
    // No-op function for onClose when embedded
  };

  return (
    <div style={boxStyle}>
      {isConnected ? (
        <ConnectedModalContent onClose={noOp} hideCloseButton={true} />
      ) : (
        <ConnectModalContent appIcon={appIcon} appName={appName} onClose={noOp} hideCloseButton={true} />
      )}
    </div>
  );
}
