import authorize from "./role.middleware.js";
import { ROLES } from "../utils/constants.js";

export const adminOnly = authorize(
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.COORDINATOR
);

export const superAdminOnly = authorize(ROLES.SUPER_ADMIN);

export const studentOnly = (req, res, next) => {
  if (req.userRole !== ROLES.STUDENT && req.user?.role !== ROLES.STUDENT) {
    return res.status(403).json({
      success: false,
      message: "Access Denied",
      data: null,
      errors: null,
    });
  }
  next();
};

export { authorize };
