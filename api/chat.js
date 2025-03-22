// api/chat.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Get the API key from environment variables
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  try {
    // Define strict context about Sri Balakashi Mahal
    const venueContext = `
      You are a helpful assistant for Sri Balakashi Mahal, a premier wedding venue located in Thekkalur, Coimbatore, Tamilnadu, India. Your role is to assist users with information about the venue, its amenities, booking process, and contact details. Do not provide information unrelated to Sri Balakashi Mahal or its services. If a user asks something outside this scope, politely redirect them to ask about the venue.

      Details about Sri Balakashi Mahal:
      - Location: Om Aditiya Nagar, Thekkalur, Coimbatore-641654, Tamilnadu, India.
      - Capacity: Air-conditioned marriage hall for up to 1,000 guests, dining hall for 350 guests.
      - Rooms: Two luxurious air-conditioned rooms for the bride and groom.
      - Amenities: On-site temple, ample parking, standby generator, inverter, modern kitchen with gas stoves, steam cookers, Eureka Forbes water purifier.
      - Rental Package: Includes vessels, tables, chairs, two A/C halls, and two A/C rooms.
      - Additional Services: Assistance for floral decorations, catering, nadaswaram, videography, etc., arranged at booking.
      - Accessibility: Convenient bus services from all parts of the city.
      - Contact: Email: SriBalaKashi@gmail.com, Phone: 8754860890, 9600374203.
      - Social: Facebook - https://www.facebook.com/people/Sri-BalaKashi-Mahal/100009736363299.
    `;

    // Make request to Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${venueContext}\nUser: ${message}\nAnswer as a helpful venue assistant, focusing only on Sri Balakashi Mahal and its services. If the user asks about unrelated topics, politely redirect them to ask about the venue.`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    }
    return res.status(500).json({ error: 'No response from Gemini API' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
