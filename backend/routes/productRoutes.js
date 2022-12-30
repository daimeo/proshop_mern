import express from "express";
const router = express.Router();
import {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
    // getProductsList,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);
// .post(protect, editor, createProduct);
router.route("/list").get(protect, admin, getProducts);
router.route("/:id/reviews").post(protect, createProductReview);
router.get("/top", getTopProducts);
router
    .route("/:id")
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    // .delete(protect, editor, deleteProduct)
    .put(protect, admin, updateProduct);
// .put(protect, admin, editor, updateProduct);
// .put(protect, editor, updateProduct);

export default router;
