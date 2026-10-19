import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'Stays' },
  sortOrder: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', FAQSchema);
export default FAQ;