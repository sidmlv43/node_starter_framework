const path = require("path");
const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/lib/errorController");
const morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

// Setting the view engine
app.set("view-engine", "pug");

// setting path for views folder
app.set("views", path.join(__dirname, "views"));

// serving static files
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// SECURITY RELATED MIDDLEWARES
app.use(helmet());

app.use(
  hpp({
    whitelist: [
      // Please add the keyword you want to whitelist;
    ],
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

// ROUTES
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello from node js",
  });
});

app.all("*", (req, res, next) => {
  return next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
