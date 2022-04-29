import { ApolloServer } from "apollo-server";
import "./db.js"; // importa para que se conecte a la base de datos
import jwt from "jsonwebtoken";
import { typeDefinitions } from "./graphQL/typeDefinition.js";
import { resolvers } from "./graphQL/resolvers.js";
import User from "./models/user.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
  context: async ({ req }) => {
    // tiene una funcion que tiene como argumento una req y se va a ejecutar cada vez que llegue una peticion a nuestro servidor pasa por esta funcion. podemos devolver un objeto qeu va a estar disponible en nuestros resolvers como "context" para usar el token
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.substring(7);
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id).populate({
        path: "folders",
        model: "Folder",
        populate: {
          path: "items",
          model: "Item",
        },
      }); // con el populate lo que hace es teniendo el usuario y a buscar a sus carpetas
      return { currentUser };
    }
  },
});

//iniciamos el servidor
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
