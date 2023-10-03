
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'].split(" ")[1];
  if (!token) return res.status(401).json({ status: 401, message: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ status: 403, message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;