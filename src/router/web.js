import express from "express";
import {
  handleAddUser,
  handleGetHomePage,
  handleGetDetailUser,
  handleUpdateUser,
  handleDeleteUser,
  handleCreateUser,
  handleLogin,
  handleLogout,
  handleGetAllUserApi,
  handleGetDetailUserApi,
  handleCreateAccountApi,
  handleUpdateUserApi,
  handleDeleteUserApi,
  getUserAccount,
  saveRoles,
  getRoles,
  deleteRoles,
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

  router.all("*", checkJWT /* tao req.user o day */, checkUserPermission);
  router.post("/api/v1/create-account", handleCreateAccountApi);
  router.post("/api/v1/login", handleLogin); //tao token o day
  router.get("/api/v1/logout", handleLogout);
  router.get("/api/v1/account", getUserAccount);
  router.get("/api/v1/get", handleGetAllUserApi);
  router.get("/api/v1/get-detail", handleGetDetailUserApi);
  router.post("/api/v1/post", handleCreateUser);
  router.put("/api/v1/put", handleUpdateUserApi);
  router.delete("/api/v1/delete/:id", handleDeleteUserApi);

  router.get("/api/v1/get-group", getAllGroup);

  router.get("/api/v1/get-roles", getRoles);
  router.post("/api/v1/save-roles", saveRoles);
  router.post("/api/v1/delete-roles", deleteRoles);

  return app.use("/", router);
};
export default initWebRoutes;
