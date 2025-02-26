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
  handleGetDetailUserApi,
  handleCreateAccountApi,
  handleUpdateUserApi,
  handleDeleteUserApi,
  getUserAccount,
} from "../controller/userController";
import { checkJWT, checkUserPermission } from "../middleware/jWTActions";
import { getAllGroup } from "../controller/groupController";
const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", handleGetHomePage);
  router.post("/add", handleAddUser);
  router.get("/get-detail/:id", handleGetDetailUser);
  router.post("/update/:id", handleUpdateUser);
  router.get("/delete/:id", handleDeleteUser);
  router.get("/delete/:id", handleDeleteUser);

  router.all("*", checkJWT, checkUserPermission);
  router.post("/api/v1/create-account", handleCreateAccountApi);
  router.post("/api/v1/login", handleLogin); //tao token o day
  router.get("/api/v1/account", getUserAccount);
  router.get("/api/v1/get", handleGetAllUserApi);
  router.get("/api/v1/get-detail", handleGetDetailUserApi);
  router.post("/api/v1/post", handleCreateUser);
  router.put("/api/v1/put", handleUpdateUserApi);
  router.delete("/api/v1/delete/:id", handleDeleteUserApi);

  router.get("/api/v1/get-group", getAllGroup);

  return app.use("/", router);
};
export default initWebRoutes;
