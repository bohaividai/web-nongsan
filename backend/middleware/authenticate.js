const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Không có token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token không hợp lệ" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });

    req.user = user; // ✅ rất quan trọng
    next();
  });
}

module.exports = authenticate;
