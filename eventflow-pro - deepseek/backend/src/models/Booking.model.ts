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
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    eventId: {
      type: String,
      required: true,
      ref: 'Event',
    },
    seats: [{ type: String, required: true }],
    tier: { type: String, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'pending',
    },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String },
    bookingDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ eventId: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);