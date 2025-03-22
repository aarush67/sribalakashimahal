// api/contact.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set your SendGrid API key in Vercel environment variables

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cf_name, cf_mobile } = req.body;

  if (!cf_name || !cf_mobile) {
    return res.status(400).json({ message: 'Name and mobile are required' });
  }

  const msg = {
    to: 'SriBalaKashi@gmail.com',
    from: 'no-reply@sribalakashimahal.com', // Replace with your verified sender email
    subject: 'New Enquiry from Sri BalaKashi Mahal Website',
    text: `Name: ${cf_name}\nMobile: ${cf_mobile}`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send enquiry' });
  }
};
