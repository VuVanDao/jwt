const checkUserLogin = (req, res, next) => {
  const nonSecurePaths = ["/", "/api/v1/create-account", "/api/v1/login"];
  if (nonSecurePaths.includes(req.path)) return next();
  next();
};
