import express from "express";
import Partner from "../models/Partner.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();
router.use("/", makeCrudRouter(Partner));

export default router;
