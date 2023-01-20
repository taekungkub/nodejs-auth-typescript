import swaggerJsdoc from "swagger-jsdoc";

const options = {
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
export default specs;
