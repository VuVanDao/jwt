import { name } from "ejs";
import jwt from "jsonwebtoken";
require("dotenv").config();
const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    // console.log(">>", token);
  } catch (error) {
    console.log("error from JWTActions", error);
  }
  return token;
};
const nonSecurePaths = ["/api/v1/create-account", "/api/v1/login", "/"];
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
const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};
const checkJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();
  let cookie = req.cookies;
  const tokenFromHeader = extractToken(req);
  if ((cookie && cookie.jwt) || tokenFromHeader) {
    let token = cookie && cookie.jwt ? cookie.jwt : tokenFromHeader;
    // console.log("cookie", token);
    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      res.status(401).json({
        errCode: -1,
        errMessage: "not authenticated a user from checkJWT",
        data: {},
      });
    }
  } else {
    res.status(401).json({
      errCode: -1,
      errMessage: "not authenticated a user from checkJWT",
      data: {},
    });
  }
};
const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/api/v1/account")
    return next();
  if (req.user) {
    let email = req.user.email;
    let roles = req.user.result;
    let currentURL = req.path;
    if (!roles || roles.length === 0) {
      res.status(403).json({
        errCode: -1,
        errMessage: "You don't have permission from checkUserPermission",
        data: {},
      });
    }

    let canAccess = roles.some((item) => item.Roles.url === currentURL);
    if (canAccess) {
      next();
    } else {
      res.status(403).json({
        errCode: -1,
        errMessage: "You don't have permission from checkUserPermission",
        data: {},
      });
    }
  } else {
    res.status(401).json({
      errCode: -1,
      errMessage: "not authenticated a user from checkUserPermission",
      data: {},
    });
  }
};
export { createJWT, verifyToken, checkJWT, checkUserPermission };
