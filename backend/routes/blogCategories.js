import express from "express";
import BlogCategory from "../models/BlogCategory.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();
router.use("/", makeCrudRouter(BlogCategory));

export default router;
