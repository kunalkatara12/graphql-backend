import app from "./app.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs: `
        type User{
            id:ID!
            name:String!
            username:String!
            email:String!
            phone:String!
            website:String!
        }
        type Todo{
            id:ID!
            title:String!
            completed:Boolean
            user:User
        }
        type Query{
            getTodos:[Todo]
            getUsers:[User]
            getUser(id:ID!):User
        }
        `,
    resolvers: {
      Todo: {
        user: async (parent) => {
          return await axios
            .get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`)
            .then((res) => res.data);
        },
      },
      Query: {
        getTodos: async () => {
          return await axios
            .get("https://jsonplaceholder.typicode.com/todos")
            .then((res) => res.data);
        },
        getUsers: async () => {
          return await axios
            .get("https://jsonplaceholder.typicode.com/users")
            .then((res) => res.data);
        },
        getUser: async (parent, { id }) => {
          return await axios
            .get(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then((res) => res.data);
        },
      },
    },
  });
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(8000, () => {
    console.log("Server started at port 8000");
  });
}
startApolloServer();
