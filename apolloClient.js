import { setContext } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
// import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";

const AUTH_LOGOUT_EVENT = "auth:logout";

const httpLink = createHttpLink({
 uri: import.meta.env.VITE_BACKEND_API_URL,

});

const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
  client.clearStore().catch(() => {});
};

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  if (!CombinedGraphQLErrors.is(error)) return;

  const isUnauthenticated = error.errors.some(
    (graphQLError) => graphQLError.extensions?.code === "UNAUTHENTICATED"
  );

  if (isUnauthenticated) {
    clearAuthSession();
  }
});

export const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});
