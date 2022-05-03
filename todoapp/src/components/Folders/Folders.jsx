import styles from "./Folders.module.css";
import React, { useState, useEffect } from "react";
import Folder from "../Folder/Folder";
import { useQuery, useMutation } from "@apollo/client";
import { GET_FOLDERS } from "../../folder/graphql-query.js";
import { CREATE_FOLDER } from "../../folder/graphql-mutation.js";

export default function Folders({ getItemId }) {
  const { data, error, loading } = useQuery(GET_FOLDERS);
  const [createFolder] = useMutation(CREATE_FOLDER, {
    refetchQueries: [{ query: GET_FOLDERS }],
    // update: (store, response) => {
    //   const dataInStore = store.readQuery({ query: GET_FOLDERS }); // obtengo la data de la store despues de hacer el query all persons
    //   store.writeQuery({
    //     //reescribo el store con lo que quiero agregar
    //     query: GET_FOLDERS,
    //     data: {
    //       ...dataInStore,
    //       getFolders: [...dataInStore.getFolders, response.data.createFolder],
    //     },
    //   });
    // },
  });

  const [input, setInput] = useState({
    folderName: "",
  });

  const handleChange = ({ target }) => {
    setInput((input) => {
      const newInput = {
        ...input,
        [target.name]: target.value,
      };
      return newInput;
    });
  };

  function onSubmit(event) {
    event.preventDefault();
    createFolder({ variables: { name: input.folderName } });
    setInput({ ...input, folderName: "" });
  }

  return (
    <div className={styles.folders}>
      <h2>Folders</h2>
      <div className={styles.list}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          data &&
          data.getFolders &&
          data.getFolders.folders?.map((folder) => (
            <Folder
              key={folder.id}
              name={folder.name}
              id={folder.id}
              userId={data.getFolders.id}
              getItemId={getItemId}
            />
          ))
        )}
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.input}
          name="folderName"
          type="text"
          placeholder="New Folder"
          onChange={handleChange}
          value={input.folderName}
        />
        <button className={styles.btn} type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
