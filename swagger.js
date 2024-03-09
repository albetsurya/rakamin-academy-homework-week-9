// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "Documentation for my API",
    },
  },
  apis: ["./routes/*.js"], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
