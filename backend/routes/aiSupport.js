import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Mistral } from '@mistralai/mistralai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

app.post('/api/support', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await mistral.chat.complete({
      model: 'mistral-small-latest', // Free / low-tier model perfect for customer support
      messages: [
        {
          role: 'system',
          content: `You are the friendly AI Support Assistant for Jos Pulse. Help vendors and event-goers with questions about venues, tickets, event listings, and platform features. Keep responses concise and helpful.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      maxTokens: 300
    });

    const reply = response.choices[0].message.content;
    res.json({ success: true, reply });
  } catch (error) {
    console.error('Mistral API Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate support response' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));