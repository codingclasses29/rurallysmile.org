const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.userRole || req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
        data: null,
        errors: null,
      });
    }

    next();
  };
};

export default authorize;
export { authorize };
