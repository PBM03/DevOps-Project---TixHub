import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  bookingId: string;
  userId: string;
  amount: number;
  method: 'card' | 'upi' | 'netbanking';
  status: 'pending' | 'success' | 'failed';
  transactionId: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: String, required: true, ref: 'Booking' },
    userId: { type: String, required: true, ref: 'User' },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['card', 'upi', 'netbanking'], required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    transactionId: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);