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
  CreateUserApi,
} from "../service/userService";
import { GroupRole, Group, Role } from "../models";
const handleGetHomePage = async (req, res) => {
  let result = await GetAllUser();
  // console.log(">>", result);
  // let result2 = await GroupRole.findOne({
  //   include: [
  //     {
  //       model: Group,
  //       attributes: {
  //         exclude: ["createdAt", "updatedAt"],
  //       },
  //     },
  //     {
  //       model: Role,
  //       attributes: {
  //         exclude: ["createdAt", "updatedAt"],
  //       },
  //     },
  //   ],
  //   raw: true,
  // });
  // let result2 = await Group.findAll({
  //   include: {
  //     model: Role,
  //     attributes: {
  //       exclude: ["createdAt", "updatedAt"],
  //     },
  //   },
  //   attributes: {
  //     exclude: ["createdAt", "updatedAt"],
  //   },
  //   raw: true,
  //   nest: true,
  // });
  // console.log("group", result2);
  // let result3 = await Role.findAll({
  //   include: {
  //     model: Group,
  //     attributes: {
  //       exclude: ["createdAt", "updatedAt"],
  //     },
  //   },
  //   attributes: {
  //     exclude: ["createdAt", "updatedAt"],
  //   },
  //   raw: true,
  //   nest: true,
  // });
  // console.log("role", result3);
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
    res.status(200).json(result);
  } catch (error) {
    console.log("Error from login account", error);
    res.status(500).json({ errMessage: "Error from login account" });
  }
};
const handleGetAllUserApi = async (req, res) => {
  try {
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
    let id = req.body.id;
    let username = req.body.username;
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;
    let result = await GetUpdateUserApi(id, email, address, username, phone);
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

export {
  handleAddUser,
  handleGetHomePage,
  handleGetDetailUser,
  handleUpdateUser,
  handleDeleteUser,
  handleCreateUser,
  handleLogin,
  handleGetAllUserApi,
  handleCreateAccountApi,
  handleUpdateUserApi,
  handleDeleteUserApi,
  handleGetDetailUserApi,
};
