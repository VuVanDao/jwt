import { AddUser } from "../service/userService";

const handleGetHomePage = (req, res) => {
  res.render("user.ejs");
};
const handleAddUser = async (req, res) => {
  //   res.render("user.ejs");
  console.log(">>", req.body);
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  await AddUser(username, email, password);
};
export { handleAddUser, handleGetHomePage };
