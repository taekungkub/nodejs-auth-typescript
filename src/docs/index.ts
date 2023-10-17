import swaggerJSDoc from "swagger-jsdoc";
const swaggerDefinition = {
  swagger: "2.0",
  info: {
    title: "Example Auth API",
    description: "Find out how your APIs work",
    version: "1.0.0",
  },
  host: "localhost:8000",
  basePath: "",
};

const options = {
  swaggerDefinition,
  apis: ["./**/*.yaml"],
};

export const swaggerSpec = swaggerJSDoc(options);
