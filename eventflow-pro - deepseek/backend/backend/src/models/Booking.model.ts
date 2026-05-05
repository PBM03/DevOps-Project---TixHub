import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  userId: string;
  eventId: string;
  seats: string[];
  tier: string;
  total: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  paymentMethod: string;
  paymentId?: string;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, ref: 'User' },
    eventId: { type: String, required: true, ref: 'Event' },
    seats: [{ type: String, required: true }],
    tier: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'pending' },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);