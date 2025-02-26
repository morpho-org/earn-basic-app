//src/service/helpers.ts

import {
  type BundlingOptions,
  type InputBundlerOperation,
  encodeBundle,
  finalizeBundle,
  populateBundle,
} from "@morpho-org/bundler-sdk-viem";

import { withSimplePermit } from "@morpho-org/morpho-test";
import { type SimulationState } from "@morpho-org/simulation-sdk";

import { type Account, type Address, type WalletClient } from "viem";
import { parseAccount } from "viem/accounts";

export const setupBundle = async (
  client: WalletClient,
  startData: SimulationState,
  inputOperations: InputBundlerOperation[],
  {
    account: account_ = client.account,
    supportsSignature,
    unwrapTokens,
    unwrapSlippage,
    onBundleTx,
    ...options
  }: BundlingOptions & {
    account?: Address | Account;
    supportsSignature?: boolean;
    unwrapTokens?: Set<Address>;
    unwrapSlippage?: bigint;
    onBundleTx?: (data: SimulationState) => Promise<void> | void;
  } = {}
) => {
  if (!account_) throw new Error("Account is required");
  const account = parseAccount(account_);

  let { operations } = populateBundle(inputOperations, startData, {
    ...options,
    withSimplePermit: new Set([
      ...withSimplePermit[startData.chainId],
      ...(options?.withSimplePermit ?? []),
    ]),
    publicAllocatorOptions: {
      enabled: true,
      ...options.publicAllocatorOptions,
    },
  });
  operations = finalizeBundle(
    operations,
    startData,
    account.address,
    unwrapTokens,
    unwrapSlippage
  );

  const bundle = encodeBundle(operations, startData, supportsSignature);

  await onBundleTx?.(startData);

  // here EOA should sign tx
  await Promise.all(
    bundle.requirements.signatures.map((requirement) =>
      requirement.sign(client, account)
    )
  );

  const txs = bundle.requirements.txs.map(({ tx }) => tx).concat([bundle.tx()]);

  for (const tx of txs) {
    await client.sendTransaction(
      // @ts-expect-error bypassing type check
      { ...tx, account }
    );
  }

  return { operations, bundle };
};
