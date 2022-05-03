import { gql } from "@apollo/client";

export const CREATE_ITEM = gql`
  mutation createItem($id: ID!, $description: String!, $status: Boolean!) {
    createItem(id: $id, description: $description, status: $status) {
      name
      id
      items {
        description
        status
        id
      }
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation deleteItem($id: ID!, $description: String!) {
    deleteItem(id: $id, description: $description) {
      name
      id
      items {
        description
        status
        id
      }
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation updateItem($id: ID!, $description: String!, $status: Boolean!) {
    updateItem(id: $id, description: $description, status: $status) {
      description
      status
      id
    }
  }
`;
