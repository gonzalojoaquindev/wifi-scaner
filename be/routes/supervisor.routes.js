import express from "express";
import supervisor from "../controllers/supervisor";

const router = express.Router();

router.get("/plannings/:id", supervisor.getPlannings);

router.post("/planning/:id_c", supervisor.joinPlanning);

router.post("/my-plannings", supervisor.getMyPlannings);

router.get("/ot/:id_c/:id", supervisor.getOts);

router.post("/delivery", supervisor.addDelivery);

router.post("/pm03", supervisor.openPm03);
router.get("/pm03/:id", supervisor.readPm03);
router.put("/pm03", supervisor.updatePm03);
router.delete("/pm03", supervisor.deletePm03);
router.get("/my-pm03/:id", supervisor.getPm03);

/* router.post("/pm03", supervisor.getPm03); */
router.post("/areas", supervisor.getAreas);
router.post("/sectors", supervisor.getSectors);

module.exports = router;