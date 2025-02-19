import * as Types from "@morpho-org/blue-api-sdk";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type GetVaultDisplayQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetVaultDisplayQuery = {
  __typename?: "Query";
  vaultByAddress: {
    __typename?: "Vault";
    whitelisted: boolean;
    name: string;
    address: Types.Scalars["Address"]["output"];
    symbol: string;
    creationBlockNumber: number;
    creationTimestamp: Types.Scalars["BigInt"]["output"];
    creatorAddress: Types.Scalars["Address"]["output"] | null;
    liquidity: {
      __typename?: "VaultLiquidity";
      underlying: Types.Scalars["BigInt"]["output"];
      usd: number;
    } | null;
    asset: {
      __typename?: "Asset";
      address: Types.Scalars["Address"]["output"];
      symbol: string;
      name: string;
      decimals: number;
      priceUsd: number | null;
      tags: Array<string> | null;
      logoURI: string | null;
      chain: { __typename?: "Chain"; id: number };
    };
    metadata: {
      __typename?: "VaultMetadata";
      description: string;
      image: string;
      curators: Array<{
        __typename?: "VaultMetadataCurator";
        image: string;
        name: string;
      }>;
    } | null;
    state: {
      __typename?: "VaultState";
      allocation: Array<{
        __typename?: "VaultAllocation";
        supplyAssets: Types.Scalars["BigInt"]["output"];
        supplyAssetsUsd: number | null;
        market: {
          __typename?: "Market";
          uniqueKey: Types.Scalars["MarketId"]["output"];
          collateralAsset: {
            __typename?: "Asset";
            address: Types.Scalars["Address"]["output"];
            symbol: string;
            name: string;
            decimals: number;
            priceUsd: number | null;
            tags: Array<string> | null;
            logoURI: string | null;
            chain: { __typename?: "Chain"; id: number };
          } | null;
        };
      }> | null;
    } | null;
    allocators: Array<{
      __typename?: "VaultAllocator";
      address: Types.Scalars["Address"]["output"];
    }> | null;
    chain: { __typename?: "Chain"; id: number; network: string };
    factory: {
      __typename?: "VaultFactory";
      address: Types.Scalars["Address"]["output"];
    };
  };
};

export const GetVaultDisplayDocument = gql`
  query GetVaultDisplay {
    vaultByAddress(
      address: "0x2371e134e3455e0593363cBF89d3b6cf53740618"
      chainId: 1
    ) {
      whitelisted
      name
      address
      symbol
      liquidity {
        underlying
        usd
      }
      asset {
        address
        symbol
        name
        decimals
        priceUsd
        tags
        logoURI
        chain {
          id
        }
      }
      metadata {
        description
        image
        curators {
          image
          name
        }
      }
      state {
        allocation {
          supplyAssets
          supplyAssetsUsd
          market {
            uniqueKey
            collateralAsset {
              address
              symbol
              name
              decimals
              priceUsd
              tags
              logoURI
              chain {
                id
              }
            }
          }
        }
      }
      allocators {
        address
      }
      chain {
        id
        network
      }
      creationBlockNumber
      creationTimestamp
      creatorAddress
      factory {
        address
      }
    }
  }
`;

/**
 * __useGetVaultDisplayQuery__
 *
 * To run a query within a React component, call `useGetVaultDisplayQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVaultDisplayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVaultDisplayQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVaultDisplayQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetVaultDisplayQuery,
    GetVaultDisplayQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetVaultDisplayQuery, GetVaultDisplayQueryVariables>(
    GetVaultDisplayDocument,
    options,
  );
}
export function useGetVaultDisplayLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVaultDisplayQuery,
    GetVaultDisplayQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetVaultDisplayQuery,
    GetVaultDisplayQueryVariables
  >(GetVaultDisplayDocument, options);
}
export function useGetVaultDisplaySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetVaultDisplayQuery,
        GetVaultDisplayQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetVaultDisplayQuery,
    GetVaultDisplayQueryVariables
  >(GetVaultDisplayDocument, options);
}
export type GetVaultDisplayQueryHookResult = ReturnType<
  typeof useGetVaultDisplayQuery
>;
export type GetVaultDisplayLazyQueryHookResult = ReturnType<
  typeof useGetVaultDisplayLazyQuery
>;
export type GetVaultDisplaySuspenseQueryHookResult = ReturnType<
  typeof useGetVaultDisplaySuspenseQuery
>;
export type GetVaultDisplayQueryResult = Apollo.QueryResult<
  GetVaultDisplayQuery,
  GetVaultDisplayQueryVariables
>;

type BigIntFieldMap = {
  [key: string]: boolean | BigIntFieldMap;
};
export const getVaultDisplayBigIntFieldMap: BigIntFieldMap = {
  vaultByAddress: {
    liquidity: {
      underlying: true,
    },
    state: {
      allocation: {
        supplyAssets: true,
      },
    },
    creationTimestamp: true,
  },
};
