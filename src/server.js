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
createJWT();
connect();
const decode = verifyToken(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmFuIERhbyIsImFkZHJlc3MiOiJOYW0gRGluaCIsImlhdCI6MTc0MDI4ODI1OX0.Ann3v2RcZun0YJO_stD5i-b0yjLtsXl5v6dSuk9JZvw"
);
initWebRoutes(app);
const port = process.env.PORT;
app.listen(port, () => {
  console.log("running" + port);
});
