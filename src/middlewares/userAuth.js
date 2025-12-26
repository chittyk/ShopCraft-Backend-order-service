const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "Token is missing" });

    const token = authHeader.split(" ")[1];
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "user") {
      req.userId = decoded.id;
      console.log(req.userId);
      next();
    } else {
      return res.status(403).json({ msg: "Authorization denied" });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};
