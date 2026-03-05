# @liquid/api-key-stamper

API key stamper for authenticating requests to Liquid Wallet API.

## Installation

```bash
npm install @liquid/api-key-stamper
# or
yarn add @liquid/api-key-stamper
```

## Usage

The `ApiKeyStamper` is used to sign HTTP requests with Ed25519 signatures for authentication with Liquid's API.

### Basic Usage

```typescript
import { ApiKeyStamper } from "@liquid/api-key-stamper";
import { LiquidClient } from "@liquid/client";

// Create a stamper with your secret key
const stamper = new ApiKeyStamper({
  apiSecretKey: "your-base58-encoded-secret-key",
});

// Use it with LiquidClient
const client = new LiquidClient(
  {
    apiBaseUrl: "https://api.phantom.app/v1/wallets",
    organizationId: "your-org-id",
  },
  stamper,
);

// Now all requests will be automatically signed
const wallet = await client.createWallet("My Wallet");
```

### With Server SDK

The `@liquid/server-sdk` package uses this stamper internally:

```typescript
import { ServerSDK } from "@liquid/server-sdk";

const sdk = new ServerSDK({
  organizationId: "your-org-id",
  appId: "your-app-id",
  apiBaseUrl: "https://api.phantom.app/v1/wallets",
  apiPrivateKey: "your-base58-encoded-secret-key",
});

// The SDK automatically creates and uses an ApiKeyStamper
const wallet = await sdk.createWallet("My Wallet");
```

### How it Works

1. The stamper takes your base58-encoded Ed25519 secret key
2. For each request, it signs the request body with the secret key
3. The stamp is added to the request headers as `X-Liquid-Stamp` containing:
   - `publicKey`: Base64url-encoded public key
   - `signature`: Base64url-encoded signature
   - `kind`: Always "PKI" for this authentication method
4. The entire stamp object is JSON-encoded and then base64url-encoded
5. The server verifies the signature to authenticate the request

#### Example Stamp Structure

Before encoding, the stamp object looks like:

```json
{
  "publicKey": "base64url-encoded-public-key",
  "signature": "base64url-encoded-signature",
  "kind": "PKI"
}
```

This JSON is then base64url-encoded and sent as the `X-Liquid-Stamp` header.

### Security Notes

- Keep your secret key secure and never expose it in client-side code
- Only use this stamper in server-side applications
- The secret key should be stored securely (e.g., in environment variables)

## Development

### Running Tests

```bash
npm test
```

The test suite includes:

- Constructor validation with valid/invalid keys
- Header addition and preservation
- Different data types (string, object, undefined)
- Stamp structure validation
- Cryptographic signature verification
- Base64url encoding/decoding utilities
- Edge cases and error handling

## API Reference

### ApiKeyStamper

```typescript
class ApiKeyStamper {
  constructor(config: ApiKeyStamperConfig);
  stamp(config: AxiosRequestConfig): Promise<AxiosRequestConfig>;
}

interface ApiKeyStamperConfig {
  apiSecretKey: string; // Base58-encoded Ed25519 secret key
}
```
