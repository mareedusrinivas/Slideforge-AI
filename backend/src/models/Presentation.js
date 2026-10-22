const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { getIsMongoConnected, fallbackFile } = require('../config/db');
const logger = require('../utils/logger');

// Mongoose Schema Definition
const ElementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'heading', 'image', 'shape', 'line', 'table', 'code'],
    required: true
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  rotation: { type: Number, default: 0 },
  opacity: { type: Number, default: 1 },
  zIndex: { type: Number, default: 1 },
  content: { type: String, default: '' },
  style: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const SlideSchema = new mongoose.Schema({
  id: { type: String, required: true },
  layout: { type: String, default: 'title-content' },
  background: {
    type: { type: String, default: 'color' },
    value: { type: String, default: '#ffffff' },
    opacity: { type: Number, default: 1 }
  },
  notes: { type: String, default: '' },
  elements: [ElementSchema]
}, { _id: false });

const PresentationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, default: 'Untitled Presentation' },
  description: { type: String, default: '' },
  theme: {
    id: { type: String, default: 'modernIndigo' },
    name: { type: String, default: 'Modern Indigo' },
    primary: { type: String, default: '#4f46e5' },
    secondary: { type: String, default: '#06b6d4' },
    accent: { type: String, default: '#f59e0b' },
    background: { type: String, default: '#ffffff' },
    slideBackground: { type: String, default: '#ffffff' },
    text: { type: String, default: '#111827' },
    mutedText: { type: String, default: '#6b7280' },
    cardBackground: { type: String, default: '#f8fafc' },
    fontHeading: { type: String, default: 'Inter' },
    fontBody: { type: String, default: 'Inter' }
  },
  slideOrder: [{ type: String }],
  slides: [SlideSchema],
  dimensions: {
    width: { type: Number, default: 1920 },
    height: { type: Number, default: 1080 },
    aspectRatio: { type: String, default: '16:9' }
  },
  thumbnail: { type: String, default: '' },
  isArchived: { type: Boolean, default: false }
}, {
  timestamps: true
});

const MongoPresentation = mongoose.model('Presentation', PresentationSchema);

// File-based resilient storage helper for when MongoDB is offline
const readLocalStore = () => {
  try {
    if (!fs.existsSync(fallbackFile)) {
      fs.writeFileSync(fallbackFile, JSON.stringify([]), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(fallbackFile, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    logger.error('Error reading fallback JSON file:', err.message);
    return [];
  }
};

const writeLocalStore = (items) => {
  try {
    const dir = path.dirname(fallbackFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fallbackFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    logger.error('Error writing fallback JSON file:', err.message);
  }
};

// Unified Presentation Repository Layer
const PresentationRepository = {
  async find(query = {}) {
    if (getIsMongoConnected()) {
      return MongoPresentation.find(query).sort({ updatedAt: -1 }).lean();
    }
    const all = readLocalStore();
    let filtered = all.filter(p => !p.isArchived);
    if (query.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
    }
    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  async findById(id) {
    if (getIsMongoConnected()) {
      return MongoPresentation.findById(id).lean();
    }
    const all = readLocalStore();
    return all.find(p => p._id === id || p.id === id) || null;
  },

  async create(data) {
    const now = new Date().toISOString();
    const presentationDoc = {
      _id: uuidv4(),
      title: data.title || 'Untitled Presentation',
      description: data.description || '',
      theme: data.theme || {
        id: 'modernIndigo',
        name: 'Modern Indigo',
        primary: '#4f46e5',
        secondary: '#06b6d4',
        accent: '#f59e0b',
        background: '#ffffff',
        slideBackground: '#ffffff',
        text: '#111827',
        mutedText: '#6b7280',
        cardBackground: '#f8fafc',
        fontHeading: 'Inter',
        fontBody: 'Inter'
      },
      slideOrder: data.slideOrder || [],
      slides: data.slides || [],
      dimensions: data.dimensions || { width: 1920, height: 1080, aspectRatio: '16:9' },
      thumbnail: data.thumbnail || '',
      isArchived: false,
      createdAt: now,
      updatedAt: now
    };

    if (getIsMongoConnected()) {
      return MongoPresentation.create(presentationDoc);
    }

    const all = readLocalStore();
    all.unshift(presentationDoc);
    writeLocalStore(all);
    return presentationDoc;
  },

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    if (getIsMongoConnected()) {
      return MongoPresentation.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, options).lean();
    }

    const all = readLocalStore();
    const index = all.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;

    const existing = all[index];
    const updated = {
      ...existing,
      ...updates,
      _id: existing._id,
      updatedAt: new Date().toISOString()
    };
    all[index] = updated;
    writeLocalStore(all);
    return updated;
  },

  async findByIdAndDelete(id) {
    if (getIsMongoConnected()) {
      return MongoPresentation.findByIdAndDelete(id).lean();
    }

    const all = readLocalStore();
    const index = all.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;

    const removed = all.splice(index, 1)[0];
    writeLocalStore(all);
    return removed;
  }
};

module.exports = {
  MongoPresentation,
  Presentation: PresentationRepository
};
