import {
  AddUser,
  GetAllUser,
  getDetailUser,
  UpdateUser,
  deleteUser,
  CreateUser,
  Login,
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
const handleCreateUser = async (req, res) => {
  try {
    let { email, Address, username, password, phoneNumber } = req.body;
    let result = await CreateUser(
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
export {
  handleAddUser,
  handleGetHomePage,
  handleGetDetailUser,
  handleUpdateUser,
  handleDeleteUser,
  handleCreateUser,
  handleLogin,
};
