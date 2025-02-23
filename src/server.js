import express from "express";
import initWebRoutes from "./router/web";
import configViewEngine from "./config/viewEngine";
import connect from "./config/connectDB";
import bodyParser from "body-parser";
import configCors from "./config/cors";
import { createJWT, verifyToken } from "./middleware/jWTActions";
require("dotenv").config();
const app = express();
configViewEngine(app);
configCors(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connect();
initWebRoutes(app);
const port = process.env.PORT;
app.listen(port, () => {
  console.log("running" + port);
});
