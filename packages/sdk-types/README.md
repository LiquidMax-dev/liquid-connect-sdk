# @liquid/sdk-types

Common TypeScript types and interfaces used across the Liquid Wallet SDK packages.

## Overview

This package provides centralized type definitions that are shared across multiple Liquid SDK packages, ensuring consistency and reducing duplication.

## Installation

```bash
npm install @liquid/sdk-types
```

## Types

### `Stamper`

Interface for creating X-Liquid-Stamp header values for API authentication.

```typescript
interface Stamper {
  stamp(params: { data: Buffer }): Promise<string>;
  type?: "PKI" | "OIDC"; // Optional, defaults to "PKI"
  idToken?: string; // Required for OIDC type, optional for PKI
  salt?: string; // Required for OIDC type, optional for PKI
  algorithm?: Algorithm; // Optional, defaults to Algorithm.ed25519
}
```

**Usage:**

```typescript
import type { Stamper } from "@liquid/sdk-types";

class MyStamper implements Stamper {
  type = "PKI"; // or "OIDC"
  async stamp(params: { data: Buffer }): Promise<string> {
    // Implementation for PKI stamping
    return "stamp-value";
  }
}
```

### `StamperKeyInfo`

Key information structure returned by stampers.

```typescript
interface StamperKeyInfo {
  keyId: string;
  publicKey: string;
}
```

### `StamperWithKeyManagement`

Extended stamper interface for stampers that manage their own cryptographic keys.

```typescript
interface StamperWithKeyManagement extends Stamper {
  init(): Promise<StamperKeyInfo>;
  getKeyInfo(): StamperKeyInfo | null;
  resetKeyPair?(): Promise<StamperKeyInfo>;
  clear?(): Promise<void>;
}
```

**Usage:**

```typescript
import type { StamperWithKeyManagement } from "@liquid/sdk-types";

class MyKeyManagedStamper implements StamperWithKeyManagement {
  async init(): Promise<StamperKeyInfo> {
    // Initialize and return key info
    return { keyId: "key-id", publicKey: "public-key" };
  }

  getKeyInfo(): StamperKeyInfo | null {
    // Return current key info or null if not initialized
    return { keyId: "key-id", publicKey: "public-key" };
  }

  async stamp(params: { data: Buffer }): Promise<string> {
    // Implementation
    return "stamp-value";
  }
}
```

## Package Usage

This package is used by:

- `@liquid/client` - For the base Stamper interface
- `@liquid/embedded-provider-core` - For StamperWithKeyManagement interface
- `@liquid/api-key-stamper` - Implements Stamper interface
- `@liquid/indexed-db-stamper` - Implements StamperWithKeyManagement interface
- `@liquid/react-native-sdk` - For embedded stampers

## License

MIT
