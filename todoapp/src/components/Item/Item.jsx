import styles from "./Item.module.css";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_ITEM, DELETE_ITEM } from "../../item/graphql-mutation.js";
import { GET_ITEMS } from "../../item/graphql-query.js";

export default function Item({ name, id, status, folderId }) {
  const [editItem, result] = useMutation(UPDATE_ITEM);
  const [deleteItem] = useMutation(DELETE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }],
  });
  const [edit, setEdit] = useState(false);
  const [check, setCheck] = useState(status);

  function handleEdit(e) {
    e.preventDefault();
    setEdit(true);
  }

  function handleCancel(e) {
    e.preventDefault();
    setEdit(false);
  }

  function handleDelete(e) {
    e.preventDefault();
    deleteItem({ variables: { id: folderId, description: name } });
  }

  const handleStatus = ({ target }) => {
    setCheck(target.value);
    editItem({ variables: { id, description: name, status: !check } });
  };

  const [changeDescription, setChangeDescription] = useState({
    description: "",
  });

  function handleEditChange({ target }) {
    setChangeDescription((input) => {
      const newInput = {
        ...input,
        [target.name]: target.value,
      };
      return newInput;
    });
  }

  function onSubmitEditItem(e) {
    e.preventDefault();
    editItem({
      variables: {
        id,
        description: changeDescription.description,
        status: status,
      },
    });
    setEdit(false);
    setChangeDescription({ description: "" });
  }

  return !edit ? (
    <div className={styles.container}>
      <input
        className={styles.checkbox}
        type="checkbox"
        name={id}
        value={status}
        defaultChecked={status}
        onChange={handleStatus}
      />
      <p className={styles.text}>{name}</p>
      <button className={styles.button} onClick={(e) => handleEdit(e)}>
        Edit
      </button>
      <button className={styles.button} onClick={(e) => handleDelete(e)}>
        Remove
      </button>
    </div>
  ) : (
    <div className={styles.items}>
      <h3 className={styles.title}>Editing Task: "{name}"</h3>
      <form className={styles.editForm} onSubmit={onSubmitEditItem}>
        <input
          className={styles.input}
          name="description"
          type="text"
          placeholder={name}
          onChange={handleEditChange}
          value={changeDescription.description}
        />
        <div className={styles.buttonContainer}>
          <button className={styles.btn} type="submit">
            Save
          </button>
          <button className={styles.btn} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
