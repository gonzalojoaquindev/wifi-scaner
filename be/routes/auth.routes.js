import express from "express";
import authentication from '../controllers/auth';

const router = express.Router();

/* router.post("/signup", authentication.signUp); */
//router.post('/signup', (req, res) => {
//   console.log(req.body);
//    res.send("resgistrado")
//})
router.post('/signin', authentication.signIn);
router.get('/getWorkers', authentication.getWorkers);

module.exports = router;