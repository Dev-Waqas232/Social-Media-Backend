import jwt from "jsonwebtoken";

const generateAccessToken = (payload) => {
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  return token;
};

const generateRefreshToken = (payload) => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

export { generateAccessToken, generateRefreshToken };
