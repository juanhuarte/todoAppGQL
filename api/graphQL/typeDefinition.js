import { gql } from "apollo-server";

export const typeDefinitions = gql`
  type User {
    name: String!
    lastname: String!
    mail: String!
    password: String!
    folders: [Folder]!
    id: ID!
  }

  type Folder {
    name: String!
    items: [Item]!
    id: ID!
  }

  type Item {
    description: String!
    status: Boolean!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    getFolders: User
    getItems(name: String!): Folder
  }

  type Mutation {
    createUser(
      name: String!
      lastname: String!
      mail: String!
      password: String!
    ): User
    login(mail: String!, password: String!): Token
    createFolder(name: String!): User
    deleteFolder(name: String!): User
    createItem(name: String!, description: String!, status: Boolean!): Folder
    deleteItem(name: String!, description: String!): Folder
    updateItem(name: String!, description: String!, status: Boolean!): Item
  }
`;
