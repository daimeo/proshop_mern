import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addShippingAddress } from "../controllers/cartController.js";
import { getShippingAddress } from "../controllers/cartController.js";

const router = express.Router();

router
    .route("/address")
    .post(protect, addShippingAddress)
    .get(protect, getShippingAddress);

export default router;
