import express from "express";
import { printReceipt } from "../controllers/printerController.js";

const router = express.Router();

router.post("/", printReceipt);

export default router;
