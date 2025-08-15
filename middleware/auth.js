const jwt = require('jsonwebtoken')

const verifyToken =(roles = []) => {
    return (req, res, next) =>{
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({message: "No token provided"});

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
            if (err) return res.status(403).json({ 
                message: "invalid or expired token"});
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({
                message: "Access denied"
                });
            }
        req.user = user;
        next();
        });
    };
};

module.exports = verifyToken