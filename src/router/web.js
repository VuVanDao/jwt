import express from "express";
import { handleAddUser, handleGetHomePage } from "../controller/userController";
const router = express.Router();
const initWebRoutes = (app) => {
  router.get("/", handleGetHomePage);
  router.post("/add", handleAddUser);
  return app.use("/", router);
};
export default initWebRoutes;
