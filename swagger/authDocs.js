export const authDocs = {
  "/api/auth/register": {
    post: {
      summary: "Register a new user",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "firstName",
                "lastName",
                "email",
                "password",
                "age",
                "gender",
              ],
              properties: {
                firstName: { type: "string", example: "John" },
                lastName: { type: "string", example: "Doe" },
                email: { type: "string", example: "johndoe@example.com" },
                password: { type: "string", example: "P@ssw0rd" },
                age: { type: "integer", example: 25 },
                gender: {
                  type: "string",
                  enum: ["male", "female", "other"],
                  example: "male",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "User registered successfully" },
        400: { description: "Invalid input data" },
        409: { description: "Email already exists" },
      },
    },
  },
  "/api/auth/login": {
    post: {
      summary: "Log in an existing user",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "johndoe@example.com" },
                password: { type: "string", example: "P@ssw0rd" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "User logged in successfully" },
        401: { description: "Invalid credentials" },
      },
    },
  },
};
