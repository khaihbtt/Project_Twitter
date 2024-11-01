import express from 'express';
import { getMe, login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.route("/me").get(protectRoute, getMe);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);


export default router;