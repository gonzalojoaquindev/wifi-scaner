import express from "express";
import ap from "../controllers/ap";

const router = express.Router();

/* Open */
router.post("/create", ap.create);
router.get('/read', ap.read);
router.post('/prueba', ap.prueba);
router.post('/prueba2', ap.prueba2);
router.put('/update/:id', ap.update);
router.delete('/delete/:id', ap.delete);
router.post('/my-ap', ap.getap);

/* Delivery */
router.post('/createDelivery', ap.addDelivery);
router.get('/read-ap/:id', ap.readap);
router.post('/my-ap-assigned', ap.getMyapAssigned);





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