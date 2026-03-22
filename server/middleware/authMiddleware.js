import jwt from 'jsonwebtoken';

// Middleware to verify if user is authenticated (via accessToken)
export const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: "Access denied. Please login." });

  try {
    const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_secret');
    req.user = verified; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired access token" });
  }
};

// Middleware to authorize roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Roles allowed: ${roles.join(', ')}` });
    }
    next();
  };
};
