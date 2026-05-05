import { Request, Response } from 'express';
import Event from '../models/Event.model';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { category, city, search, trending, featured, limit = 20 } = req.query;

    let query: any = {};

    if (category) query.category = category;
    if (city) query.city = city;
    if (trending === 'true') query.trending = true;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$text = { $search: search as string };
    }

    const events = await Event.find(query)
      .sort({ date: 1, popularity: -1 })
      .limit(Number(limit));

    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createEvent = async (req: any, res: Response) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOneAndDelete({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};