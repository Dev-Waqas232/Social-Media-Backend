import express from "express";

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
