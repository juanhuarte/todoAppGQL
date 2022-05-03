import styles from "./Logout.module.css";
import React from "react";
import { useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

export default function Logout() {
  const client = useApolloClient();
  const history = useHistory();
  const handleClick = (e) => {
    e.preventDefault();
    localStorage.clear();
    client.resetStore();
    history.push("/");
  };
  return (
    <button onClick={handleClick} className={styles.btn}>
      Logout
    </button>
  );
}
