import { DEFAULT_SLIPPAGE_TOLERANCE, Vault } from "@morpho-org/blue-sdk";
import "@morpho-org/blue-sdk-viem/lib/augment";
import { SimulationState } from "@morpho-org/simulation-sdk";

import { setupBundle } from "./helpers.js";
import { WalletClient } from "viem";

export const depositUsingBundler = async (
  vault: Vault,
  client: WalletClient,
  simulationState: SimulationState,
  amountToDeposit: bigint
) => {
  const user = client.account?.address;
  if (!user) throw new Error("User address is required");
  return setupBundle(client, simulationState, [
    {
      type: "MetaMorpho_Deposit",
      sender: user,
      address: vault.address,
      args: {
        assets: amountToDeposit,
        owner: user,
        slippage: DEFAULT_SLIPPAGE_TOLERANCE,
      },
    },
  ]);
};

export const withdrawUsingBundler = async (
  vault: Vault,
  client: WalletClient,
  simulationState: SimulationState,
  sharesToWithdraw: bigint
) => {
  const user = client.account?.address;
  if (!user) throw new Error("User address is required");

  return setupBundle(client, simulationState, [
    {
      type: "MetaMorpho_Withdraw",
      sender: user,
      address: vault.address,
      args: {
        shares: sharesToWithdraw,
        owner: user,
        receiver: user,
        slippage: DEFAULT_SLIPPAGE_TOLERANCE,
      },
    },
  ]);
};
