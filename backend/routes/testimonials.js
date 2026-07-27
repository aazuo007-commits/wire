import express from "express";
import Testimonial from "../models/Testimonial.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();
router.use("/", makeCrudRouter(Testimonial));

export default router;
