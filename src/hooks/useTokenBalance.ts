import { useEffect, useState } from "react";
import { Address, Holding, Token } from "@morpho-org/blue-sdk";
import { useWalletClient } from "wagmi";

interface TokenBalance {
  balance: bigint;
  symbol: string;
  decimals: number;
  address: Address;
}

export function useTokenBalance(tokenAddress: Address) {
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: client } = useWalletClient();

  useEffect(() => {
    if (!client?.account) return;

    const fetchBalance = async () => {
      try {
        const [holding, token] = await Promise.all([
          Holding.fetch(client.account.address, tokenAddress, client),
          Token.fetch(tokenAddress, client),
        ]);

        setTokenBalance({
          balance: holding.balance,
          symbol: token.symbol ?? "",
          decimals: token.decimals,
          address: tokenAddress,
        });
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch token balance"
        );
        setTokenBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [client, tokenAddress]);

  return { tokenBalance, isLoading, error };
}
