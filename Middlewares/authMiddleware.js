const jwt = require('jsonwebtoken');
 
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "Unauthorized, no token provided" });
 
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Unauthorized, invalid token format" });
 
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: "Forbidden, token expired" });
      }
      return res.status(403).json({ message: "Forbidden, invalid token" });
    }
   
    req.userID = user.userId;
    req.user = user;
   
    next();
  });
};
module.exports = authenticateToken;









 
