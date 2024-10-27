import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        
        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Kiểm tra username đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = new User({
            fullname: fullname,
            username: username,
            email: email,
            password: hashedPassword
        });

        if (newUser) {
            await newUser.save();  // Lưu người dùng trước khi tạo token
            generateTokenAndSetCookie(newUser._id, res);  // Gọi hàm tạo token
            
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,  // Sửa lỗi 'folloing' thành 'followers'
                following: newUser.following,  // Sửa lỗi chính tả
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("error", error.message);
        res.status(500).json({ error: "Invalid server data" });
    }
};

export const login = async (req, res) => {
    res.json({
        data: "you hit the login endpoint",
    });
};

export const logout = async (req, res) => {
    res.json({
        data: "you hit the logout endpoint",
    });
};
