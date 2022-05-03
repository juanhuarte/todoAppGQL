import React, { useEffect, useState } from "react";
import styles from "./Register.module.css";
import { validationFunc } from "./validationFunc";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../user/graphql-mutation.js";

export default function Register({ onPress, setPressed }) {
  const [mailUsed, setMailUsed] = useState(null);
  const [createUSer, result] = useMutation(CREATE_USER, {
    onError: (error) => {
      setMailUsed(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      alert("Usuario Creado");
      setPressed(true);
    }
  }, [result.data]);

  useEffect(() => {
    if (mailUsed) {
      setInput((input) => {
        const newInput = {
          ...input,
          mail: "",
        };
        return newInput;
      });
      alert("Email no valido");
    }
  }, [mailUsed]);

  const [input, setInput] = useState({
    name: "",
    lastName: "",
    mail: "",
    password: "",
    rePassword: "",
  });

  const [inputFullfilled, setInputFullfilled] = useState(false);
  const [readyToDispatch, setReadyToDispatch] = useState(false);
  const [errors, setErrors] = useState({});

  function onChange({ target }) {
    setInput((input) => {
      const newInput = {
        ...input,
        [target.name]: target.value,
      };
      const errors = validationFunc(newInput);
      setErrors(errors);
      if (!Object.keys(errors).length) {
        setReadyToDispatch(true);
      } else setReadyToDispatch(false);
      return newInput;
    });
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (readyToDispatch === true) {
      createUSer({
        variables: {
          name: input.name,
          lastname: input.lastName,
          mail: input.mail,
          password: input.password,
        },
      });
      setReadyToDispatch(false);
    } else {
      setInputFullfilled(true);
      const errors = validationFunc(input);
      setErrors(errors);
      alert("Todos los casilleros son obligatorios");
    }
  };
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <h1 className={styles.title}>To-Do-List</h1>
      <input
        type="text"
        name="name"
        placeholder="First Name"
        className={styles.input}
        value={input.name}
        onChange={onChange}
      />
      {inputFullfilled && errors.name && (
        <p className={styles.text}>{errors.name}</p>
      )}
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        className={styles.input}
        value={input.lastName}
        onChange={onChange}
      />
      {inputFullfilled && errors.lastName && (
        <p className={styles.text}>{errors.lastName}</p>
      )}
      <input
        type="email"
        name="mail"
        placeholder="Mail"
        className={styles.input}
        value={input.mail}
        onChange={onChange}
      />
      {inputFullfilled && errors.mail && (
        <p className={styles.text}>{errors.mail}</p>
      )}
      <input
        type="password"
        name="password"
        placeholder="Password"
        className={styles.input}
        value={input.password}
        onChange={onChange}
      />
      {inputFullfilled && errors.password && (
        <p className={styles.text}>{errors.password}</p>
      )}
      <input
        type="password"
        name="rePassword"
        placeholder="Repeat Password"
        className={styles.input}
        value={input.rePassword}
        onChange={onChange}
      />
      {inputFullfilled && errors.rePassword && (
        <p className={styles.text}>{errors.rePassword}</p>
      )}
      <button
        disabled={
          !input.name ||
          !input.lastName ||
          !input.mail ||
          !input.password ||
          !input.rePassword
            ? true
            : false
        }
        type="submit"
        className={styles.btn}
      >
        Sign up
      </button>
      <div className={styles.account}>
        <p>Already have an account?</p>
        <button className={styles.button} onClick={(e) => onPress(e, true)}>
          Sign in
        </button>
      </div>
    </form>
  );
}
