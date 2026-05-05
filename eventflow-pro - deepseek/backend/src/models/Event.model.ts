import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceTier {
  id: string;
  name: string;
  price: number;
  color: string;
}

export interface IEvent extends Document {
  id: string;
  title: string;
  category: string;
  image: string;
  date: Date;
  venue: string;
  city: string;
  description: string;
  artists: Array<{ name: string; role: string }>;
  rating: number;
  popularity: number;
  trending?: boolean;
  featured?: boolean;
  priceTiers: IPriceTier[];
  duration: string;
  language: string;
  availableSeats: Map<string, boolean>; // seatId -> isAvailable
  createdAt: Date;
  updatedAt: Date;
}

const PriceTierSchema = new Schema<IPriceTier>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  color: { type: String, required: true },
});

const EventSchema = new Schema<IEvent>(
  {
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    artists: [{ name: String, role: String }],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    popularity: { type: Number, default: 0, min: 0, max: 100 },
    trending: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    priceTiers: [PriceTierSchema],
    duration: { type: String, required: true },
    language: { type: String, required: true },
    availableSeats: { type: Map, of: Boolean, default: {} },
  },
  {
    timestamps: true,
  }
);

// Create index for search
EventSchema.index({ title: 'text', description: 'text', category: 'text', city: 'text' });

export default mongoose.model<IEvent>('Event', EventSchema);