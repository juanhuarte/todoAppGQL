import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const getAuth = () => {
  const token = localStorage.getItem("logUser");
  return token ? `bearer ${token}` : null;
};

const client = new ApolloClient({
  //connectToDevTools: true,
  cache: new InMemoryCache(),
  link: new HttpLink({
    headers: {
      authorization: getAuth(),
    },
    uri: "http://localhost:4000",
  }),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);
