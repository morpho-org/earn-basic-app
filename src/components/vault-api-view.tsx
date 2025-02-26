import { Address, formatUnits } from "viem";
import { useGetVaultDisplayQuery } from "../graphql/__generated__/GetVaultDisplay.query.generated";

export function VaultAPIView({ vaultAddress }: { vaultAddress: Address }) {
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
}
