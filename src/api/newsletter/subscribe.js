export async function handleNewsletterSubscribe(req, res) {
  const { name, email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Please enter your name.' });
  }

  const FORM_ID = process.env.CONVERTKIT_FORM_ID;
  const API_KEY = process.env.CONVERTKIT_API_KEY;

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: API_KEY,
        email: email,
        first_name: name,
        tags: ['Jos Pulse Website'] // Automatically tags new signups
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to subscribe to ConvertKit.');
    }

    return res.status(200).json({ 
      message: `Thanks ${name}! Check your inbox to confirm your subscription.` 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Something went wrong. Please try again.' });
  }
}