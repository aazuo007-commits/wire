import express from "express";
import Expertise from "../models/Expertise.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();
router.use("/", makeCrudRouter(Expertise));

export default router;
