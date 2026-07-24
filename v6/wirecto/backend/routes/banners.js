import express from "express";
import Banner from "../models/Banner.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();
router.use("/", makeCrudRouter(Banner));

export default router;
