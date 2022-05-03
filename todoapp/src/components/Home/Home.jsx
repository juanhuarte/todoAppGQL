import styles from "./Home.module.css";
import React, { useState } from "react";
import Folders from "../Folders/Folders";
import Items from "../Items/Items";
import { BiUserCircle } from "react-icons/bi";
import Logout from "../Logout/Logout";

export default function Home() {
  const [itemId, setItemId] = useState({ id: null, name: "" });

  function getItemId(id, name) {
    setItemId({ id: id, name: name });
  }

  return (
    <div className={styles.createbg}>
      <div className={styles.bkg} />
      <div className={styles.icon}>
        <Logout />
        <BiUserCircle
          size="40"
          style={{
            color: "#00b4d8",
            marginTop: "1vh",
            marginRight: "2vw",
          }}
        />
      </div>
      <div className={styles.container}>
        <Folders getItemId={getItemId} />
        <Items itemId={itemId} />
      </div>
    </div>
  );
}
