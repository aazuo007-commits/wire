import express from "express";
import Logo from "../models/Logo.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();
router.use("/", makeCrudRouter(Logo));

export default router;
