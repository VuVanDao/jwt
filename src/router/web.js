import express from "express";
import {
  handleAddUser,
  handleGetHomePage,
  handleGetDetailUser,
  handleUpdateUser,
  handleDeleteUser,
  handleCreateUser,
} from "../controller/userController";
const router = express.Router();
const initWebRoutes = (app) => {
  router.get("/", handleGetHomePage);
  router.post("/add", handleAddUser);
  router.get("/get-detail/:id", handleGetDetailUser);
  router.post("/update/:id", handleUpdateUser);
  router.get("/delete/:id", handleDeleteUser);
  router.get("/delete/:id", handleDeleteUser);

  router.post("/api/v1/create", handleCreateUser);
  return app.use("/", router);
};
export default initWebRoutes;
