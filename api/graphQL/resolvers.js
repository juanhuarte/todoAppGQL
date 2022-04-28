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
      const folder = await Folder.findOne({ name: args.name });

      const noneFolderAlready = (folder) =>
        !currentUser.folders
          .map((f) => f._id.toString())
          .includes(folder._id.toString());
      if (folder && noneFolderAlready(folder)) {
        currentUser.folders = currentUser.folders.concat(folder);
        await currentUser.save();
        return currentUser;
      }
      if (folder && !noneFolderAlready(folder)) return currentUser;

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
    },
    deleteFolder: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const deletedFolder = await Folder.findOneAndDelete({ name: args.name });
      if (deletedFolder === null)
        throw new UserInputError("This folder doesnt exist");
      //const saveDeletedFolder = await deletedFolder.save();
      //console.log("2", saveDeletedFolder);
      currentUser.folders = currentUser.folders.filter(
        (f) => f.name !== deletedFolder.name
      );
      await currentUser.save();
      return currentUser;
    },
  },
};
