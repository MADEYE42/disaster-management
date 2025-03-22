const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = 'xai-wR3Sd9xUd1j9LcIWl57SAbPnK4sOm0czNK9F2YKbrK7y6xwBpXDPm09EcRgWF2Y59lCLufoOzE7d2Qo2';
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: 'You are a mental health support buddy for post-disaster victims. Respond with empathy, validate their feelings, and suggest practical coping strategies like breathing exercises or grounding techniques. Avoid generic responses and focus on their specific disaster-related emotions.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      res.status(error.response.status).json({ error: error.response.data.error || 'API request failed' });
    } else {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));