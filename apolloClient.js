import { setContext } from "@apollo/client/link/context";
// import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";
const httpLink = createHttpLink({
  uri: "http://localhost:5000/", 
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
