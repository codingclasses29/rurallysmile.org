import jwt from "jsonwebtoken";

const generateAccessToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "15m",
    }
  );
};

export default generateAccessToken;
