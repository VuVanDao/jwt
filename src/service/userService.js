import { where } from "sequelize";

const { User, Group } = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const GetAllUser = async () => {
  let result = await User.findAll({
    include: {
      model: Group,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },
    raw: true,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  return result;
};
const AddUser = async (email, address, phone, username, password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  await User.create({
    username: username,
    email: email,
    password: hashPassword,
    address: address,
    phone: phone,
  });
};
const getDetailUser = async (id) => {
  let result = await User.findOne({
    where: {
      id: id,
    },
  });
  return result;
};
const UpdateUser = async (id, email, username) => {
  let user = await User.findOne({
    where: {
      id: id,
    },
  });
  if (user) {
    user.email = email;
    user.username = username;
    await user.save();
  } else {
    return;
  }
};
const deleteUser = async (id) => {
  let user = await User.findOne({
    where: {
      id: id,
    },
  });
  user.destroy();
};
const CreateUser = async (email, address, phone, username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkUserExist = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!checkUserExist) {
        let hashPassword = bcrypt.hashSync(password, salt);
        let user = await User.create({
          username: username,
          email: email,
          password: hashPassword,
          address: address,
          phone: phone,
        });
        if (user) {
          resolve({
            errCode: 0,
            errMessage: "Create user complete",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Create user is not complete",
          });
        }
      } else {
        resolve({
          errCode: 2,
          errMessage: " user already exist",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
export {
  AddUser,
  GetAllUser,
  getDetailUser,
  UpdateUser,
  deleteUser,
  CreateUser,
};
