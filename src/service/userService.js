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
      let checkUserExist = await checkEmailExist(email);
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
const checkEmailExist = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkUserExist = await User.findOne({
        where: {
          email: email,
        },
      });
      if (checkUserExist) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
const checkPassword = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkUserExist = await User.findOne({
        where: {
          email: email,
        },
      });
      if (checkUserExist && checkUserExist.get({ plain: true }).password) {
        const hashPassword = checkUserExist.get({ plain: true }).password;
        const checkPasswordResult = bcrypt.compareSync(password, hashPassword);
        if (checkPasswordResult) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
const Login = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkUserExist = await checkEmailExist(email);
      let checkComparePassword = await checkPassword(email, password);
      if (checkUserExist && checkComparePassword) {
        resolve({
          errCode: 0,
          errMessage: "Login successfully",
        });
      } else {
        if (!checkUserExist) {
          resolve({
            errCode: -1,
            errMessage: "Email is not correct",
          });
        } else {
          resolve({
            errCode: -1,
            errMessage: "Password is not correct",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
const GetAllUserApi = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = [];
      result = await User.findAll({
        include: {
          model: Group,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        raw: true,
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
      if (result && result.length > 0) {
        resolve({
          errCode: 0,
          errMessage: "Get all user complete",
          data: result,
        });
      } else {
        resolve({
          errCode: -1,
          errMessage: "Get all user not complete",
          data: result,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const GetAllUserApiWithPaginate = async (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let offset = (page - 1) * limit;
      let { count, rows } = await User.findAndCountAll({
        offset: offset,
        limit: limit,
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
      let result = {
        totalRows: count,
        totalPage: Math.ceil(count / limit),
        users: rows,
      };
      resolve({
        errCode: 0,
        errMessage: "Get all user complete",
        data: result,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const CreateUserApi = async (email, address, username, password, phone) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email || !password || !username) {
        resolve({
          errCode: -1,
          errMessage: "Missing data required",
        });
      } else {
        let hashPassword = bcrypt.hashSync(password, salt);
        let userCreated = await User.create({
          username: username,
          email: email,
          password: hashPassword,
          address: address,
          phone: phone,
        });
        if (userCreated) {
          resolve({
            errCode: 0,
            errMessage: "Create user complete",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Create user not complete",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
const GetUpdateUserApi = async (id, email, address, username, phone) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !email || !username) {
        resolve({
          errCode: -1,
          errMessage: "Missing params required",
        });
      } else {
        let userUpdate = await User.findOne({
          where: {
            id: id,
          },
        });
        if (!userUpdate) {
          resolve({
            errCode: 1,
            errMessage: "Not found any user",
          });
        } else {
          userUpdate.email = email;
          userUpdate.address = address;
          userUpdate.username = username;
          userUpdate.phone = phone;
          userUpdate.save();
          resolve({
            errCode: 0,
            errMessage: "Update user complete",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
const GetDeleteUserApi = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: -1,
          errMessage: "Missing id to find and delete",
        });
      } else {
        let userDelete = await User.findOne({
          where: { id: id },
        });
        if (!userDelete) {
          resolve({
            errCode: 1,
            errMessage: "Not found any user",
          });
        } else {
          userDelete.destroy();
          resolve({
            errCode: 0,
            errMessage: "Delete user complete",
          });
        }
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
  Login,
  GetAllUserApi,
  CreateUserApi,
  GetUpdateUserApi,
  GetDeleteUserApi,
  GetAllUserApiWithPaginate,
};
