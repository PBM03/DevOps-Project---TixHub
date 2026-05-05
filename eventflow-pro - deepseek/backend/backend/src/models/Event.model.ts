import mongoose, { Schema, Document } from "mongoose";

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
  priceTiers: Array<{ id: string; name: string; price: number; color: string }>;
  duration: string;
}

const EventSchema = new Schema<IEvent>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    artists: [{ name: String, role: String }],
    rating: { type: Number, default: 4.5 },
    popularity: { type: Number, default: 0 },
    trending: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    priceTiers: [{ id: String, name: String, price: Number, color: String }],
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ ADD THIS (critical fix)
EventSchema.index(
  { title: "text", description: "text" },
  { language_override: "none" }
);

export default mongoose.model<IEvent>("Event", EventSchema);