import { name } from "ejs";
import jwt from "jsonwebtoken";
require("dotenv").config();
const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key);
    // console.log(">>", token);
  } catch (error) {
    console.log("error from JWTActions", error);
  }
  return token;
};
const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let data = null;
  try {
    let decoded = jwt.verify(token, key);
    data = decoded;
  } catch (error) {
    console.log("error from JWTActions verifyToken", err);
  }
  return data;
};
const checkJWT = (req, res, next) => {
  let cookie = req.cookies;
  if (cookie && cookie.jwt) {
    // console.log("cookie", cookie.jwt);
    let token = cookie.jwt;
    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      res.status(401).json({
        errCode: -1,
        errMessage: "not authenticated a user",
        data: {},
      });
    }
  } else {
    res.status(401).json({
      errCode: -1,
      errMessage: "not authenticated a user",
      data: {},
    });
  }
};
const checkUserPermission = (req, res, next) => {
  if (req.user) {
    let email = req.user.email;
    let roles = req.user.result;
    let currentURL = req.path;
    if (!roles || roles.length === 0) {
      res.status(403).json({
        errCode: -1,
        errMessage: "You don't have permission",
        data: {},
      });
    }
    let canAccess = roles.some((item) => item.Roles.url === currentURL);
    if (canAccess) {
      next();
    } else {
      res.status(403).json({
        errCode: -1,
        errMessage: "You don't have permission",
        data: {},
      });
    }
  } else {
    res.status(401).json({
      errCode: -1,
      errMessage: "not authenticated a user",
      data: {},
    });
  }
};
export { createJWT, verifyToken, checkJWT, checkUserPermission };
