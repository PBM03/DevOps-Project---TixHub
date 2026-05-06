import express from 'express';
import { createBooking, getUserBookings, cancelBooking } from '../controllers/booking.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);
router.post('/', createBooking);
router.get('/', getUserBookings);
router.put('/:id/cancel', cancelBooking);

export default router;