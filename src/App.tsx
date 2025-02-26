// src/App.tsx
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, anvil } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "wagmi";
import { useEffect, useState } from "react";
import { Address, getAddress, Hex, isAddress, isHex } from "viem";
import {
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./service/apollo.client";
import { VaultAPIView } from "./components/vault-api-view";
import { VaultSdkView } from "./components/vault-sdk-view";

const DEFAULT_VAULT: Address = "0x2371e134e3455e0593363cBF89d3b6cf53740618";

const TestInterface = () => {
  const [activeTab, setActiveTab] = useState<"SDK" | "API">("SDK");
  // `vaultAddressInput` is whatever the user types in -- any length string as long as it's Hex
  const [vaultAddressInput, setVaultAddressInput] =
    useState<Hex>(DEFAULT_VAULT);
  // `vaultAddress` is validated to be an Address
  const [vaultAddress, setVaultAddress] = useState(DEFAULT_VAULT);

  useEffect(() => {
    if (vaultAddressInput.length >= 42) {
      if (isAddress(vaultAddressInput, { strict: false })) {
        setVaultAddress(getAddress(vaultAddressInput));
      } else {
        window.alert("Please enter a valid address.");
      }
    }
  }, [vaultAddressInput]);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 px-4 py-6 md:px-8">
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Vault Basic Interface
          </h1>
          <div>
            <ConnectButton />
          </div>
        </div>

        {/* Main Layout - Adjust the gap */}
        <div className="flex gap-8">
          {/* Left Sidebar - Make it narrower */}
          <div className="w-72 shrink-0">
            <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <span className="mr-2">▲</span> Vault Parameters
              </h2>
              <div className="mb-4 bg-[#121212] border border-gray-700 rounded-md p-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-300">
                    Ethereum Mainnet
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Currently only supporting Ethereum Mainnet
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Vault Address
                </label>
                <input
                  type="text"
                  name="vaultAddress"
                  value={vaultAddressInput}
                  onChange={(ev) => {
                    const value = ev.target.value;
                    if (isHex(value) && value.length <= 42) setVaultAddressInput(value);
                  }}
                  className="w-full bg-[#121212] border-[0.5px] border-gray-300 rounded p-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Main Content Area - Allow it to take remaining width */}
          <div className="flex-1">
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("SDK")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  activeTab === "SDK"
                    ? "bg-[#5792FF]! text-white"
                    : "bg-[#1E1E1E]! text-gray-400 hover:bg-[#2A2A2A]"
                }`}
              >
                1. SDK View & Interaction
              </button>
              <button
                onClick={() => setActiveTab("API")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  activeTab === "API"
                    ? "bg-[#5792FF]! text-white"
                    : "bg-[#1E1E1E]! text-gray-400 hover:bg-[#2A2A2A]"
                }`}
              >
                2. API View
              </button>
            </div>

            {activeTab === "SDK" ? (
              <VaultSdkView vaultAddress={vaultAddress} />
            ) : (
              <VaultAPIView vaultAddress={vaultAddress} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Configuration for your app (Wagmi, RainbowKit, React Query, etc.)
const config = getDefaultConfig({
  appName: "Test Wagmi Interface",
  projectId: "841b6ddde2826ce0acf2d1b1f81f8582",
  chains: [mainnet, anvil],
  wallets: [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, rabbyWallet, okxWallet],
    },
  ],
  transports: {
    [mainnet.id]: http(),
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
});

const queryClient = new QueryClient();

// Main App component
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ApolloProvider client={apolloClient}>
            <TestInterface />
          </ApolloProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
