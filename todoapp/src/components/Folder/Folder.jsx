import styles from "./Folder.module.css";
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_FOLDER } from "../../folder/graphql-mutation.js";
import { GET_FOLDERS } from "../../folder/graphql-query.js";

export default function Folder({ name, id, getItemId }) {
  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    refetchQueries: [{ query: GET_FOLDERS }],
  });

  function handleView(e) {
    e.preventDefault();
    getItemId(id, name);
  }

  function handleDelete(e) {
    e.preventDefault();
    deleteFolder({ variables: { name } });
  }
  return (
    <div className={styles.container}>
      <p className={styles.text}>- {name}</p>
      <button className={styles.button} onClick={(e) => handleView(e)}>
        View Items
      </button>
      <button className={styles.button} onClick={(e) => handleDelete(e)}>
        Remove
      </button>
    </div>
  );
}
