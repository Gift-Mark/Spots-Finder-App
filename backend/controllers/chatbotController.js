import ChatbotMessage from "../models/chatbot.js";
import Place from "../models/Place.js";
import Event from "../models/Events.js";

/**
 * @desc    Send a message to the AI Chatbot and get an automated response
 * @route   POST /api/chatbot/message
 * @access  Public (Guest & Logged-in Users)
 */
export const sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: "sessionId and message are required.",
      });
    }

    const userId = req.user ? req.user._id : null;
    const cleanMessage = message.trim();

    // 1. Save User Message
    const userMsg = await ChatbotMessage.create({
      userId,
      sessionId,
      message: cleanMessage,
      sender: "user",
      timestamp: new Date(),
    });

    // 2. Simple Intent Classifier & Dynamic Data Lookup
    let botResponseText = "";
    let detectedIntent = "general_query";
    const lowerMessage = cleanMessage.toLowerCase();

    if (lowerMessage.includes("restaurant") || lowerMessage.includes("food") || lowerMessage.includes("eat")) {
      detectedIntent = "find_restaurant";
      const places = await Place.find({ category: "restaurant", status: "active" }).limit(3);
      if (places.length > 0) {
        const placeNames = places.map((p) => p.name).join(", ");
        botResponseText = `Here are some top places to eat in Jos: ${placeNames}. Check out our Explore page for details!`;
      } else {
        botResponseText = "Looking for food in Jos? You can browse our active restaurant listings in the Explore section!";
      }
    } else if (lowerMessage.includes("event") || lowerMessage.includes("festival") || lowerMessage.includes("concert")) {
      detectedIntent = "find_event";
      const events = await Event.find({ status: "upcoming" }).limit(3);
      if (events.length > 0) {
        const eventTitles = events.map((e) => e.title).join(", ");
        botResponseText = `Upcoming events happening in Jos include: ${eventTitles}. Check the Events page to grab tickets!`;
      } else {
        botResponseText = "There are exciting events coming up on Plateau! Head over to the Events tab to see what's happening.";
      }
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      detectedIntent = "greet";
      botResponseText = "Greetings from Jos Pulse! 🏔️ How can I help you discover spots, events, or highland escapes today?";
    } else {
      detectedIntent = "unknown";
      botResponseText = "I'm your Jos Pulse guide! Ask me about restaurants, upcoming festivals, nightlife, or places to visit across Plateau State.";
    }

    // Update user message intent
    userMsg.intent = detectedIntent;
    await userMsg.save();

    // 3. Save Bot Response
    const botMsg = await ChatbotMessage.create({
      userId,
      sessionId,
      message: botResponseText,
      sender: "bot",
      intent: detectedIntent,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      data: {
        userMessage: userMsg,
        botMessage: botMsg,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get complete chat history for a session
 * @route   GET /api/chatbot/history/:sessionId
 * @access  Public
 */
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Leverages ChatbotMessageSchema.index({ sessionId: 1, timestamp: 1 })
    const history = await ChatbotMessage.find({ sessionId }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Clear chat history for a session
 * @route   DELETE /api/chatbot/history/:sessionId
 * @access  Public
 */
export const clearChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    await ChatbotMessage.deleteMany({ sessionId });

    res.status(200).json({
      success: true,
      message: "Chat session cleared.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};