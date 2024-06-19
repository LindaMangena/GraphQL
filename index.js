import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

//db
import db from "./_db.js";

//types
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    },

    authors() {
      return db.authors;
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
  },

  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((a) => a.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((g) => g.id === parent.game_id);
    },
  },
  Mutation: {
    delete(_, args) {
      db.games = db.games.filter((g) => g.id !== args.id);
      return db.games;
    },

    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString(), // Ensure unique ID generation
      };
      db.games.push(game);
      return game;
    },

    updateGame(_, args) {
      // Update db.games by mapping over it and modifying the game that matches the id
      db.games = db.games.map((g) => {
        if (g.id === args.id) {
          // Check if the current game's id matches the provided id
          return { ...g, ...args.edits }; // Merge edits into the existing game object
        }
        return g; // Return the game unchanged if it does not match the id
      });

      // Return the updated game, or null if it wasn't found
      return db.games.find((g) => g.id === args.id) || null;
    },
  },
};

//server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = 4000;

const { url } = await startStandaloneServer(server, {
  listen: { port },
});

console.log(`Server ready at port ${port}`, `URL: ${url}`);
