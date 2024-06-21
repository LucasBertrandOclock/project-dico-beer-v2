import "dotenv/config";
import jwt from "jsonwebtoken";

const createToken = (data) => {
  console.log("createToken data : ", data);
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const createRefreshToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export { createToken, createRefreshToken };
