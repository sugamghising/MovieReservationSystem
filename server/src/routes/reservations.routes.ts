import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { cancelReservation, createReservation, getReservation, listUserReservation } from "../controllers/reservations.controller";


const router = express.Router();

router.post('/', requireAuth, createReservation);
router.put('/:id', requireAuth, cancelReservation);
router.get('/', requireAuth, listUserReservation);
router.get('/:id', requireAuth, getReservation);


export default router;