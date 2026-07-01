const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const cafeSchema = new mongoose.Schema({
  cafeId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  logo: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  description: { type: String, default: '' },
  cuisine: [{ type: String }],
  openTime: { type: String, default: '09:00' },
  closeTime: { type: String, default: '22:00' },
  theme: { type: String, default: 'classic-dark', enum: ['classic-dark', 'crimson-velvet', 'matcha-green', 'sunset-orange', 'ocean-blue', 'royal-gold', 'midnight-teal', 'berry-luxe'] },
  isActive: { type: Boolean, default: true },
  tableCount: { type: Number, default: 10, min: 1, max: 200 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

cafeSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

cafeSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
cafeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

cafeSchema.index({ isActive: 1 });

module.exports = mongoose.model('Cafe', cafeSchema);
