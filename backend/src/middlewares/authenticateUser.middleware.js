const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        req.user = null; // Ensure `req.user` is set to null instead of being undefined
        return next(); // Continue without authentication
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        req.user = null; // Set `req.user` to null if token is invalid
        next(); // Allow request to continue
    }
};

module.exports = { authenticateUser };
