import {
  AddUser,
  GetAllUser,
  getDetailUser,
  UpdateUser,
  deleteUser,
  CreateUser,
  Login,
  GetAllUserApi,
  GetDetailUserApi,
  GetAllUserApiWithPaginate,
  CreateAccountApi,
  GetDeleteUserApi,
  GetUpdateUserApi,
  handleSaveRoles,
  handleGetRoles,
  handleDeleteRoles,
  handleGetRolesByGroup,
  handleAssignRoles,
} from "../service/userService";

const handleGetHomePage = async (req, res) => {
  let result = await GetAllUser();
  console.log("cookie", req.cookies);
  console.log("cookie signed", req.signedCookies);
  if (result && result.length > 0) {
    res.render("user.ejs", { result });
  } else {
    result = [];
    res.render("user.ejs", { result });
  }
};
const handleAddUser = async (req, res) => {
  let { email, address, username, password, phone } = req.body;
  await AddUser(email, address, phone, username, password);
  res.redirect("/");
};
const handleGetDetailUser = async (req, res) => {
  let result = await getDetailUser(req.params.id);
  res.render("updateUser.ejs", { result });
};
const handleUpdateUser = async (req, res) => {
  let id = req.params.id;
  let username = req.body.username;
  let email = req.body.email;
  await UpdateUser(id, email, username);
  res.redirect("/");
};
const handleDeleteUser = async (req, res) => {
  await deleteUser(req.params.id);
  res.redirect("/");
};
const handleGetAllUserApi = async (req, res) => {
  try {
    // console.log("cookie:", req.user);

    if (req.query.limit && req.query.page) {
      let result = await GetAllUserApiWithPaginate(
        +req.query.page,
        +req.query.limit
      );
      res.status(200).json(result);
    } else {
      let result = await GetAllUserApi();
      res.status(200).json(result);
    }
  } catch (error) {
    console.log("Error from handleGetAllUser", error);
    res.status(500).json({ errMessage: "Error from handleGetAllUser" });
  }
};
const handleCreateAccountApi = async (req, res) => {
  try {
    let { email, Address, username, password, phoneNumber } = req.body;
    let result = await CreateAccountApi(
      email,
      Address,
      phoneNumber,
      username,
      password
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ errMessage: "Error from create user", error });
  }
};
const handleLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    let result = await Login(email, password);
    if (result.errCode === 0 && result.access_token) {
      res.cookie("jwt", result.access_token, {
        httpOnly: true,
        maxAge: 30 * 1000,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from login account", error);
    res.status(500).json({ errMessage: "Error from login account" });
  }
};
const handleLogout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      errCode: 0,
      errMessage: "Logout complete",
    });
  } catch (error) {
    console.log("Error from login account", error);
    res.status(500).json({ errMessage: "Error from login account" });
  }
};

const handleCreateUser = async (req, res) => {
  try {
    let { email, address, username, password, phone, gender, group } = req.body;
    let result = await CreateUser(
      email,
      address,
      username,
      password,
      phone,
      gender,
      group
    );
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from handleCreateUser", error);
    res.status(500).json({ errMessage: "Error from handleCreateUser" });
  }
};
const handleUpdateUserApi = async (req, res) => {
  try {
    const { id, username, address, phone, groupId, gender } = req.body;

    let result = await GetUpdateUserApi(
      id,
      address,
      username,
      phone,
      gender,
      groupId
    );
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from handleGetUpdateUser", error);
    res.status(500).json({ errMessage: "Error from handleGetUpdateUser" });
  }
};
const handleDeleteUserApi = async (req, res) => {
  try {
    let result = await GetDeleteUserApi(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from handleGetDeleteUser", error);
    res.status(500).json({ errMessage: "Error from handleGetDeleteUser" });
  }
};
const handleGetDetailUserApi = async (req, res) => {
  try {
    let result = await GetDetailUserApi(req.query.id);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from handleGetDetailUserApi", error);
    res.status(500).json({ errMessage: "Error from handleGetDetailUserApi" });
  }
};
const getUserAccount = async (req, res) => {
  try {
    // console.log(">>>", req.user);
    res.status(200).json({
      errCode: 0,
      errMessage: "ok",
      data: {
        access_token: req.token,
        roles: req.user.result,
        email: req.user.email,
        username: req.user.username,
      },
    });
  } catch (error) {
    console.log("Error from getUserAccount", error);
    res.status(500).json({ errMessage: "Error from getUserAccount" });
  }
};
const saveRoles = async (req, res) => {
  try {
    const result = await handleSaveRoles(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from saveRoles", error);
    res.status(500).json({ errMessage: "Error from saveRoles" });
  }
};
const getRoles = async (req, res) => {
  try {
    const result = await handleGetRoles();
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from GetRoles", error);
    res.status(500).json({ errMessage: "Error from GetRoles" });
  }
};
const deleteRoles = async (req, res) => {
  try {
    const result = await handleDeleteRoles(req.query.id);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from DeleteRoles", error);
    res.status(500).json({ errMessage: "Error from DeleteRoles" });
  }
};
const getRolesByGroup = async (req, res) => {
  try {
    const result = await handleGetRolesByGroup(req.query.id);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from getRolesByGroup", error);
    res.status(500).json({ errMessage: "Error from getRolesByGroup" });
  }
};
const assignRoles = async (req, res) => {
  try {
    const result = await handleAssignRoles(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from assignRoles", error);
    res.status(500).json({ errMessage: "Error from assignRoles" });
  }
};
export {
  handleAddUser,
  handleGetHomePage,
  handleGetDetailUser,
  handleUpdateUser,
  handleDeleteUser,
  handleCreateUser,
  handleLogin,
  handleLogout,
  handleGetAllUserApi,
  handleCreateAccountApi,
  handleUpdateUserApi,
  handleDeleteUserApi,
  handleGetDetailUserApi,
  getUserAccount,
  saveRoles,
  getRoles,
  deleteRoles,
  getRolesByGroup,
  assignRoles,
};
