import mongoose from 'mongoose';

const ChatbotMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',                          
    required: false,                      
    default: null
  },
  sessionId: {
    type: String,                         // Groups messages together into a single conversation stream
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],                // Identifies who sent the message
    required: true
  },
  intent: {
    type: String,                         // e.g., 'book_ticket', 'find_restaurant', 'greet'
    default: 'unknown',
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,                     // Records exactly when the message was sent
    required: true
  }
});

// Compound index to quickly retrieve chronological history for a specific chat session
ChatbotMessageSchema.index({ sessionId: 1, timestamp: 1 });

const ChatbotMessage = mongoose.model('ChatbotMessage', ChatbotMessageSchema);

export default ChatbotMessage;
