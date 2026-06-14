import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Detailed Profile
  profile: {
    age: Number,
    gender: { type: String, enum: ['Male', 'Female', 'Transgender', 'Other'] },
    location: {
      state: String,
      district: String,
      isRural: Boolean,
    },
    socioEconomic: {
      familyIncome: Number,
      caste: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'EWS'] },
      disabilityStatus: { type: Boolean, default: false },
      employmentStatus: { type: String, enum: ['Employed', 'Unemployed', 'Self-Employed', 'Student'] },
    },
    status: {
      isFarmer: { type: Boolean, default: false },
      isBusinessOwner: { type: Boolean, default: false },
      isStudent: { type: Boolean, default: false },
    },
    academic: {
      educationLevel: String,
      marks: Number,
      currentYear: Number,
    },
    documents: [{
      type: { type: String }, // e.g., 'Aadhaar', 'Income Certificate'
      url: String,
      isVerified: { type: Boolean, default: false },
    }],
    savedSchemes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
    appliedSchemes: [{
      scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' },
      status: { type: String, enum: ['In Progress', 'Applied', 'Rejected', 'Approved'], default: 'In Progress' },
      appliedAt: Date,
    }]
  }
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
