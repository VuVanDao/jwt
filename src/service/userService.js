const { User, Group, Role } = require("../models");
import { createJWT } from "../middleware/jWTActions";
import { getGroupWithRole } from "./jWTService";

require("dotenv").config();
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
const CreateAccountApi = async (email, address, phone, username, password) => {
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
          gender: 3,
          groupId: 4,
        });
        if (user) {
          resolve({
            errCode: 0,
            errMessage: "Create Account complete",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Create Account is not complete",
          });
        }
      } else {
        resolve({
          errCode: 2,
          errMessage: " Account already exist",
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
        const result = await getGroupWithRole(checkUserExist);
        const user = checkUserExist.get({ plain: true });
        let payload = {
          email: user.email,
          result,
          username: user.username,
        };
        let token = createJWT(payload);
        if (checkPasswordResult) {
          resolve({
            check: true,
            result,
            access_token: token,
            username: user.username,
            account: { email: user.email, roles: result },
          });
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
      // console.log("checkComparePassword", checkComparePassword);
      if (checkUserExist && checkComparePassword.check) {
        resolve({
          errCode: 0,
          errMessage: "Login successfully",
          access_token: checkComparePassword.access_token,
          account: checkComparePassword.account,
          username: checkComparePassword.username,
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
        include: {
          model: Group,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
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
const CreateUser = async (
  email,
  address,
  username,
  password,
  phone,
  gender,
  group
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email || !password || !username) {
        resolve({
          errCode: -1,
          errMessage: "Missing data required",
        });
      } else {
        let checkUserExist = await checkEmailExist(email);
        if (checkUserExist) {
          resolve({
            errCode: 2,
            errMessage: " User already exist",
          });
        } else {
          let hashPassword = bcrypt.hashSync(password, salt);
          let userCreated = await User.create({
            username: username,
            email: email,
            password: hashPassword,
            address: address,
            phone: phone,
            gender: gender,
            groupId: group,
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
      }
    } catch (error) {
      reject(error);
    }
  });
};
const GetUpdateUserApi = async (
  id,
  address,
  username,
  phone,
  gender,
  groupId
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
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
          userUpdate.username = username;
          userUpdate.address = address;
          userUpdate.phone = phone;
          userUpdate.groupId = groupId;
          userUpdate.gender = gender;
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
const GetDetailUserApi = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let detailUser = await User.findOne({
        where: {
          id: id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
      if (detailUser) {
        resolve({
          errCode: 0,
          errMessage: "found a user",
          data: detailUser,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: " not found a user",
          data: {},
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const handleSaveRoles = async (roles) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await Role.bulkCreate(roles);
      if (result) {
        resolve({
          errCode: 0,
          errMessage: "create roles complete",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "create roles not complete",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const handleGetRoles = async (roles) => {
  return new Promise(async (resolve, reject) => {
    try {
      let findRoles = await Role.findAll({
        raw: true,
        nest: true,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      // Array.prototype.equals = function (array) {
      //   if (!Array.isArray(array)) {
      //     throw new Error("Tham số truyền vào phải là một mảng.");
      //   }
      //   const differences = {
      //     toAdd: [],
      //     toRemove: [],
      //   };
      //   differences.toAdd = array.filter(
      //     (item2) =>
      //       !this.some(
      //         (item1) => JSON.stringify(item1) === JSON.stringify(item2)
      //       )
      //   );
      //   differences.toRemove = this.filter(
      //     (item1) =>
      //       !array.some(
      //         (item2) => JSON.stringify(item1) === JSON.stringify(item2)
      //       )
      //   );
      //   return differences;
      // };
      // let check = findRoles.equals(roles);
      // console.log("><><", check);
      if (findRoles && findRoles.length > 0) {
        resolve({
          errCode: 0,
          errMessage: "create roles complete",
          data: findRoles,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "create roles not complete",
          data: [],
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const handleDeleteRoles = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let findRoles = await Role.findOne({
        where: {
          id: id,
        },
      });
      if (findRoles) {
        findRoles.destroy();
        resolve({
          errCode: 0,
          errMessage: "delete roles complete",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "delete roles not complete",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const handleGetRolesByGroup = (groupId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await Group.findAll({
        where: {
          id: groupId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "GroupRole"],
        },
        include: {
          model: Role,
          attributes: {
            exclude: ["createdAt", "updatedAt", "GroupRole"],
          },
          through: { attributes: [] },
        },
        raw: true,
        nest: true,
      });
      console.log(">>", result);
      if (result && result.length > 0) {
        resolve({
          errCode: 0,
          errMessage: "ok",
          data: result,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "!ok",
          data: [],
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
  Login,
  GetAllUserApi,
  CreateAccountApi,
  GetUpdateUserApi,
  GetDeleteUserApi,
  GetAllUserApiWithPaginate,
  GetDetailUserApi,
  handleSaveRoles,
  handleGetRoles,
  handleDeleteRoles,
  handleGetRolesByGroup,
};
