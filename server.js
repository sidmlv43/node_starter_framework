const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("Uncaught exception occurred.. Shutting Down");
  process.exit(1);
});

dotenv.config({
  path: "./config.env",
});

const app = require("./app");

mongoose.connect(process.env.DATABASE).then(console.log("DB Connected"));

const port = process.env.PORT || 8000;

const server = app.listen(port, (req, res) => {
  console.log(`Server is up and running at http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log("UNHANDLED REJECTION... Shutting Down");
  server.close(() => {
    process.exit(1);
  });
});
