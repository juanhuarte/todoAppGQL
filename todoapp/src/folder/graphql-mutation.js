import { gql } from "@apollo/client";

export const CREATE_FOLDER = gql`
  mutation createFolder($name: String!) {
    createFolder(name: $name) {
      folders {
        name
        id
      }
      id
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation deleteFolder($name: String!) {
    deleteFolder(name: $name) {
      folders {
        name
        id
      }
      id
    }
  }
`;
