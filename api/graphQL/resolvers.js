import { UserInputError, AuthenticationError } from "apollo-server";
import User from "../models/user.js";
import Folder from "../models/folder.js";
import Item from "../models/item.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export const resolvers = {
  Query: {
    getFolders: (root, args, { currentUser }) => {
      return currentUser;
    },
    getItems: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const folder = await Folder.findById(args.id).populate("items");
      return folder;
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const { name, lastname, mail, password } = args;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ name, lastname, mail, password: passwordHash });
      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const { mail, password } = args;
      const user = await User.findOne({ mail });
      const passwordCorrect =
        user === null ? false : await bcrypt.compare(password, user.password);
      if (!passwordCorrect) {
        throw new UserInputError("wrong credentials");
      }
      const userForToken = {
        mail: user.mail,
        id: user._id,
      };
      return {
        value: jwt.sign(userForToken, JWT_SECRET),
      };
    },
    createFolder: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const folder = await Folder.findOne({
        name: args.name,
        user: currentUser._id,
      });

      const noneFolderAlready = (folder) =>
        !currentUser.folders
          .map((f) => f._id.toString())
          .includes(folder._id.toString());
      if ((folder && noneFolderAlready(folder)) || !folder) {
        const newFolder = new Folder({
          name: args.name,
          user: currentUser._id,
        });
        try {
          const saveFolder = await newFolder.save();
          currentUser.folders = currentUser.folders.concat(saveFolder);
          await currentUser.save();
          return currentUser;
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }
      if (folder && !noneFolderAlready(folder)) return currentUser;
    },
    deleteFolder: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const deletedFolder = await Folder.findOneAndDelete({
        name: args.name,
        user: currentUser._id,
      });

      if (deletedFolder === null)
        throw new UserInputError("This folder doesnt exist");
      await Item.deleteMany({ folder: deletedFolder._id });
      currentUser.folders = currentUser.folders.filter(
        (f) => f.name !== args.name
      );
      await currentUser.save();
      return currentUser;
    },
    createItem: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const folder = await Folder.findById(args.id).populate("items");
      const item = await Item.findOne({
        description: args.description,
        folder: folder._id,
      });
      const noneItemAlready = (item) =>
        !folder.items
          .map((i) => i._id.toString())
          .includes(item._id.toString());
      if ((item && noneItemAlready(item)) || !item) {
        const newItem = new Item({
          description: args.description,
          status: args.status,
          folder: folder._id,
        });
        try {
          const saveItem = await newItem.save();
          folder.items = folder.items.concat(saveItem);
          await folder.save();
          return folder;
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }
      if (item && !noneItemAlready(item)) return folder;
    },
    deleteItem: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const folder = await Folder.findById(args.id).populate("items");
      const deletedItem = await Item.deleteMany({
        description: args.description,
        folder: args.id,
      });
      if (deletedItem === null)
        throw new UserInputError("This folder doesnt exist");
      folder.items = folder.items.filter(
        (i) => i.description !== args.description
      );
      await folder.save();
      return folder;
    },
    updateItem: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const item = await Item.findById(args.id);
      if (item === null) throw new UserInputError("This item doesnt exist");
      item.description = args.description;
      item.status = args.status;
      try {
        await item.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return item;
    },
  },
};
