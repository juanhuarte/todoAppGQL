import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser(
    $name: String!
    $lastname: String!
    $mail: String!
    $password: String!
  ) {
    createUser(
      name: $name
      lastname: $lastname
      mail: $mail
      password: $password
    ) {
      name
      lastname
      mail
      password
      id
    }
  }
`;

export const LOGIN = gql`
  mutation login($mail: String!, $password: String!) {
    login(mail: $mail, password: $password) {
      value
    }
  }
`;
