import { useEffect, useState } from "react";
import { Address, Holding, Token, Vault, MathLib } from "@morpho-org/blue-sdk";
import { useWalletClient } from "wagmi";
import "@morpho-org/blue-sdk-viem/lib/augment";

interface EnhancedPosition {
  depositedAssets: bigint;
  shareToUnderlying: bigint;
  vaultSymbol: string;
  underlyingSymbol: string;
  underlyingAddress: Address;
}

export function useGetUserSDKVaultPositions(vaultAddress: Address) {
  const [position, setPosition] = useState<EnhancedPosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: client } = useWalletClient();

  useEffect(() => {
    if (!client?.account) return;

    const fetchPosition = async () => {
      try {
        const [holding, vault] = await Promise.all([
          Holding.fetch(client.account.address, vaultAddress, client),
          Vault.fetch(vaultAddress, client),
        ]);
        const underlyingAsset = vault.underlying;

        const shareToUnderlying = MathLib.wDivDown(
          vault.totalAssets,
          vault.totalSupply
        );
        const token = await Token.fetch(underlyingAsset, client);

        setPosition({
          depositedAssets: holding.balance,
          shareToUnderlying,
          vaultSymbol: vault.symbol,
          underlyingSymbol: token.symbol ?? "",
          underlyingAddress: underlyingAsset,
        });
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch position"
        );
        setPosition(null);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchPosition();
    const interval = setInterval(fetchPosition, 10000);

    return () => clearInterval(interval);
  }, [client, vaultAddress]);

  return { position, isLoading, error };
}
