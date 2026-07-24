import express from "express";
import Technology from "../models/Technology.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();
router.use("/", makeCrudRouter(Technology));

export default router;
