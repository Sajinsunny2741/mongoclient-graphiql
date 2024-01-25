const express = require("express");
const app = express();
const { connect } = require("./db");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

const bodyParser = require("body-parser");

app.use(bodyParser.json());
connect()
  .then(() => {
    console.log("Connection to the database.");

    app.use(
      "/graphql",
      graphqlHTTP({
        schema,
        graphiql: true,
      })
    );
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process on connection failure
  });

module.exports = app;
