import React from "react";
import ReactDOM from "react-dom/client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import { Popup } from "./Popup";
import "./index.css";

const client = new ApolloClient({
  uri: "https://medium.com/_/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Popup />
    </ApolloProvider>
  </React.StrictMode>,
);
