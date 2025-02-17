const { User } = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const AddUser = async (username, email, password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  await User.create({
    username: username,
    email: email,
    password: hashPassword,
  });
};
export { AddUser };
