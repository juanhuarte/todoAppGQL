import { gql } from "@apollo/client";

export const GET_ITEMS = gql`
  query getItemsById($id: ID!) {
    getItems(id: $id) {
      id
      items {
        description
        status
        id
      }
    }
  }
`;
