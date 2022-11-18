import express from "express";
import planner from "../controllers/planner";

const router = express.Router();

router.post("/planning", planner.createPlanning);

router.get('/planning/:id_c', planner.readPlanning);

router.put('/planning/:id_c', planner.updatePlanning);

router.delete('/planning/:id_c', planner.deletePlanning);

router.post('/my-plannings', planner.getPlannings);





// OTS
router.post('/ot/:id_c', planner.createOt);

router.get('/planning-ots/:id_c', planner.getOts);

// DELIVERIES
router.get('/deliveries-ot/:id_a', planner.getDeliveries);

// Supervisores
/* router.post('/my-plannings', planner.getSupervisor); */
//PM
router.get('/planning-pm', planner.getPm);

module.exports = router;