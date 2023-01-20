import swaggerJsdoc from "swagger-jsdoc";

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.

  swaggerDefinition: {
    info: {
      title: "Example API",
      version: "3.0.0",
      description: "A simple Express API with Swagger documentation ",
    },
  },
  apis: ["./src/routes/auth.ts"],
};
const specs = swaggerJsdoc(options);
console.log(specs);
export default specs;
