import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { skipFirstPagination } from "./skip-first-pagination";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        planets: skipFirstPagination(["where", "orderBy"]),
      },
    },
  },
});

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/darkforest-eth/dark-forest-v06-round-2",
  cache,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
