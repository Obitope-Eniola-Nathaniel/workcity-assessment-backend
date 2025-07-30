module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    // console.log("checkRole: req.user =", req.user);
    // console.log("Allowed roles:", allowedRoles);

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      // console.log("Access denied by role check");
      return res.status(403).json({ message: "Access denied" });
    }
    console.log("Role check passed");
    next();
  };
};
