import { Request, Response } from 'express';
import Booking from '../models/Booking.model';
import Event from '../models/Event.model';
import Payment from '../models/Payment.model';

export const createBooking = async (req: any, res: Response) => {
  try {
    const { eventId, seats, tier, total, paymentMethod } = req.body;
    const userId = req.user._id;

    // Check if seats are available
    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check seat availability
    for (const seat of seats) {
      if (event.availableSeats?.get(seat) === false) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat} is already booked`,
        });
      }
    }

    // Lock seats
    for (const seat of seats) {
      event.availableSeats.set(seat, false);
    }
    await event.save();

    // Create booking
    const bookingId = 'TIX-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const booking = await Booking.create({
      bookingId,
      userId,
      eventId,
      seats,
      tier,
      total,
      status: 'confirmed', // For demo, directly confirm
      paymentMethod,
    });

    // Create payment record
    const payment = await Payment.create({
      bookingId: booking._id,
      userId,
      amount: total,
      method: paymentMethod,
      status: 'success',
      transactionId: 'TXN-' + Date.now(),
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
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserBookings = async (req: any, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release seats (optional)
    const event = await Event.findOne({ id: booking.eventId });
    if (event) {
      for (const seat of booking.seats) {
        event.availableSeats.set(seat, true);
      }
      await event.save();
    }

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};