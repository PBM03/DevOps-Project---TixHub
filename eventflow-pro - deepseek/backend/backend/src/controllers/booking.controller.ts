import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Booking from '../models/Booking.model';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, seats, tier, total, paymentMethod } = req.body;
    const userId = req.user!._id;

    const bookingId = 'TIX-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    const booking = await Booking.create({
      bookingId,
      userId,
      eventId,
      seats,
      tier,
      total,
      status: 'confirmed',
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      data: {
        booking: {
          id: bookingId,
          eventId,
          seats,
          total,
          status: 'confirmed',
          paymentMethod,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};