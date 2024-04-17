const userOnly = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(404).json({ msg: "User must logged in." });
  }
};

module.exports = { userOnly };
