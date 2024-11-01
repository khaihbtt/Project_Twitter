import { response } from "express";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        console.log("Received data:", req.body); // Log dữ liệu nhận được

        const { fullname, username, email, password } = req.body;

        // Kiểm tra tất cả các trường
        if (!fullname || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        console.log("Checking for existing users...");

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
        if (password.length < 6) {
            return res.status(400).json({ error: 'mật khẩu hơn 6 chữ '});
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

        console.log("Saving new user...");

        await newUser.save(); // Lưu người dùng

        generateTokenAndSetCookie(newUser._id, res); // Gọi hàm tạo token

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
        });
    } catch (error) {
        console.error("Signup error:", error); // In chi tiết lỗi
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { username, password } = req.body; // Lấy dữ liệu từ req.body
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "Thông tin xác thực không hợp lệ" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Thông tin xác thực không hợp lệ" });
        }

        // Tạo và thiết lập token trong cookie
        generateTokenAndSetCookie(user._id, res);

        // Trả về thông tin người dùng
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    } catch (error) {
        console.error("Login error:", error); // In chi tiết lỗi
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 })
        res.status(200).json({ message:" logged out successfully" });
        
    } catch (error) {
        console.error("Login error:", error); // In chi tiết lỗi
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.error("error in getMe controller:", error.message); // In chi tiết lỗi
        res.status(500).json({ error: "Internal server error", details: error.message });
    
    }
};