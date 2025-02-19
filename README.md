# Morpho Vaults - Earn Basic Interface

## Overview

A reference implementation showcasing how to integrate Morpho Vaults (EARN) into any frontend application. This template provides a starting point for building a basic interface for Morpho Vaults.

## Technical Stack

### Core Libraries

- **React**: Frontend framework
- **TypeScript**: Type-safe development
- **Vite**: Modern build tooling

### Morpho Integration Libraries

#### Core SDK Packages

- **@morpho-org/blue-sdk**: Core protocol integration
- **@morpho-org/bundler-sdk-viem**: Simplifies complex transactions into bundled operations
- **@morpho-org/simulation-sdk**: Position simulation capabilities

#### Framework Integrations

- **@morpho-org/blue-sdk-viem**: Viem-based fetch methods
- **@morpho-org/blue-sdk-wagmi**: React hooks for Morpho data
- **@morpho-org/simulation-sdk-wagmi**: React hooks for simulation state

#### Utility Packages

- **@morpho-org/morpho-ts**: Time and formatting utilities
- **@morpho-org/morpho-test**: Test fixtures for E2E testing

### Web3 Infrastructure

- **wagmi**: React Hooks for Ethereum
- **viem**: Low-level Ethereum interactions
- **RainbowKit**: Wallet connection UI
- **@tanstack/react-query**: Data management
- **@apollo/client**: GraphQL integration

### Styling

- **Tailwind CSS**: Utility-first styling

## Key Features

### SDK View

- Real-time position tracking
- One-click deposits and withdrawals (approvals are handled thanks to the bundler-sdk-viem)
- Built-in transaction bundling
- Automatic approval handling
- Position simulation before execution

### API View

- Comprehensive vault details
- Real-time liquidity data
- Asset allocation visualization
- Historical performance metrics
- Metadata display

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn
- Web3 wallet (MetaMask, Rabby, or OKX)

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
yarn install
```

### Development

```bash
# Start development server
yarn dev
```

Access the application at `http://localhost:5173`

### Production Build

```bash
yarn build
```

## Integration Guide

### Custom Hooks

The project includes essential hooks for Morpho integration:

1. **useGetUserSDKVaultPosition**

   - Tracks user's vault positions
   - Real-time balance updates
   - Share-to-underlying conversion

2. **usePopulatedSimulationState**
   - Pre-transaction simulation
   - Gas estimation
   - Error prevention
   - Position health checks

### Key Components

#### SDK View (`TestInterface`)

```typescript
// Handles deposits, withdrawals, and position management
const TestInterface = () => {
  // Integration code...
};
```

#### API View (`VaultAPIView`)

```typescript
// Displays comprehensive vault data
const VaultAPIView = ({ vaultAddress }) => {
  // Display code...
};
```

## Development Notes

### Default Configuration

- Default vault: Gauntlet WETH Prime Vault
- Network: Ethereum Mainnet (with Anvil support for testing)
- Supported wallets: MetaMask, Rabby, OKX

### Error Handling

Comprehensive error management for:

- Wallet connections
- Transaction failures
- Position validations
- Input verification

## License

This project is licensed under the MIT License - see the LICENSE file for details.
