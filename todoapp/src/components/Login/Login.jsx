import frontPage from "../../Images/todoList.jpg";
import styles from "./Login.module.css";
import React, { useState, useEffect } from "react";
import Register from "../Register/Register";
import { useHistory } from "react-router-dom";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN } from "../../user/graphql-mutation.js";

export default function Login() {
  const client = useApolloClient();
  const history = useHistory();
  const [invalidUser, setInvalidUser] = useState(null);
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setInvalidUser(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      localStorage.setItem("logUser", token);
      client.link.options.headers.authorization = `bearer ${token}`;
      history.push("/home");
    }
  }, [result.data]);

  const [input, setInput] = useState({
    mail: "",
    password: "",
  });

  const [pressed, setPressed] = useState(true);
  function handlePress(e) {
    e.preventDefault();
    setInvalidUser(null);
    login({ variables: { mail: input.mail, password: input.password } });
  }

  function onPress(e, boolean) {
    e.preventDefault();
    setPressed(boolean);
  }

  function onChange({ target }) {
    setInput((input) => {
      const newInput = {
        ...input,
        [target.name]: target.value,
      };
      return newInput;
    });
  }

  return (
    <div className={styles.container}>
      <img className={styles.img} src={frontPage} alt="login" />
      {pressed ? (
        <form className={styles.form}>
          <h1 className={styles.title}>To-Do-List</h1>
          <input
            type="mail"
            name="mail"
            placeholder="Mail"
            className={styles.input}
            value={input.mail}
            onChange={onChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            value={input.password}
            onChange={onChange}
          />
          {invalidUser && (
            <p className={styles.text}>Usuario o contraseña incorrectos</p>
          )}
          <button onClick={(e) => handlePress(e)} className={styles.btn}>
            Sign in
          </button>
          <div className={styles.account}>
            <p>Don't have an account?</p>
            <button
              className={styles.button}
              onClick={(e) => onPress(e, false)}
            >
              Sign up
            </button>
          </div>
        </form>
      ) : (
        <Register setPressed={setPressed} onPress={onPress} />
      )}
    </div>
  );
}
