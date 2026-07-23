import express from "express";
import Industry from "../models/Industry.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();
router.use("/", makeCrudRouter(Industry));

export default router;
