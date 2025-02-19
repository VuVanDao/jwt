import express from "express";
import initWebRoutes from "./router/web";
import configViewEngine from "./config/viewEngine";
import connect from "./config/connectDB";
import bodyParser from "body-parser";
require("dotenv").config();
const app = express();
configViewEngine(app);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,OPTIONS,DELETE,PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connect();
initWebRoutes(app);
const port = process.env.PORT;
app.listen(port, () => {
  console.log("running" + port);
});
