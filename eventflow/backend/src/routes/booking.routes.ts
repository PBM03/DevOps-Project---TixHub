import express from 'express';
import { createBooking, getUserBookings, cancelBooking } from '../controllers/booking.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.put('/:id/cancel', protect, cancelBooking);

export default router;