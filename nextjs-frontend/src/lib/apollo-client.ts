import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

const DRUPAL_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_DRUPAL_GRAPHQL_URL ||
  "http://localhost:8888/graphql";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: DRUPAL_GRAPHQL_URL,
      fetchOptions: { cache: "no-store" },
    }),
  });
});
