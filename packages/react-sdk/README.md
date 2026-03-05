# @liquid/react-sdk

React hooks for integrating Liquid wallet functionality into React applications with chain-specific operations.

## Installation

```bash
npm install @liquid/react-sdk
```

## Dependencies

Install additional dependencies based on the networks you want to support:

| Network Support | Required Dependencies              |
| --------------- | ---------------------------------- |
| Solana          | `@solana/web3.js` OR `@solana/kit` |
| Ethereum/EVM    | `viem`                             |

**Example for Solana + Ethereum support (using @solana/web3.js):**

```bash
npm install @liquid/react-sdk @solana/web3.js viem
```

**Example for Solana + Ethereum support (using @solana/kit):**

```bash
npm install @liquid/react-sdk @solana/kit viem
```

## Quick Start

### Basic Setup with Chain-Specific Operations

```tsx
import { LiquidProvider, useConnect, useSolana, useEthereum } from "@liquid/react-sdk";
import { AddressType } from "@liquid/browser-sdk";

function App() {
  return (
    <LiquidProvider
      config={{
        providers: ["injected"], // Only allow Liquid browser extension
        addressTypes: [AddressType.solana, AddressType.ethereum],
      }}
    >
      <WalletComponent />
    </LiquidProvider>
  );
}

function WalletComponent() {
  const { connect, isConnecting } = useConnect();
  const { solana } = useSolana();
  const { ethereum } = useEthereum();

  const handleConnect = async () => {
    const { addresses } = await connect({ provider: "injected" });
    console.log("Connected addresses:", addresses);
  };

  const signSolanaMessage = async () => {
    const signature = await solana.signMessage("Hello Solana!");
    console.log("Solana signature:", signature);
  };

  const signEthereumMessage = async () => {
    const accounts = await ethereum.getAccounts();
    const signature = await ethereum.signPersonalMessage("Hello Ethereum!", accounts[0]);
    console.log("Ethereum signature:", signature);
  };

  return (
    <div>
      <button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
      <button onClick={signSolanaMessage}>Sign Solana Message</button>
      <button onClick={signEthereumMessage}>Sign Ethereum Message</button>
    </div>
  );
}
```

### Multiple Authentication Methods

```tsx
import { LiquidProvider } from "@liquid/react-sdk";
import { AddressType } from "@liquid/browser-sdk";

function App() {
  return (
    <LiquidProvider
      config={{
        providers: ["google", "apple", "liquid", "injected"], // Allow all auth methods
        appId: "your-app-id", // Get your app ID from phantom.com/portal (required for embedded providers)
        addressTypes: [AddressType.solana, AddressType.ethereum],
      }}
    >
      <YourApp />
    </LiquidProvider>
  );
}
```

## Connection Modal

The SDK includes a built-in connection modal UI that provides a user-friendly interface for connecting to Liquid. The modal supports multiple connection methods (Google, Apple, Liquid Login, browser extension) and handles all connection logic automatically.

### Using the Modal

To use the modal, pass a `theme` prop to `LiquidProvider` and use the `useModal()` hook to control visibility:

```tsx
import { LiquidProvider, useModal, darkTheme, useLiquid } from "@liquid/react-sdk";
import { AddressType } from "@liquid/browser-sdk";

function App() {
  return (
    <LiquidProvider
      config={{
        providers: ["google", "apple", "liquid", "injected"],
        appId: "your-app-id",
        addressTypes: [AddressType.solana, AddressType.ethereum],
      }}
      theme={darkTheme}
      appIcon="https://your-app.com/icon.png"
      appName="Your App Name"
    >
      <WalletComponent />
    </LiquidProvider>
  );
}

function WalletComponent() {
  const { open, close, isOpened } = useModal();
  const { isConnected, user } = useLiquid();

  if (isConnected) {
    return (
      <div>
        <p>Connected as {user?.email || "Unknown"}</p>
      </div>
    );
  }

  return <button onClick={open}>Connect Wallet</button>;
}
```

**Modal Features:**

- **Multiple Auth Providers**: Google, Apple, Liquid Login, browser extension
- **Automatic Provider Detection**: Shows browser extension option when Liquid is installed
- **Mobile Support**: Displays deeplink option for Liquid mobile app on mobile devices
- **Error Handling**: Clear error messages displayed in the modal
- **Loading States**: Visual feedback during connection attempts
- **Responsive Design**: Optimized for both mobile and desktop

### useModal Hook

Control the connection modal visibility:

```tsx
import { useModal } from "@liquid/react-sdk";

function ConnectButton() {
  const { open, close, isOpened } = useModal();

  return (
    <div>
      <button onClick={open}>Open Modal</button>
      <button onClick={close}>Close Modal</button>
      <p>Modal is {isOpened ? "open" : "closed"}</p>
    </div>
  );
}
```

**Returns:**

- `open()` - Function to open the modal
- `close()` - Function to close the modal
- `isOpened` - Boolean indicating if modal is currently visible

### ConnectButton Component

A ready-to-use button component that handles the complete connection flow. When disconnected, it shows a "Connect Wallet" button that opens the connection modal. When connected, it displays the truncated wallet address and opens the wallet management modal on click.

```tsx
import { ConnectButton, AddressType } from "@liquid/react-sdk";

function Header() {
  return (
    <div>
      {/* Default: Shows first available address */}
      <ConnectButton />

      {/* Show specific address type */}
      <ConnectButton addressType={AddressType.solana} />
      <ConnectButton addressType={AddressType.ethereum} />

      {/* Full width button */}
      <ConnectButton fullWidth />
    </div>
  );
}
```

**Props:**

- `addressType?: AddressType` - Specify which address type to display when connected (e.g., `AddressType.solana`, `AddressType.ethereum`). If not specified, shows the first available address.
- `fullWidth?: boolean` - Whether the button should take full width of its container. Default: `false`

**Features:**

- **When disconnected**: Opens connection modal with auth provider options (Google, Apple, Liquid Login, browser extension)
- **When connected**: Displays truncated address (e.g., "5Gv8r2...k3Hn") and opens wallet management modal on click
- **Wallet modal**: Shows all connected addresses and provides a disconnect button
- Uses theme styling for consistent appearance
- Fully clickable in both states

### ConnectBox Component

An inline embedded component that displays the connection UI directly in your page layout (without a modal backdrop). Perfect for auth callback pages or when you want a more integrated connection experience. The component automatically handles all connection states including loading, error, and success during the auth callback flow.

```tsx
import { ConnectBox } from "@liquid/react-sdk";

function AuthCallbackPage() {
  return (
    <div>
      <h1>Connecting to Liquid...</h1>
      <ConnectBox />
    </div>
  );
}
```

**Props:**

- `maxWidth?: string | number` - Maximum width of the box. Can be a string (e.g., `"500px"`) or number (e.g., `500`). Default: `"350px"`
- `transparent?: boolean` - When `true`, removes background, border, and shadow for a transparent appearance. Default: `false`
- `appIcon?: string` - URL to your app icon (optional, can also be set via `LiquidProvider`)
- `appName?: string` - Your app name (optional, can also be set via `LiquidProvider`)

**Usage Examples:**

```tsx
import { ConnectBox } from "@liquid/react-sdk";

// Default usage
<ConnectBox />

// Custom width
<ConnectBox maxWidth="500px" />

// Transparent (no background/border)
<ConnectBox transparent />

// Custom width with transparent
<ConnectBox maxWidth={600} transparent />
```

**Features:**

- **Inline embedded**: Renders directly in page flow (not as a floating modal)
- **Auto state management**: Automatically shows connection/login UI when disconnected, wallet info when connected
- **Auth callback support**: Handles loading and error states during OAuth callback flows
- **No close button**: Designed for embedded use cases where users shouldn't dismiss the UI
- **Theme-aware**: Uses your configured theme for consistent styling
- **Responsive**: Adapts to mobile and desktop layouts

**Use Cases:**

- Auth callback pages (e.g., `/auth/callback`) where users return from OAuth providers
- Embedded wallet connection flows in your app's layout
- Custom connection pages where you want full control over the page design

### Handling Auth Callback Pages

When using embedded authentication providers (Google, Apple, Liquid Login, etc.), users are redirected to your app's callback URL after authentication. The SDK automatically handles the callback and completes the connection. Here's how to build a callback page if you're not using `ConnectBox`:

**Basic Auth Callback Page:**

```tsx
import { useLiquid, useConnect, useAccounts } from "@liquid/react-sdk";
import { useNavigate } from "react-router-dom"; // or your router

function AuthCallbackPage() {
  const navigate = useNavigate();
  const { isConnected } = useLiquid();
  const { isConnecting, error: connectError } = useConnect();
  const addresses = useAccounts();

  const handleGoHome = () => {
    navigate("/");
  };

  // Loading state - SDK is processing the callback
  if (isConnecting) {
    return (
      <div>
        <h1>Connecting to wallet...</h1>
        <p>Please wait while we complete your authentication.</p>
      </div>
    );
  }

  // Success state - connection completed
  if (isConnected && addresses && addresses.length > 0) {
    return (
      <div>
        <h1>Authentication Successful</h1>
        <p>You are now connected to your wallet.</p>
        <div>
          <h2>Addresses:</h2>
          {addresses.map((addr, index) => (
            <div key={index}>
              <strong>{addr.addressType}:</strong> {addr.address}
            </div>
          ))}
        </div>
        <button onClick={handleGoHome}>Go to Main App</button>
      </div>
    );
  }

  // Error state - connection failed
  if (connectError) {
    return (
      <div>
        <h1>Authentication Failed</h1>
        <p>{connectError.message || "An unknown error occurred during authentication."}</p>
        <div>
          <button onClick={handleGoHome}>Go to Main App</button>
        </div>
      </div>
    );
  }

  // Default state (shouldn't normally reach here)
  return (
    <div>
      <h1>Processing authentication...</h1>
    </div>
  );
}
```

**Key Points:**

- The SDK's `autoConnect()` automatically processes the callback URL parameters when the page loads
- Use `useConnect()` to access `isConnecting` and `error` states during the callback flow
- Use `useLiquid()` to check `isConnected` status
- Use `useAccounts()` to get connected wallet addresses
- The connection state will automatically update as the SDK processes the callback
- You can monitor `connectError` to handle authentication failures

**Router Setup:**

Make sure your callback route is configured in your router:

```tsx
import { Routes, Route } from "react-router-dom";
import { LiquidProvider } from "@liquid/react-sdk";

function App() {
  return (
    <LiquidProvider config={config} theme={darkTheme}>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/" element={<MainApp />} />
      </Routes>
    </LiquidProvider>
  );
}
```

**Note:** For a simpler implementation, consider using the `ConnectBox` component which handles all these states automatically.

## Theming

Customize the modal appearance by passing a theme object to the `LiquidProvider`. The SDK includes two built-in themes: `darkTheme` (default) and `lightTheme`.

### Using Built-in Themes

```tsx
import { LiquidProvider, darkTheme, lightTheme } from "@liquid/react-sdk";

// Use dark theme (default)
<LiquidProvider config={config} theme={darkTheme}>
  <App />
</LiquidProvider>

// Use light theme
<LiquidProvider config={config} theme={lightTheme}>
  <App />
</LiquidProvider>
```

### Custom Theme

You can pass a partial theme object to customize specific properties:

```tsx
import { LiquidProvider } from "@liquid/react-sdk";

const customTheme = {
  background: "#1a1a1a",
  text: "#ffffff",
  secondary: "#98979C",
  brand: "#ab9ff2",
  error: "#ff4444",
  success: "#00ff00",
  borderRadius: "16px",
  overlay: "rgba(0, 0, 0, 0.8)",
};

<LiquidProvider config={config} theme={customTheme} appIcon="https://your-app.com/icon.png" appName="Your App">
  <App />
</LiquidProvider>;
```

### Theme Properties

| Property       | Type     | Description                                               |
| -------------- | -------- | --------------------------------------------------------- |
| `background`   | `string` | Background color for modal                                |
| `text`         | `string` | Primary text color                                        |
| `secondary`    | `string` | Secondary color for text, borders, dividers (must be hex) |
| `brand`        | `string` | Brand/primary action color                                |
| `error`        | `string` | Error state color                                         |
| `success`      | `string` | Success state color                                       |
| `borderRadius` | `string` | Border radius for buttons and modal                       |
| `overlay`      | `string` | Overlay background color (with opacity)                   |

**Note:** The `secondary` color must be a hex color value (e.g., `#98979C`) as it's used to derive auxiliary colors with opacity.

### Accessing Theme in Custom Components

If you need to access the current theme in your own components, use the `useTheme()` hook:

```tsx
import { useTheme } from "@liquid/react-sdk";

function CustomComponent() {
  const theme = useTheme();

  return <div style={{ backgroundColor: theme.background, color: theme.text }}>Themed content</div>;
}
```

## Connection Flow

The React SDK follows a clear connection pattern:

1. **Provider Setup**: Wrap your app with `LiquidProvider`
2. **Connection**: Use `useConnect()` to establish wallet connection
3. **Chain Operations**: Use chain-specific hooks (`useSolana()`, `useEthereum()`) for transactions and signing

```tsx
function WalletExample() {
  const { connect } = useConnect();
  const { solana } = useSolana();
  const { ethereum } = useEthereum();

  // 1. Connect first (provider parameter is required)
  const handleConnect = async () => {
    await connect({ provider: "injected" });
  };

  // 2. Then use chain-specific operations
  const sendSolanaTransaction = async () => {
    const result = await solana.signAndSendTransaction(transaction);
  };

  const sendEthereumTransaction = async () => {
    const result = await ethereum.sendTransaction(transaction);
  };
}
```

### Connection Options

The `connect()` method requires a `provider` parameter and automatically switches between providers based on the authentication method you specify:

```tsx
const { connect } = useConnect();

// Connect with injected provider (Liquid extension)
// Automatically switches to injected provider if not already using it
await connect({
  provider: "injected",
});

// Connect with Google authentication (embedded provider)
// Automatically switches to embedded provider if not already using it
await connect({
  provider: "google",
});

// Connect with Apple authentication (embedded provider)
// Automatically switches to embedded provider if not already using it
await connect({
  provider: "apple",
});

// Connect with Liquid authentication (embedded provider)
// Uses Liquid extension or mobile app for authentication
// Automatically switches to embedded provider if not already using it
await connect({
  provider: "liquid",
});

// Connect with JWT authentication (embedded provider)
await connect({
  provider: "jwt",
  jwtToken: "your-jwt-token",
});
```

## SDK Initialization

The SDK provides an `isLoading` state to track when initialization and autoconnect are in progress. This is useful for showing loading states before your app is ready.

```tsx
import { useConnect, useLiquid } from "@liquid/react-sdk";

function App() {
  const { isLoading } = useLiquid();
  const { connect } = useConnect();

  // Show loading state while SDK initializes
  if (isLoading) {
    return (
      <div>
        <h1>Initializing Liquid SDK...</h1>
        <p>Please wait...</p>
      </div>
    );
  }

  // SDK is ready
  return (
    <div>
      <h1>Welcome!</h1>
      <button onClick={() => connect({ provider: "injected" })}>Connect Wallet</button>
    </div>
  );
}
```

## Authentication Providers

The SDK supports multiple authentication providers that you configure via the `providers` array:

### Available Providers

- **`"injected"`** - Liquid browser extension
- **`"google"`** - Google OAuth
- **`"apple"`** - Apple ID
- **`"liquid"`** - Liquid Login
- **`"deeplink"`** - Deeplink to Liquid mobile app (only renders on mobile devices)

### Configuration Examples

**Browser Extension Only**

```tsx
<LiquidProvider
  config={{
    providers: ["injected"], // Only allow browser extension
    addressTypes: [AddressType.solana, AddressType.ethereum],
  }}
>
  <YourApp />
</LiquidProvider>
```

**Multiple Authentication Methods**

```tsx
<LiquidProvider
  config={{
    providers: ["google", "apple", "liquid", "injected", "deeplink"], // Allow all methods
    appId: "your-app-id", // Required for embedded providers
    addressTypes: [AddressType.solana, AddressType.ethereum],
  }}
>
  <YourApp />
</LiquidProvider>
```

**Mobile Deeplink Support**

The `"deeplink"` provider enables a button that opens the Liquid mobile app on mobile devices. This button only appears on mobile devices when the Liquid browser extension is not installed. When clicked, it redirects users to the Liquid mobile app to complete authentication.

```tsx
<LiquidProvider
  config={{
    providers: ["google", "apple", "liquid", "deeplink"], // Include deeplink for mobile support
    appId: "your-app-id", // Required for deeplink
    addressTypes: [AddressType.solana, AddressType.ethereum],
  }}
>
  <YourApp />
</LiquidProvider>
```

### Embedded Wallet Type

When using embedded providers (google, apple, liquid, etc.), you can specify the wallet type using `embeddedWalletType`. The default is `"user-wallet"`:

- **Uses Liquid authentication** - user logs in with existing account
- **Potentially funded** - brings existing wallet balance
- **Connected** to user's Liquid ecosystem

```tsx
<LiquidProvider
  config={{
    providers: ["google", "apple", "liquid"],
    appId: "your-app-id",
    addressTypes: [AddressType.solana, AddressType.ethereum],
    embeddedWalletType: "user-wallet", // default, can be omitted
  }}
>
  <YourApp />
</LiquidProvider>
```

## Available Hooks

### Core Connection Hooks

#### useConnect

Connect to wallet:

```tsx
import { useConnect } from "@liquid/react-sdk";

function ConnectButton() {
  const { connect, isConnecting, isLoading, error } = useConnect();

  const handleConnect = async () => {
    try {
      const { addresses } = await connect({ provider: "injected" });
      console.log("Connected addresses:", addresses);
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  // Wait for SDK to finish initializing before showing connect button
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
```

#### useAccounts

Get connected wallet addresses:

```tsx
import { useAccounts } from "@liquid/react-sdk";

function WalletAddresses() {
  const addresses = useAccounts();

  if (!addresses) {
    return <div>Not connected</div>;
  }

  return (
    <div>
      {addresses.map((addr, index) => (
        <div key={index}>
          <strong>{addr.addressType}:</strong> {addr.address}
        </div>
      ))}
    </div>
  );
}
```

#### useDisconnect

Disconnect from wallet:

```tsx
import { useDisconnect } from "@liquid/react-sdk";

function DisconnectButton() {
  const { disconnect, isDisconnecting } = useDisconnect();

  return (
    <button onClick={disconnect} disabled={isDisconnecting}>
      {isDisconnecting ? "Disconnecting..." : "Disconnect"}
    </button>
  );
}
```

#### useIsExtensionInstalled

Check if the Liquid browser extension is installed (for injected provider):

```tsx
import { useIsExtensionInstalled } from "@liquid/react-sdk";

function ExtensionStatus() {
  const { isLoading, isInstalled } = useIsExtensionInstalled();

  if (isLoading) {
    return <div>Checking for Liquid extension...</div>;
  }

  return (
    <div>
      {isInstalled ? (
        <p>✅ Liquid extension is installed!</p>
      ) : (
        <p>
          ❌ Liquid extension not found.{" "}
          <a href="https://phantom.app/download" target="_blank">
            Install here
          </a>
        </p>
      )}
    </div>
  );
}
```

#### useIsLiquidLoginAvailable

Check if Liquid Login is available (requires extension installed and `liquid_login` feature support):

```tsx
import { useIsLiquidLoginAvailable } from "@liquid/react-sdk";

function LiquidLoginButton() {
  const { isLoading, isAvailable } = useIsLiquidLoginAvailable();
  const { connect } = useConnect();

  if (isLoading) {
    return <div>Checking Liquid Login availability...</div>;
  }

  if (!isAvailable) {
    return null; // Don't show button if Liquid Login is not available
  }

  return <button onClick={() => connect({ provider: "liquid" })}>Login with Liquid</button>;
}
```

### Chain-Specific Hooks

#### useSolana

Hook for Solana chain operations:

```tsx
import { useSolana } from "@liquid/react-sdk";
import { VersionedTransaction, TransactionMessage, SystemProgram, PublicKey, Connection } from "@solana/web3.js";

function SolanaOperations() {
  const { solana, isAvailable } = useSolana();

  // Check if Solana is available before using it
  if (!isAvailable) {
    return <div>Solana is not available for the current wallet</div>;
  }

  const signMessage = async () => {
    const signature = await solana.signMessage("Hello Solana!");
    console.log("Signature:", signature);
  };

  const signAndSendTransaction = async () => {
    // Create transaction
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const { blockhash } = await connection.getLatestBlockhash();

    const fromAddress = solana.publicKey;
    if (!fromAddress) throw new Error("Not connected");
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(fromAddress),
      toPubkey: new PublicKey(toAddress),
      lamports: 1000000, // 0.001 SOL
    });

    const messageV0 = new TransactionMessage({
      payerKey: new PublicKey(fromAddress),
      recentBlockhash: blockhash,
      instructions: [transferInstruction],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    // Sign and send
    const result = await solana.signAndSendTransaction(transaction);
    console.log("Transaction sent:", result.signature);
  };

  const switchNetwork = async () => {
    await solana.switchNetwork("devnet");
  };

  return (
    <div>
      <button onClick={signMessage}>Sign Message</button>
      <button onClick={signAndSendTransaction}>Send Transaction</button>
      <button onClick={switchNetwork}>Switch to Devnet</button>
      <p>Connected: {solana.isConnected ? "Yes" : "No"}</p>
    </div>
  );
}
```

**Available methods:**

- `signMessage(message)` - Sign a message
- `signTransaction(transaction)` - Sign without sending
- `signAndSendTransaction(transaction)` - Sign and send
- `switchNetwork(network)` - Switch between mainnet/devnet
- `publicKey` - Current public key (or `null` if disconnected)
- `isConnected` - Connection status
- `isAvailable` - Provider availability (see note below)

**Note on `isAvailable`:**

The `isAvailable` property indicates whether the Solana chain is available for the currently connected wallet:

- **For embedded wallets** (Google, Apple, Liquid Login, etc.): `isAvailable` will be `true` for all networks configured in your `addressTypes` array, as embedded wallets support all configured networks.

- **For Liquid injected wallet**: `isAvailable` will be `true` for all networks configured in your `addressTypes` array, as Liquid supports multiple networks.

- **For other injected wallets** (discovered via Wallet Standard or EIP-6963): `isAvailable` depends on which networks the specific wallet supports. For example, if you connect to a wallet that only supports Ethereum, `isAvailable` will be `false` for Solana even if Solana is in your `addressTypes` configuration.

Always check `isAvailable` before attempting to use chain-specific methods when working with injected wallets that may not support all networks.

#### useEthereum

Hook for Ethereum chain operations:

```tsx
import { useEthereum } from "@liquid/react-sdk";

function EthereumOperations() {
  const { ethereum, isAvailable } = useEthereum();

  // Check if Ethereum is available before using it
  if (!isAvailable) {
    return <div>Ethereum is not available for the current wallet</div>;
  }

  const signPersonalMessage = async () => {
    const accounts = await ethereum.getAccounts();
    const signature = await ethereum.signPersonalMessage("Hello Ethereum!", accounts[0]);
    console.log("Signature:", signature);
  };

  const signTypedData = async () => {
    const accounts = await ethereum.getAccounts();
    const typedData = {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Mail: [
          { name: "from", type: "string" },
          { name: "to", type: "string" },
          { name: "contents", type: "string" },
        ],
      },
      primaryType: "Mail",
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      message: {
        from: "Alice",
        to: "Bob",
        contents: "Hello!",
      },
    };

    const signature = await ethereum.signTypedData(typedData);
    console.log("Typed data signature:", signature);
  };

  const signTransaction = async () => {
    const signedTx = await ethereum.signTransaction({
      to: "0x742d35Cc6634C0532925a3b8D4C8db86fB5C4A7E",
      value: "1000000000000000000", // 1 ETH in wei
      gas: "21000",
    });
    console.log("Transaction signed:", signedTx);
    // Transaction is signed but not sent - you can broadcast it later
  };

  const sendTransaction = async () => {
    const result = await ethereum.sendTransaction({
      to: "0x742d35Cc6634C0532925a3b8D4C8db86fB5C4A7E",
      value: "1000000000000000000", // 1 ETH in wei
      gas: "21000",
    });
    console.log("Transaction sent:", result.hash);
  };

  const switchChain = async () => {
    await ethereum.switchChain(137); // Switch to Polygon
  };

  return (
    <div>
      <button onClick={signPersonalMessage}>Sign Personal Message</button>
      <button onClick={signTypedData}>Sign Typed Data</button>
      <button onClick={signTransaction}>Sign Transaction</button>
      <button onClick={sendTransaction}>Sign & Send Transaction</button>
      <button onClick={switchChain}>Switch to Polygon</button>
      <p>Connected: {ethereum.isConnected ? "Yes" : "No"}</p>
    </div>
  );
}
```

**Available methods:**

- `request(args)` - EIP-1193 requests
- `signPersonalMessage(message, address)` - Sign personal message
- `signTypedData(typedData)` - Sign EIP-712 typed data
- `signTransaction(transaction)` - Sign transaction without sending
- `sendTransaction(transaction)` - Sign and send transaction
- `switchChain(chainId)` - Switch chains (accepts chain ID as number or a hex string)
- `getChainId()` - Get current chain ID
- `getAccounts()` - Get connected accounts
- `isConnected` - Connection status
- `isAvailable` - Provider availability (see note below)

**Note on `isAvailable`:**

The `isAvailable` property indicates whether the Ethereum chain is available for the currently connected wallet:

- **For embedded wallets** (Google, Apple, Liquid Login, etc.): `isAvailable` will be `true` for all networks configured in your `addressTypes` array, as embedded wallets support all configured networks.

- **For Liquid injected wallet**: `isAvailable` will be `true` for all networks configured in your `addressTypes` array, as Liquid supports multiple networks.

- **For other injected wallets** (discovered via Wallet Standard or EIP-6963): `isAvailable` depends on which networks the specific wallet supports. For example, if you connect to a wallet that only supports Solana, `isAvailable` will be `false` for Ethereum even if Ethereum is in your `addressTypes` configuration.

Always check `isAvailable` before attempting to use chain-specific methods when working with injected wallets that may not support all networks.

**Supported EVM Networks:**

| Network          | Chain ID   | Usage                            |
| ---------------- | ---------- | -------------------------------- |
| Ethereum Mainnet | `1`        | `ethereum.switchChain(1)`        |
| Ethereum Sepolia | `11155111` | `ethereum.switchChain(11155111)` |
| Polygon Mainnet  | `137`      | `ethereum.switchChain(137)`      |
| Polygon Amoy     | `80002`    | `ethereum.switchChain(80002)`    |
| Base Mainnet     | `8453`     | `ethereum.switchChain(8453)`     |
| Base Sepolia     | `84532`    | `ethereum.switchChain(84532)`    |
| Arbitrum One     | `42161`    | `ethereum.switchChain(42161)`    |
| Arbitrum Sepolia | `421614`   | `ethereum.switchChain(421614)`   |
| Monad Mainnet    | `143`      | `ethereum.switchChain(143)`      |
| Monad Testnet    | `10143`    | `ethereum.switchChain(10143)`    |

### Wallet Discovery Hook

#### useDiscoveredWallets

Hook to get discovered injected wallets with automatic loading and error states. Discovers wallets using Wallet Standard (Solana) and EIP-6963 (Ethereum) standards.

```tsx
import { useDiscoveredWallets } from "@liquid/react-sdk";

function WalletSelector() {
  const { wallets, isLoading, error, refetch } = useDiscoveredWallets();

  // wallets: InjectedWalletInfo[] - Array of discovered wallets
  // isLoading: boolean - Loading state during discovery
  // error: Error | null - Error state if discovery fails
  // refetch: () => Promise<void> - Function to manually trigger discovery
}
```

**Returns:**

- `wallets: InjectedWalletInfo[]` - Array of discovered wallet information
- `isLoading: boolean` - `true` while discovery is in progress
- `error: Error | null` - Error object if discovery fails, `null` otherwise
- `refetch: () => Promise<void>` - Async function to manually refresh the wallet list

**Behavior:**

- Automatically fetches discovered wallets when the SDK becomes available
- If no wallets are found in the registry, triggers async `discoverWallets()` to discover them
- Wallets are filtered based on the `addressTypes` configured in `LiquidProvider`
- Liquid wallet is automatically included if available

### Auto-Confirm Hook (Injected Provider Only)

#### useAutoConfirm

Hook for managing auto-confirm functionality with the Liquid extension. Auto-confirm allows transactions to be automatically approved without user interaction for enabled chains.

> **Note**: This hook only works with the `injected` provider type (Liquid browser extension). It will throw errors for embedded providers.

```tsx
import { useAutoConfirm, NetworkId } from "@liquid/react-sdk";

function AutoConfirmControls() {
  const { enable, disable, status, supportedChains, isLoading, error, refetch } = useAutoConfirm();

  const handleEnable = async () => {
    try {
      // Enable auto-confirm for specific chains
      const result = await enable({
        chains: [NetworkId.SOLANA_DEVNET, NetworkId.ETHEREUM_MAINNET],
      });
      console.log("Auto-confirm enabled:", result);
    } catch (err) {
      console.error("Failed to enable auto-confirm:", err);
    }
  };

  const handleDisable = async () => {
    try {
      await disable();
      console.log("Auto-confirm disabled");
    } catch (err) {
      console.error("Failed to disable auto-confirm:", err);
    }
  };

  if (isLoading) {
    return <div>Loading auto-confirm settings...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h3>Auto-Confirm Settings</h3>

      <div>
        <strong>Status:</strong> {status?.enabled ? "Enabled" : "Disabled"}
        {status?.chains && (
          <div>
            <strong>Active Chains:</strong>
            <ul>
              {status.chains.map(chain => (
                <li key={chain}>{chain}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <strong>Supported Chains:</strong>
        {supportedChains?.chains && (
          <ul>
            {supportedChains.chains.map(chain => (
              <li key={chain}>{chain}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button onClick={handleEnable} disabled={isLoading}>
          Enable Auto-Confirm
        </button>
        <button onClick={handleDisable} disabled={isLoading}>
          Disable Auto-Confirm
        </button>
        <button onClick={refetch} disabled={isLoading}>
          Refresh Status
        </button>
      </div>
    </div>
  );
}
```

**Hook Interface:**

```typescript
interface UseAutoConfirmResult {
  enable: (params: AutoConfirmEnableParams) => Promise<AutoConfirmResult>;
  disable: () => Promise<void>;
  status: AutoConfirmResult | null;
  supportedChains: AutoConfirmSupportedChainsResult | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface AutoConfirmEnableParams {
  chains?: NetworkId[]; // Optional array of chains to enable
}

interface AutoConfirmResult {
  enabled: boolean;
  chains: NetworkId[];
}

interface AutoConfirmSupportedChainsResult {
  chains: NetworkId[];
}
```

**Available Methods:**

- `enable(params)` - Enable auto-confirm for specific chains
- `disable()` - Disable auto-confirm completely
- `refetch()` - Refresh status and supported chains from extension
- `status` - Current auto-confirm status (enabled/disabled and active chains)
- `supportedChains` - List of chains that support auto-confirm
- `isLoading` - Loading state for operations
- `error` - Any errors from auto-confirm operations

**Usage Notes:**

- Auto-confirm automatically fetches status and supported chains when the hook initializes
- Only works with injected provider (Liquid extension)
- Throws errors for embedded providers
- Status is automatically updated after enable/disable operations
- Use `refetch()` to manually refresh data from the extension

## Transaction Examples

### Solana with @solana/web3.js

```tsx
import { VersionedTransaction, TransactionMessage, SystemProgram, PublicKey, Connection } from "@solana/web3.js";
import { useSolana } from "@liquid/react-sdk";

function SolanaExample() {
  const { solana } = useSolana();

  const sendTransaction = async () => {
    // Get recent blockhash
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const { blockhash } = await connection.getLatestBlockhash();

    // Create transfer instruction
    const fromAddress = solana.publicKey;
    if (!fromAddress) throw new Error("Not connected");
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(fromAddress),
      toPubkey: new PublicKey(toAddress),
      lamports: 1000000, // 0.001 SOL
    });

    // Create VersionedTransaction
    const messageV0 = new TransactionMessage({
      payerKey: new PublicKey(fromAddress),
      recentBlockhash: blockhash,
      instructions: [transferInstruction],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    // Sign and send using chain-specific hook
    const result = await solana.signAndSendTransaction(transaction);
    console.log("Transaction sent:", result.signature);
  };

  return <button onClick={sendTransaction}>Send SOL</button>;
}
```

### Solana with @solana/kit

```tsx
import {
  createSolanaRpc,
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  address,
  compileTransaction,
} from "@solana/kit";
import { useSolana } from "@liquid/react-sdk";

function SolanaKitExample() {
  const { solana } = useSolana();

  const sendTransaction = async () => {
    const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const userPublicKey = solana.publicKey;
    if (!userPublicKey) throw new Error("Not connected");
    const transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      tx => setTransactionMessageFeePayer(address(userPublicKey), tx),
      tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    );

    const transaction = compileTransaction(transactionMessage);

    // Sign and send using chain-specific hook
    const result = await solana.signAndSendTransaction(transaction);
    console.log("Transaction sent:", result.signature);
  };

  return <button onClick={sendTransaction}>Send SOL</button>;
}
```

### Ethereum with Viem

```tsx
import { parseEther, parseGwei, encodeFunctionData } from "viem";
import { useEthereum } from "@liquid/react-sdk";

function EthereumExample() {
  const { ethereum } = useEthereum();

  const sendEth = async () => {
    const result = await ethereum.sendTransaction({
      to: "0x742d35Cc6634C0532925a3b8D4C8db86fB5C4A7E",
      value: parseEther("1").toString(), // 1 ETH
      gas: "21000",
      gasPrice: parseGwei("20").toString(), // 20 gwei
    });
    console.log("ETH sent:", result.hash);
  };

  const sendToken = async () => {
    const result = await ethereum.sendTransaction({
      to: tokenContractAddress,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipientAddress, parseEther("100")],
      }),
      gas: "50000",
      maxFeePerGas: parseGwei("30").toString(),
      maxPriorityFeePerGas: parseGwei("2").toString(),
    });
    console.log("Token sent:", result.hash);
  };

  return (
    <div>
      <button onClick={sendEth}>Send ETH</button>
      <button onClick={sendToken}>Send Token</button>
    </div>
  );
}
```

## Hooks Reference

Quick reference of all available hooks:

| Hook                         | Purpose                                 | Returns                                             |
| ---------------------------- | --------------------------------------- | --------------------------------------------------- |
| `useConnect`                 | Connect to wallet                       | `{ connect, isConnecting, error }`                  |
| `useModal`                   | Control connection modal                | `{ open, close, isOpened }`                         |
| `useAccounts`                | Get wallet addresses                    | `WalletAddress[]` or `null`                         |
| `useIsExtensionInstalled`    | Check extension status                  | `{ isLoading, isInstalled }`                        |
| `useIsLiquidLoginAvailable` | Check Liquid Login availability        | `{ isLoading, isAvailable }`                        |
| `useDisconnect`              | Disconnect from wallet                  | `{ disconnect, isDisconnecting }`                   |
| `useAutoConfirm`             | Auto-confirm management (injected only) | `{ enable, disable, status, supportedChains, ... }` |
| `useDiscoveredWallets`       | Get discovered injected wallets         | `{ wallets, isLoading, error, refetch }`            |
| `useSolana`                  | Solana chain operations                 | `{ signMessage, signAndSendTransaction, ... }`      |
| `useEthereum`                | Ethereum chain operations               | `{ signPersonalMessage, sendTransaction, ... }`     |
| `useTheme`                   | Access current theme                    | `LiquidTheme`                                      |
| `useLiquid`                 | Get provider context                    | `{ isConnected, isReady }`                          |

## Configuration Reference

```typescript
interface LiquidSDKConfig {
  // List of allowed authentication providers (REQUIRED)
  providers: AuthProviderType[]; // e.g., ["google", "apple", "liquid", "injected"]

  addressTypes?: [AddressType, ...AddressType[]]; // Networks to enable (e.g., [AddressType.solana])

  // Required when using embedded providers (google, apple, liquid)
  appId?: string; // Your app ID from phantom.com/portal

  // Optional configuration
  apiBaseUrl?: string; // Liquid API base URL (optional, has default)
  authOptions?: {
    authUrl?: string; // Custom auth URL (optional, defaults to "https://connect.phantom.app/login")
    redirectUrl?: string; // Custom redirect URL after authentication (optional)
  };
  embeddedWalletType?: "user-wallet"; // Wallet type (optional, defaults to "user-wallet")
  autoConnect?: boolean; // Auto-connect to existing session (default: true when embedded providers used)
}

// Valid provider types
type AuthProviderType = "google" | "apple" | "liquid" | "injected";
```

## Debug Configuration

The React SDK supports separate debug configuration that can be changed without reinstantiating the underlying SDK, providing better performance.

### LiquidDebugConfig Interface

```typescript
interface LiquidDebugConfig {
  enabled?: boolean; // Enable debug logging
  level?: DebugLevel; // Debug level (ERROR, WARN, INFO, DEBUG)
  callback?: DebugCallback; // Custom debug message handler
}
```

### Using Debug Configuration

Pass the `debugConfig` as a separate prop to `LiquidProvider`:

```typescript
import { LiquidProvider, type LiquidSDKConfig, type LiquidDebugConfig, DebugLevel } from "@liquid/react-sdk";

function App() {
  const [debugLevel, setDebugLevel] = useState(DebugLevel.INFO);
  const [debugMessages, setDebugMessages] = useState([]);

  // SDK configuration - static, won't change when debug settings change
  const config: LiquidSDKConfig = {
    providers: ["google", "apple", "liquid"],
    appId: "your-app-id",
    addressTypes: [AddressType.solana, AddressType.ethereum],
    // ... other config
  };

  // Debug configuration - separate to avoid SDK reinstantiation
  const debugConfig: LiquidDebugConfig = {
    enabled: true,
    level: debugLevel,
    callback: (message) => {
      setDebugMessages(prev => [...prev, message]);
    }
  };

  return (
    <LiquidProvider config={config} debugConfig={debugConfig}>
      {/* Your app components */}
    </LiquidProvider>
  );
}
```

### Debug Message Structure

Debug callbacks receive a `DebugMessage` object:

```typescript
interface DebugMessage {
  timestamp: number; // Unix timestamp
  level: DebugLevel; // Message level
  category: string; // Component category
  message: string; // Debug message text
  data?: any; // Additional debug data (optional)
}
```

For more details and examples, see the [@liquid/browser-sdk documentation](../browser-sdk/README.md).
