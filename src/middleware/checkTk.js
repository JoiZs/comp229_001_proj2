const jwt = require("jsonwebtoken");
const isJwt = require("validator/lib/isJWT");

const config = require("../config/token_config");

function checkAuth(req, res, next) {
  try {
    //token
    const token = req.cookies["__authTk"];

    if (!isJwt(token)) {
      return res.json({
        type: "error",
        message: "Unauthorized",
      });
    }

    //decoded
    if (!jwt.verify(token, config.jwt.secret)) {
      return res.json({
        type: "error",
        message: "Unauthorized",
      });
    }

    next();
  } catch (err) {
    return res.json({
      type: "error",
      message: "Unauthorized",
    });
  }
}

module.exports = checkAuth;
