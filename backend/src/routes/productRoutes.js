import express from "express";
import { getProductByBarcode } from "../controllers/productController.js";

const router = express.Router();

router.get("/:barcode", getProductByBarcode);

export default router;
