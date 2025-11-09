import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { cancelReservation, createReservation, listUserReservation } from "../controllers/reservations.controller";


const router = express.Router();

router.post('/', requireAuth, createReservation);
router.delete('/:id', requireAuth, cancelReservation);
router.get('/', requireAuth, listUserReservation);


export default router;