// models/User.js
import mongoose from 'mongoose';

const GameStateSchema = new mongoose.Schema({
  currentPath: {
    type: String,
    enum: ['job-saving', 'business-typhoon', 'early-retirement', null],
    default: null
  },
  progress: {
    type: Number,
    default: 0
  },
  salary: {
    type: Number,
    default: 0
  },
  savings: {
    type: Number,
    default: 0
  },
  expenses: [{
    category: String,
    amount: Number,
    recurring: Boolean
  }],
  investments: [{
    type: String,
    amount: Number,
    returnRate: Number
  }],
  businessDetails: {
    capital: Number,
    employees: Number,
    revenue: Number,
    expenses: Number,
    inventory: Number
  },
  loans: [{
    amount: Number,
    interestRate: Number,
    term: Number,
    remainingAmount: Number
  }],
  lastPlayed: Date
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  image: String,
  gameState: {
    type: GameStateSchema,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);