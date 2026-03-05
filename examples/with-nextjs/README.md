# Liquid SDK Next.js Example

This is a simple Next.js application that demonstrates how to use the Liquid React SDK to connect to Liquid wallet and sign Solana messages.

## Features

- Connect/disconnect Liquid wallet
- Display wallet addresses when connected
- Sign Solana messages
- Modern UI with Tailwind CSS

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Run the development server:

```bash
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Install Liquid browser extension if you haven't already

5. Click "Connect Liquid Wallet" and follow the prompts

6. Once connected, you can view your Solana address and sign a test message

## How It Works

- Uses `LiquidProvider` from `@liquid/react-sdk` to wrap the app
- `useConnect` hook provides connection state and methods
- `useSolana` hook gives access to Solana-specific functionality
- Configured for Solana only in this example

## Tech Stack

- Next.js 15.5.3 with App Router
- TypeScript
- Tailwind CSS
- @liquid/react-sdk
