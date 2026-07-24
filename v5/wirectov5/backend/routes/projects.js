import express from "express";
import Project from "../models/Project.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();
router.use("/", makeCrudRouter(Project));

export default router;
