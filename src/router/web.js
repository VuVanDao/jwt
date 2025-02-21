import express from "express";
import {
  handleAddUser,
  handleGetHomePage,
  handleGetDetailUser,
  handleUpdateUser,
  handleDeleteUser,
  handleCreateUser,
  handleLogin,
  handleGetAllUserApi,
  handleCreateUserApi,
  handleUpdateUserApi,
  handleDeleteUserApi,
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
  router.post("/api/v1/login", handleLogin);
  router.get("/api/v1/get", handleGetAllUserApi);
  router.post("/api/v1/post", handleCreateUserApi);
  router.put("/api/v1/put", handleUpdateUserApi);
  router.delete("/api/v1/delete/:id", handleDeleteUserApi);
  return app.use("/", router);
};
export default initWebRoutes;
