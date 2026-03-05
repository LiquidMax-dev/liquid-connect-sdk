# Liquid SDK Scripts

This package contains demonstration scripts for the Liquid SDK capabilities.

## Server SDK Demo

The `server-sdk-demo` script demonstrates the core functionality of the Liquid Server SDK by:

1. Creating a new wallet
2. Executing a self-transfer transaction with a minimal amount of SOL
3. Tracking and reporting on transaction confirmation

### Prerequisites

Before running the demo, you need:

1. **Liquid Organization Credentials**
   - Organization ID
   - Organization Private Key (base58 encoded, P256 private key)
   - These are provided when you create an organization with Liquid

2. **Node.js** version 16 or higher

3. **SOL tokens** (for transaction fees)
   - For devnet: Use the [Solana Faucet](https://faucet.solana.com/)
   - For mainnet: You'll need real SOL

### Setup

1. **Install dependencies** from the monorepo root:

   ```bash
   yarn install
   ```

2. **Configure environment variables**:

   ```bash
   cd packages/server-sdk-examples
   cp env.example .env
   ```

3. **Edit `.env`** and add your credentials:
   ```env
   ORGANIZATION_ID=your-organization-id
   APP_ID=your-app-id
   ORGANIZATION_PRIVATE_KEY=your-base58-encoded-private-key
   WALLET_API=https://api.phantom.app/v1/wallets
   SOLANA_RPC_URL=https://api.devnet.solana.com
   NETWORK=devnet
   ```

### Running the Demo

From the `packages/server-sdk-examples` directory:

```bash
yarn server-sdk-demo
```

Or from the monorepo root:

```bash
yarn workspace @liquid/server-sdk-examples server-sdk-demo
```

### What the Demo Does

1. **Initializes the SDK** with your organization credentials
2. **Creates a new wallet** with a unique name
3. **Checks the wallet balance** and provides instructions if empty
4. **Creates a self-transfer transaction** for a minimal amount (0.000001 SOL)
5. **Signs and sends the transaction** using the Liquid Server SDK
6. **Monitors transaction confirmation** with real-time status updates
7. **Reports final results** including transaction fees and explorer links

### Sample Output

```
🚀 Liquid Server SDK Demo

📦 Initializing Server SDK...
🌐 Connected to Solana devnet at https://api.devnet.solana.com

1️⃣ Creating a new wallet...
✅ Wallet created successfully!
   Wallet ID: abc123...
   Name: Demo Wallet 1699999999999
   Solana Address: 5XY...ABC

2️⃣ Checking wallet balance...
   Balance: 1.5 SOL

3️⃣ Creating a self-transfer transaction...
   Amount: 0.000001 SOL (1000 lamports)
   From/To: 5XY...ABC
✅ Transaction created

4️⃣ Signing and sending transaction...
✅ Transaction signed and sent!
   Signature: 3ab...xyz

5️⃣ Waiting for transaction confirmation...
...
✅ Transaction confirmed in 2.3 seconds!
   Status: confirmed
   Slot: 123456789
   Fee: 0.000005 SOL

🔗 View on Explorer: https://explorer.solana.com/tx/3ab...xyz?cluster=devnet

6️⃣ Final balance check...
   Balance: 1.499994 SOL
   Change: 0.000006 SOL (fees)

🎉 Demo completed successfully!
```

### Troubleshooting

1. **"Missing required environment variables"**
   - Ensure `.env` file exists and contains all required values
   - Check that values are not wrapped in quotes

2. **"Wallet has 0 balance"**
   - For devnet: Request SOL from https://faucet.solana.com/
   - For mainnet: Send SOL to the displayed address

3. **"Transaction confirmation timeout"**
   - Network congestion may cause delays
   - Check the explorer link for manual verification

4. **Build errors**
   - Run `yarn build` from the monorepo root
   - Ensure all dependencies are installed

### Environment Variables

| Variable                   | Description                     | Example                              |
| -------------------------- | ------------------------------- | ------------------------------------ |
| `ORGANIZATION_ID`          | Your organization ID            | `org_abc123...`                      |
| `ORGANIZATION_PRIVATE_KEY` | Base58 encoded P256 private key | `5Kb8kL...`                          |
| `WALLET_API`               | Liquid API endpoint            | `https://api.phantom.app/v1/wallets` |
| `SOLANA_RPC_URL`           | Solana RPC endpoint             | `https://api.devnet.solana.com`      |
| `NETWORK`                  | Network to use                  | `devnet` or `mainnet`                |

### Security Notes

⚠️ **IMPORTANT**:

- Never commit your `.env` file to version control
- Keep your organization private key secure
- Use environment-specific credentials (dev/staging/prod)

### Next Steps

After running the demo, you can:

1. Explore the [Server SDK documentation](../server-sdk/README.md)
2. Integrate wallet creation into your backend
3. Build transaction signing flows for your application
4. Implement wallet management for your users

### Support

For issues or questions:

- Check the [Server SDK Integration Guide](../server-sdk/INTEGRATION.md)
- Review the demo source code at `src/server-sdk-demo.ts`
- Contact Liquid support for organization-specific issues

## List Wallets Script

The `list-wallets` script provides a comprehensive view of all wallets in your organization.

### What It Does

1. **Fetches all wallets** from your organization with automatic pagination
2. **Displays detailed information** for each wallet including:
   - Wallet ID and name
   - Creation and update timestamps
   - All associated blockchain addresses
3. **Provides summary statistics** about your wallet inventory
4. **Shows address distribution** across different blockchain networks

### Running the Script

From the `packages/server-sdk-examples` directory:

```bash
yarn list-wallets
```

Or from the monorepo root:

```bash
yarn workspace @liquid/server-sdk-examples list-wallets
```

### Sample Output

```
🔍 Liquid Wallet Lister

📦 Initializing Server SDK...
📊 Fetching wallets...

📈 Total wallets in organization: 47

✅ Fetched all 47 wallets!

📝 Wallet Details:
────────────────────────────────────────────────────────────────────────────────────────────────────

🔑 Wallet #1
   ID: wallet_abc123...
   Name: User Wallet 123
   Created: 11/15/2023, 10:30:45 AM
   Updated: 11/15/2023, 10:31:02 AM
   Addresses:
     • Solana: 5XY...ABC
     • Ethereum: 0x123...def

────────────────────────────────────────────────────────────────────────────────────────────────────

📊 Summary:
   Total wallets: 47
   Address types:
     • Solana: 47 addresses
     • Ethereum: 47 addresses
     • Polygon: 23 addresses

💡 Tip: You can modify this script to filter wallets by:
   • Creation date
   • Wallet name pattern
   • Address type
   • Or export to CSV/JSON for further analysis
```

### Use Cases

- **Inventory Management**: Get a complete overview of all wallets in your organization
- **Auditing**: Track wallet creation and usage patterns
- **Debugging**: Find specific wallets by ID or address
- **Analytics**: Export wallet data for further analysis

### Customization Ideas

The script can be easily modified to:

1. **Filter wallets** by creation date range
2. **Search for wallets** by name pattern
3. **Export data** to CSV or JSON format
4. **Find wallets** with specific address types
5. **Generate reports** for compliance or analytics

## Sign Message Script

The `sign-message` script demonstrates message signing capabilities using the Liquid Server SDK with Solana addresses.

### What It Does

1. **Takes a user-provided message** as a command-line argument
2. **Creates or uses an existing wallet** based on provided options
3. **Signs the message** using the wallet's Solana address
4. **Outputs the signature** in multiple formats (base64, hex, bytes)
5. **Provides verification information** for validating the signature

### Running the Script

Basic usage - sign a message with a new wallet:

```bash
yarn sign-message "Hello, Liquid!"
```

Use an existing wallet by ID:

```bash
yarn sign-message "Your message here" --wallet-id wallet_abc123...
```

Use or create a wallet with a specific name:

```bash
yarn sign-message "Sign this!" --wallet-name "My Signing Wallet"
```

From the monorepo root:

```bash
yarn workspace @liquid/server-sdk-examples sign-message "Your message"
```

### Command Line Options

- `--wallet-id` - Use an existing wallet by its ID
- `--wallet-name` - Create a new wallet with this name, or use the first existing wallet with this name

### Sample Output

```
✍️  Liquid Message Signer

📦 Initializing Server SDK...
🆕 Creating new wallet: Message Signing Wallet 1699999999999
✅ Wallet created: wallet_abc123...

📝 Message Details:
   Message: "Hello, Liquid!"
   Length: 15 characters
   UTF-8 bytes: 15

🔑 Wallet Details:
   Wallet ID: wallet_abc123...
   Solana Address: 5XY...ABC
   Status: Newly created

🖊️  Signing message with Solana network...

✅ Message signed successfully!

📊 Signature Details:
   Base64: 3ab4c5d6e7f8...
   Length: 88 characters
   Hex: ddaeb87...
   Bytes: [221, 174, 184, 119...] (64 bytes)

🔐 Verification Info:
   To verify this signature:
   - Public Key: 5XY...ABC
   - Message: "Hello, Liquid!"
   - Signature (base64): 3ab4c5d6e7f8...

💡 Tips:
   - This signature was created using the Solana network context
   - You can modify the script to use other networks (Ethereum, etc.)
   - The signature can be verified using the public key and original message
   - Save the wallet ID to reuse the same wallet for future signatures

⚠️  Remember to save this wallet ID for future use: wallet_abc123...
```

### Use Cases

- **Authentication**: Sign challenges to prove wallet ownership
- **Document Signing**: Create verifiable signatures for documents or agreements
- **API Authentication**: Generate signed tokens for API access
- **Testing**: Verify signature generation and validation logic

### Technical Details

The script uses the Liquid Server SDK's `signMessage` function which:

1. Takes a UTF-8 string message
2. Converts it to base64url internally
3. Signs it with the wallet's private key for the specified network
4. Returns a base64url-encoded signature

The signature can be verified using:

- The public key (Solana address)
- The original message
- Standard Ed25519 signature verification (for Solana)

### Extending the Script

You can modify the script to:

1. **Sign with different networks** - Change `NetworkId.SOLANA_MAINNET` to other networks
2. **Batch sign messages** - Process multiple messages from a file
3. **Output to file** - Save signatures and metadata to JSON
4. **Verify signatures** - Add signature verification functionality
5. **Sign structured data** - Sign JSON objects or other data formats
