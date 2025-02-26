// src/hooks/usePopulatedSimulationState.ts
import { useMemo } from "react";
import { useBlock, useWalletClient } from "wagmi";
import { getChainAddresses, MarketId } from "@morpho-org/blue-sdk";
import {
  SimulationStateLike,
  useSimulationState,
  UseSimulationStateReturnType,
} from "@morpho-org/simulation-sdk-wagmi";
import { Address, ReadContractErrorType } from "viem";

export const usePopulatedSimulationState = (vaultAddress: Address) => {
  const { data: client } = useWalletClient();
  const { data: block } = useBlock({
    chainId: undefined,
    watch: true,
  });

  const targetChainId = client?.chain.id ?? 1;
  // If we're on Anvil (31337), use mainnet addresses for testing
  const effectiveChainId = targetChainId === 31337 ? 1 : (targetChainId ?? 1);

  // Derive the bundler address from the SDK for the current chain
  // Use effectiveChainId instead of targetChainId
  const bundler = useMemo(() => {
    const chainAddresses = getChainAddresses(effectiveChainId);
    return chainAddresses?.bundler;
  }, [effectiveChainId]);

  // Create the list of users (only the account and bundler, for example)
  const users = useMemo(() => {
    const list: string[] = [];
    if (client?.account?.address) list.push(client.account.address);
    if (bundler) list.push(bundler);
    if (vaultAddress) list.push(vaultAddress);
    return list;
  }, [client?.account?.address, bundler, vaultAddress]);

  // Use effectiveChainId for tokens
  const tokens = useMemo<Address[]>(() => {
    const chainAddresses = getChainAddresses(effectiveChainId);

    const weth = chainAddresses.wNative;
    const wstEth = chainAddresses.wstEth ?? "0x";
    const vaultToken = vaultAddress;
    return [weth, wstEth, vaultToken];
  }, [vaultAddress, effectiveChainId]);

  // if any vaults are needed, add them here
  const vaults = useMemo<string[]>(() => [vaultAddress], [vaultAddress]);
  // Helper function to extract a meaningful error message
  const getSimulationErrorMessage = (
    error: SimulationStateLike<ReadContractErrorType | null>
  ): string | null => {
    if (!error) return null;
    if (error instanceof Error) return error.message;
    // Define keys that represent error details from the simulation
    const errorKeys = [
      "global",
      "markets",
      "users",
      "tokens",
      "vaults",
      "positions",
      "holdings",
      "vaultMarketConfigs",
      "vaultUsers",
    ];

    // Check if at least one key has a non-null/non-undefined error value.
    // For the global error, check its nested property.
    const hasRealError = errorKeys.some((key) => {
      if (key === "global") {
        return error.global?.feeRecipient != null;
      }
      // @ts-expect-error error is a SimulationStateLike
      return error[key] != null;
    });
    return hasRealError ? JSON.stringify(error, null, 2) : null;
  };

  let simulation: UseSimulationStateReturnType;

  try {
    simulation = useSimulationState({
      marketIds: [
        "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e" as MarketId, //wstETH/WETH
        "0x138eec0e4a1937eb92ebc70043ed539661dd7ed5a89fb92a720b341650288a40" as MarketId, //WBTC/WETH
        "0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d" as MarketId, //wstETH/WETH
        "0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41" as MarketId, //wstETH/WETH
        "0x3c83f77bde9541f8d3d82533b19bbc1f97eb2f1098bb991728acbfbede09cc5d" as MarketId, //reth/WETH
        "0x2cbfb38723a8d9a2ad1607015591a78cfe3a5949561b39bde42c242b22874ec0" as MarketId, //cbBTC/WETH
        "0x1929f8139224cb7d5db8c270addc9ce366d37ad279e1135f73c0adce74b0f936" as MarketId, //sDAI/WETH
        "0x58e212060645d18eab6d9b2af3d56fbc906a92ff5667385f616f662c70372284" as MarketId, //sUSDC/WETH
      ],
      users: users as `0x${string}`[],
      tokens: tokens as `0x${string}`[],
      vaults: vaults as `0x${string}`[],
      block: block
        ? {
            number: block.number,
            timestamp: block.timestamp,
          }
        : undefined,
    });

    const errorMessage = getSimulationErrorMessage(simulation.error);
    if (errorMessage) {
      console.error("Simulation error details:", {
        error: simulation.error,
        errorMessage,
      });
    }
  } catch (error) {
    console.error("Error in useSimulationState:", {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }

  return {
    simulationState: simulation.data,
    isPending: simulation.isPending,
    error: getSimulationErrorMessage(simulation.error),
    config: {
      users,
      tokens,
      vaults,
    },
  };
};
