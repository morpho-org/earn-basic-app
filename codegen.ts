import type { CodegenConfig } from "@graphql-codegen/cli";

import { BLUE_API_GRAPHQL_URL } from "@morpho-org/morpho-ts";

const config: CodegenConfig = {
  overwrite: true,
  schema: BLUE_API_GRAPHQL_URL,
  documents: ["src/**/*.{query,fragment}.gql"],
  generates: {
    "src/": {
      preset: "near-operation-file",
      plugins: [
        "typescript-operations",
        "typescript-react-apollo",
        "./src/plugin/codegen/bigIntFieldMapGenerator.cjs",
      ],
      presetConfig: {
        baseTypesPath: "~@morpho-org/blue-api-sdk",
        folder: "__generated__",
      },
      config: {
        dedupeFragments: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
          defaultValue: true,
        },
        scalars: {
          BigInt: {
            input: `Types.Scalars["BigInt"]["input"]`,
            output: `Types.Scalars["BigInt"]["output"]`,
          },
          HexString: {
            input: `Types.Scalars["HexString"]["input"]`,
            output: `Types.Scalars["HexString"]["output"]`,
          },
          Address: {
            input: `Types.Scalars["Address"]["input"]`,
            output: `Types.Scalars["Address"]["output"]`,
          },
          MarketId: {
            input: `Types.Scalars["MarketId"]["input"]`,
            output: `Types.Scalars["MarketId"]["output"]`,
          },
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
