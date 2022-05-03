import { gql } from "@apollo/client";

export const GET_FOLDERS = gql`
  query {
    getFolders {
      folders {
        name
        id
      }
      id
    }
  }
`;
