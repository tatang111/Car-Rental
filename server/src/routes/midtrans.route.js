import express from "express"
import { createTokenMidtrans } from "../controllers/midtrans.controller.js";

const midtransRouter = express.Router();

midtransRouter.post("/", createTokenMidtrans)

export default midtransRouter