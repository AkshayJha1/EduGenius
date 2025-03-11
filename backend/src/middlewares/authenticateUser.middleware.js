const jwt = require('jsonwebtoken');

const authenticateUser = async (req , res , next) => {
    const token = req.cookies.jwt;

    if(!token) return res.status(400).json({ error : "Access Denied. No token provided."});

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);  
        return res.status(403).json({ error: "Invalid or expired token" }); 
    }
}

module.exports = {authenticateUser};