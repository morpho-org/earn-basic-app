import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { typePolicies } from "@morpho-org/blue-api-sdk";

// Add toJSON method to BigInt for proper serialization
// @ts-expect-error - BigInt.prototype.toJSON is not defined in global scope
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://blue-api.morpho.org/graphql",
  }),
  cache: new InMemoryCache({
    typePolicies,
  }),
});
