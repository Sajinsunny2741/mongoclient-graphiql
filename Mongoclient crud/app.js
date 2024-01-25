const express = require("express");
const app = express();
const { connect } = require("./db");

const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const yamljs = require("yamljs");

// Load Swagger definition from YAML file
const swaggerDefinition = yamljs.load("./swagger.yaml");

// Middleware for parsing JSON data
app.use(bodyParser.json());
connect().then(() => {
  // Import and use the 'students' route
  const studentsRouter = require("./routes/students");
  app.use("/students", studentsRouter);

  // Swagger configuration options
  const swaggerDefinition = yamljs.load("./swagger.yaml");
  const swaggerOptions = {
    definition: {
      ...swaggerDefinition,
      servers: [
        {
          url: "http://localhost:3007",
        },
      ],
    },
    apis: ["./routes/students.js"],
  };

  // Generate Swagger specifications
  const swaggerSpecs = swaggerJsdoc(swaggerOptions);

  // Serve Swagger documentation at the '/api-docs' endpoint
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
});

module.exports = app;
