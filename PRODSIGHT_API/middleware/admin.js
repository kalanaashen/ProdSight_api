module.exports = function IsAdmin(req, res, next) {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("UnAthurozied User is not Admin!");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something Happened!");
  }
};
