import express from "express";
import pm03 from "../controllers/pm03";

const router = express.Router();

/* Open */
router.post("/create", pm03.create);
router.get('/read/:id', pm03.read);
router.put('/update/:id', pm03.update);
router.delete('/delete/:id', pm03.delete);
router.post('/my-pm03', pm03.getPm03);

/* Delivery */
router.post('/createDelivery', pm03.addDelivery);
router.get('/read-pm03/:id', pm03.readPm03);
router.post('/my-pm03-assigned', pm03.getMyPm03Assigned);





/* 

// OTS
router.post('/ot/:id_c', planner.createOt);

router.get('/planning-ots/:id_c', planner.getOts);

// DELIVERIES
router.get('/deliveries-ot/:id_a', planner.getDeliveries);

// Supervisores
router.post('/my-plannings', planner.getSupervisor); 
//PM
router.get('/planning-pm', planner.getPm); 
*/

module.exports = router;