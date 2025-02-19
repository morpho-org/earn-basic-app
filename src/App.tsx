// src/App.tsx
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { useWalletClient, WagmiProvider } from "wagmi";
import { mainnet, anvil } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "wagmi";
import { useState } from "react";
import { depositUsingBundler, withdrawUsingBundler } from "./service/actions";
import { Vault } from "@morpho-org/blue-sdk";
import { Address, formatUnits, parseEther } from "viem";
import {
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { usePopulatedSimulationState } from "./hooks/usePopulatedSimulationState";
import "@rainbow-me/rainbowkit/styles.css";
import { useGetUserSDKVaultPositions } from "./hooks/useGetUserSDKVaultPosition";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./service/apollo.client";
import { useGetVaultDisplayQuery } from "./graphql/__generated__/GetVaultDisplay.query.generated";

type VaultAPIViewProps = {
  vaultAddress: string;
};
export const VaultAPIView = ({ vaultAddress }: VaultAPIViewProps) => {
  const { data, loading, error } = useGetVaultDisplayQuery({
    variables: {
      //@ts-expect-error vaultAddress is a string
      address: vaultAddress as `0x${string}`,
      //@ts-expect-error chainId is a number
      chainId: 1, // mainnet
    },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <div className="space-y-6 mb-8">
        {/* Top Row: Basic Vault Info & Metadata */}
        <div className="grid grid-cols-2 gap-6">
          {/* Vault Info Card */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-700 rounded w-1/4"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
          {/* Metadata Card */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-700 rounded w-1/4"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        {/* Second Row: Liquidity & Asset Info */}
        <div className="grid grid-cols-2 gap-6">
          {/* Liquidity Card */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-700 rounded w-1/4"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
          {/* Asset Info Card */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-700 rounded w-1/4"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        {/* Chain Info & Allocators */}
        <div className="grid grid-cols-2 gap-6">
          {/* Chain Info Card */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-700 rounded w-1/4"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
          {/* Allocators Card */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-700 rounded w-1/4"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-red-700">
        <p className="text-red-400">
          Error loading vault data: {error.message}
        </p>
      </div>
    );
  }

  const vault = data?.vaultByAddress;
  if (!vault) {
    return (
      <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
        <p className="text-gray-400">No vault found at this address</p>
      </div>
    );
  }

  // Optional: Convert timestamps to human-readable date
  const creationDate = vault.creationTimestamp
    ? new Date(Number(vault.creationTimestamp) * 1000).toLocaleString()
    : "N/A";

  return (
    <div className="space-y-6 mb-8">
      {/* Top Row: Basic Vault Info & Metadata */}
      <div className="grid grid-cols-2 gap-6">
        {/* Vault Info Card */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">📋</span> Vault Info
          </h2>
          <div className="space-y-4">
            <div className="bg-[#121212] border border-gray-700 rounded-md p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="font-medium">{vault.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Symbol</p>
                  <p className="font-medium">{vault.symbol}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="font-medium break-all">{vault.address}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Whitelisted</p>
                  <p className="font-medium">
                    {vault.whitelisted ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Creator</p>
                  <p className="font-medium break-all">
                    {vault.creatorAddress}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Factory</p>
                  <p className="font-medium break-all">
                    {vault.factory?.address}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Creation Block</p>
                  <p className="font-medium">{vault.creationBlockNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Creation Timestamp</p>
                  <p className="font-medium">{creationDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">ℹ️</span> Metadata
          </h2>
          <div className="bg-[#121212] border border-gray-700 rounded-md p-4 space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Description</p>
              <p className="font-medium">{vault.metadata?.description}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Vault Image</p>
              {vault.metadata?.image ? (
                <img
                  src={vault.metadata.image}
                  alt="Vault"
                  className="max-w-[80px] mt-2 rounded"
                />
              ) : (
                <p className="text-gray-500">No image provided</p>
              )}
            </div>
            {vault.metadata?.curators && vault.metadata.curators.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm mb-2">Curators</p>
                <ul className="space-y-2">
                  {vault.metadata.curators.map((curator, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-2 bg-[#1E1E1E] p-2 rounded"
                    >
                      {curator.image && (
                        <img
                          src={curator.image}
                          alt={curator.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="font-medium">{curator.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Liquidity & Asset Info */}
      <div className="grid grid-cols-2 gap-6">
        {/* Liquidity Card */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">💧</span> Liquidity
          </h2>
          <div className="bg-[#121212] border border-gray-700 rounded-md p-4 space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Underlying</p>
              <p className="font-medium break-all">
                {vault.liquidity?.underlying}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">USD</p>
              <p className="font-medium">
                {vault.liquidity?.usd
                  ? `$${vault.liquidity.usd.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* ALLOCATIONS */}
          {vault.state?.allocation && vault.state.allocation.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Allocations</h3>
              <div className="space-y-4">
                {[...vault.state.allocation]
                  .sort(
                    (a, b) =>
                      (b.supplyAssetsUsd ?? 0) - (a.supplyAssetsUsd ?? 0)
                  )
                  .map((allocation, idx) => {
                    const { supplyAssets, supplyAssetsUsd, market } =
                      allocation;
                    const collateralAsset = market.collateralAsset;
                    const decimals = collateralAsset?.decimals ?? 18;

                    return (
                      <div
                        key={idx}
                        className="bg-[#121212] border border-gray-700 rounded-md p-4"
                      >
                        {/* Market row */}
                        <div className="flex justify-between mb-2">
                          <div>
                            <p className="text-gray-400 text-sm">Collateral</p>
                            <p className="font-medium">
                              {collateralAsset?.symbol ?? "N/A"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Market Key</p>
                            <p className="font-medium break-all">
                              {market.uniqueKey}
                            </p>
                          </div>
                        </div>

                        {/* Amount & Value row */}
                        <div className="flex justify-between mt-2">
                          <div>
                            <p className="text-gray-400 text-sm">Amount</p>
                            <p className="font-medium">
                              {formatUnits(BigInt(supplyAssets), decimals)}{" "}
                              {vault.asset.symbol}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Value (USD)</p>
                            <p className="font-medium">
                              {supplyAssetsUsd
                                ? `$${supplyAssetsUsd.toLocaleString(
                                    undefined,
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )}`
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="mt-4 text-gray-500">No allocations found.</div>
          )}
        </div>

        {/* Asset Info Card */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">🪙</span> Asset Details
          </h2>
          <div className="bg-[#121212] border border-gray-700 rounded-md p-4 space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="font-medium">{vault.asset.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Symbol</p>
              <p className="font-medium">{vault.asset.symbol}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Address</p>
              <p className="font-medium break-all">{vault.asset.address}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Decimals</p>
              <p className="font-medium">{vault.asset.decimals}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Price (USD)</p>
              <p className="font-medium">
                {vault.asset.priceUsd
                  ? `$${vault.asset.priceUsd.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`
                  : "N/A"}
              </p>
            </div>
            {vault.asset.tags && vault.asset.tags.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm">Tags</p>
                <div className="flex space-x-2 mt-1">
                  {vault.asset.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-600 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-gray-400 text-sm">Logo</p>
              {vault.asset.logoURI ? (
                <img
                  src={vault.asset.logoURI}
                  alt={vault.asset.symbol}
                  className="w-8 h-8 mt-2 rounded"
                />
              ) : (
                <p className="text-gray-500">No logo URI provided</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chain Info & Allocators */}
      <div className="grid grid-cols-2 gap-6">
        {/* Chain Info Card */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">⛓</span> Chain
          </h2>
          <div className="bg-[#121212] border border-gray-700 rounded-md p-4 space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Chain ID</p>
              <p className="font-medium">{vault.chain?.id}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Network</p>
              <p className="font-medium">{vault.chain?.network}</p>
            </div>
          </div>
        </div>

        {/* Allocators Card */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">👷‍♂️</span> Allocators
          </h2>
          <div className="bg-[#121212] border border-gray-700 rounded-md p-4">
            {vault.allocators && vault.allocators.length > 0 ? (
              <ul className="space-y-2">
                {vault.allocators.map((allocator, idx) => (
                  <li key={idx} className="bg-[#1E1E1E] p-2 rounded break-all">
                    {allocator.address}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No allocators found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TestInterface = () => {
  const [activeTab, setActiveTab] = useState<"SDK" | "API">("SDK");
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isFullWithdraw, setIsFullWithdraw] = useState(false);
  const [inputs, setInputs] = useState({
    vaultAddress: "0x2371e134e3455e0593363cBF89d3b6cf53740618",
    amountToDeposit: "10",
    amountToWithdraw: "5",
  });

  const client = useWalletClient();

  const {
    simulationState,
    isPending: simulationIsPending,
    error: simulationError,
  } = usePopulatedSimulationState(inputs.vaultAddress as Address);

  const {
    position,
    isLoading: positionLoading,
    error: positionError,
  } = useGetUserSDKVaultPositions(inputs.vaultAddress as Address);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const runDeposit = async () => {
    // Clear previous results first
    setTestResults([]);

    if (!client.data || !client.data.account) {
      setTestResults(["Please connect your wallet first"]);
      return;
    }

    if (simulationIsPending || !simulationState) {
      setTestResults((prev) => [
        ...prev,
        "Simulation state is still loading, please try again shortly.",
      ]);
      return;
    }

    if (simulationError) {
      setTestResults((prev) => [
        ...prev,
        `Error loading simulation state: ${simulationError}`,
      ]);
      return;
    }

    try {
      // Convert input values to BigInt using parseEther.
      const depositAmountWei = parseEther(inputs.amountToDeposit);
      const vault = await Vault.fetch(
        inputs.vaultAddress as Address,
        client.data
      );
      // Use the populated simulationState directly
      await depositUsingBundler(
        vault,
        client.data,
        simulationState,
        depositAmountWei
      );

      setTestResults((prev) => [
        ...prev,
        "Deposit via Bundler action executed successfully",
      ]);
    } catch (error: unknown) {
      console.error("Error during deposit action:", error);
      setTestResults((prev) => [
        ...prev,
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      ]);
    }
  };

  const runWithdraw = async () => {
    setTestResults([]);

    if (!client.data || !client.data.account) {
      setTestResults(["Please connect your wallet first"]);
      return;
    }

    if (simulationIsPending || !simulationState) {
      setTestResults((prev) => [
        ...prev,
        "Simulation state is still loading, please try again shortly.",
      ]);
      return;
    }

    if (simulationError) {
      setTestResults((prev) => [
        ...prev,
        `Error loading simulation state: ${simulationError}`,
      ]);
      return;
    }

    try {
      const vault = await Vault.fetch(
        inputs.vaultAddress as Address,
        client.data
      );

      let sharesToWithdraw: bigint;
      if (isFullWithdraw) {
        // For full withdraw, use the user's entire vault token balance
        if (!position) {
          throw new Error("Position data not available");
        }
        sharesToWithdraw = position.depositedAssets;
        // Update the input field to show the exact amount being withdrawn
        setInputs((prev) => ({
          ...prev,
          amountToWithdraw: formatUnits(position.depositedAssets, 18),
        }));
      } else {
        // For partial withdraw, convert the input amount to shares
        const amountToWithdraw = parseEther(inputs.amountToWithdraw);
        sharesToWithdraw = vault.toShares(amountToWithdraw);
      }

      await withdrawUsingBundler(
        vault,
        client.data,
        simulationState,
        sharesToWithdraw
      );

      setTestResults((prev) => [
        ...prev,
        "Withdraw via Bundler action executed successfully",
      ]);
    } catch (error: unknown) {
      console.error("Error during withdraw action:", error);
      setTestResults((prev) => [
        ...prev,
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      ]);
    }
  };

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
                  value={inputs.vaultAddress}
                  onChange={handleInputChange}
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
              <div className="space-y-6 mb-8">
                {/* Remove the grid-cols-3 to allow full width */}
                <div className="grid grid-cols-1 gap-8 mb-8">
                  {/* Add a nested grid for the three cards */}
                  <div className="grid grid-cols-3 gap-8">
                    {/* Current Position Card */}
                    <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="mr-2">▲</span> Current Position
                      </h2>
                      {!client.data?.account ? (
                        <div className="text-gray-500 text-sm">
                          Please connect your wallet
                        </div>
                      ) : positionLoading ? (
                        <div className="text-gray-500 text-sm">
                          Loading position...
                        </div>
                      ) : positionError ? (
                        <div className="text-red-500 text-sm">
                          {positionError}
                        </div>
                      ) : position ? (
                        <div className="space-y-4">
                          <div className="bg-[#121212] border border-gray-700 rounded-md p-3">
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm text-gray-400 mb-1">
                                  Vault Token Balance
                                </div>
                                <div className="font-medium">
                                  {formatUnits(position.depositedAssets, 18)}{" "}
                                  {position.vaultSymbol}
                                </div>
                              </div>
                              <div className="pt-4 border-t border-gray-700">
                                <div className="text-sm text-gray-400 mb-1">
                                  Underlying Equivalent
                                </div>
                                <div className="font-medium">
                                  {formatUnits(
                                    (position.depositedAssets *
                                      position.shareToUnderlying) /
                                      BigInt(1e18),
                                    18
                                  )}{" "}
                                  {position.underlyingSymbol}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No position data available
                        </div>
                      )}
                    </div>

                    {/* Deposit Card */}
                    <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
                      <h2 className="text-xl font-semibold mb-6">Deposit</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Deposit Amount (native units)
                          </label>
                          <input
                            type="text"
                            name="amountToDeposit"
                            value={inputs.amountToDeposit}
                            onChange={handleInputChange}
                            className="w-full bg-[#121212] border-[0.5px] border-gray-300 rounded p-2.5 text-sm"
                          />
                        </div>

                        <button
                          onClick={runDeposit}
                          className="w-full !bg-blue-500 hover:bg-[#0045CC] text-white py-3 rounded-md font-medium mt-6 transition-colors"
                        >
                          Deposit
                        </button>
                      </div>
                    </div>

                    {/* Withdraw Card */}
                    <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
                      <h2 className="text-xl font-semibold mb-6">Withdraw</h2>
                      <div className="space-y-4">
                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            id="fullWithdraw"
                            checked={isFullWithdraw}
                            onChange={(e) =>
                              setIsFullWithdraw(e.target.checked)
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor="fullWithdraw"
                            className="text-sm text-gray-300"
                          >
                            Full Withdraw
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Withdraw Amount (native units)
                          </label>
                          <input
                            type="text"
                            name="amountToWithdraw"
                            value={
                              isFullWithdraw && position
                                ? formatUnits(position.depositedAssets, 18)
                                : inputs.amountToWithdraw
                            }
                            onChange={handleInputChange}
                            disabled={isFullWithdraw}
                            className={`w-full bg-[#121212] border-[0.5px] border-gray-300 rounded p-2.5 text-sm ${
                              isFullWithdraw
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          />
                        </div>

                        <button
                          onClick={runWithdraw}
                          className="w-full !bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-medium mt-6 transition-colors"
                        >
                          {isFullWithdraw ? "Withdraw All" : "Withdraw"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Test Results Section */}
                  <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {testResults.length > 0 ? (
                        testResults.map((result, index) => (
                          <div
                            key={index}
                            className="bg-[#121212] border border-gray-700 rounded-md p-2 text-sm"
                          >
                            {result}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No results to display yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <VaultAPIView vaultAddress={inputs.vaultAddress} />
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
