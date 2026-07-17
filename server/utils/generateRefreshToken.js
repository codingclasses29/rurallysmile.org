import jwt from "jsonwebtoken";

const generateRefreshToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
    }
  );
};

export default generateRefreshToken;
