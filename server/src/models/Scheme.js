import mongoose from 'mongoose';

const SchemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  ministry: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Social welfare & Empowerment', 
      'Education & Learning', 
      'Agriculture,Rural & Environment', 
      'Business & Entrepreneurship', 
      'Women and Child',
      'Skills & Employment',
      'Banking,Financial Services and Insurance',
      'Health & Wellness',
      'Sports & Culture',
      'Housing & Shelter',
      'Science, IT & Communications',
      'Transport & Infrastructure',
      'Travel & Tourism',
      'Utility & Sanitation',
      'Public Safety,Law & Justice'
    ],
  },
  description: {
    raw: { type: String, required: true },
    simplified: {
      en: { type: String },
      hi: { type: String },
    },
  },
  benefits: {
    type: String,
    required: true,
  },
  amount: {
    type: Number, // If applicable
  },
  eligibilityRules: {
    age: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 150 },
    },
    gender: {
      type: [String],
      enum: ['Male', 'Female', 'Transgender', 'All'],
      default: ['All'],
    },
    incomeLimit: {
      type: Number, // Annual family income limit
    },
    states: {
      type: [String],
      default: ['All'],
    },
    castes: {
      type: [String],
      default: ['All'],
    },
    education: {
      type: [String], // e.g., ['10th', '12th', 'Graduate']
      default: ['All'],
    },
    isFarmer: { type: Boolean, default: null }, // null means doesn't matter
    isRural: { type: Boolean, default: null },
    isStudent: { type: Boolean, default: null },
    customRules: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    }
  },
  requiredDocuments: [String],
  officialLink: String,
  deadline: Date,
  isActive: { type: Boolean, default: true },
  schemeType: {
    type: String,
    enum: ['Central', 'State'],
    default: 'Central',
  },
  tags: [String],
}, { timestamps: true });

export default mongoose.model('Scheme', SchemeSchema);
