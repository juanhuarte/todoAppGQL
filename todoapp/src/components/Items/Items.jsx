import styles from "./Items.module.css";
import React, { useState, useEffect } from "react";
import Item from "../Item/Item";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_ITEMS } from "../../item/graphql-query.js";
import { CREATE_ITEM } from "../../item/graphql-mutation.js";

export default function Items({ itemId }) {
  const [getItems, result] = useLazyQuery(GET_ITEMS);
  const [createItem] = useMutation(CREATE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }],
  });

  useEffect(() => {
    if (itemId.id) getItems({ variables: { id: itemId.id } });
  }, [itemId.id]);

  const [input, setInput] = useState({
    itemName: "",
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

  function onSubmitItem(event) {
    event.preventDefault();
    createItem({
      variables: { id: itemId.id, description: input.itemName, status: false },
    });
    setInput({ ...input, itemName: "" });
  }
  return (
    <div className={styles.items}>
      <h2>Folder: {itemId.name} </h2>
      <div className={styles.list}>
        {itemId.id === null ? (
          <p>Please select folder</p>
        ) : result.data && result.data.getItems.items.length === 0 ? (
          <p className={styles.text}>This folder is empty</p>
        ) : (
          result.data &&
          result.data.getItems.items?.map((item) => (
            <Item
              key={item.id}
              name={item.description}
              status={item.status}
              id={item.id}
              folderId={result.data.getItems.id}
            />
          ))
        )}
      </div>
      <form className={styles.form} onSubmit={onSubmitItem}>
        <input
          className={styles.input}
          name="itemName"
          type="text"
          placeholder="New Task"
          onChange={handleChange}
          value={input.itemName}
        />
        <button className={styles.btn} type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
