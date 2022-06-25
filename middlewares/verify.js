const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(500).json({ message: "Unauthorized" });
    }
    const verified = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ message: "Unauthorized" });
  }
};

module.exports = verify;
