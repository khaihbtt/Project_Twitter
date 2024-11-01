import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.route("/profile/:username").get(protectRoute, getUserProfile);
// router.route("/suggested").get(protectRoute, getUserProfile);
// router.route("/follow/:id").post(protectRoute, followUnfollowUser);
// router.route("/update").get(protectRoute, updateUserProfile);






export default router;