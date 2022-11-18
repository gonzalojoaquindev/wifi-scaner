import express from "express";
import plan from "../controllers/plan";

const router = express.Router();

/* router.post("/pm03", supervisor.getPm03); */
router.post("/areas", plan.getAreas);
router.post("/sectors", plan.getSectors);
router.post("/services", plan.getServices);

module.exports = router;