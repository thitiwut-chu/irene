//Load environment
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./database");
require("./models/_define")(db);

const AuthController = require("./controllers/auth");
const RealEstateController = require("./controllers/realEstate");

const ac = new AuthController(db);
const rc = new RealEstateController(db);

const authRoute = require("./routes/auth")(ac);
const realEstateRoute = require("./routes/realEstate")(rc);

//Parsing JSON body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Use logging
app.use(morgan("dev"));

//Handle CORS
const corsOptions = {
  origin: "*",
  methods: "GET,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Authorization", "Content-Type"],
}
app.use(cors(corsOptions));

//Serve static files
app.use("/upload", express.static("upload"));

//Set up main routes
app.use("/auth", authRoute);
app.use("/real-estates", realEstateRoute);

//Handle error 
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    }
  });
});

//Close database connection when program is terminated
process.on("exit", () => {
  global.db.close();
});

//Start server
const port = process.env.PORT;
app.listen(port);
