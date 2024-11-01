import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error:"Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error:"Unauthorized: Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ error:"User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("error in protectRoute :", err.message); // In chi tiết lỗi
        res.status(500).json({ error: "Internal server error", details: error.message });
    
    }
}