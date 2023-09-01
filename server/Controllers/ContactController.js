const nodemailer = require('nodemailer'); 

// Create a transporter for sending emails (you need to set up your email service credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: { 
    type: 'OAuth2',
    pass: process.env.ADMIN_PASSWORD,
    user: process.env.ADMIN_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN
  },
});

// Your contact form handler
module.exports.contactFormHandler = async (req, res, next) => {
  try {
    // Extract form data from the request body
    const { name, email, subject, message, phone } = req.body;

    // Create the email content
    const emailContent = `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    // Email configuration for sending the contact form submission to the admin
    const adminEmail = process.env.ADMIN_VERIFY;  // Replace with your admin's email
    const adminMailOptions = {
      from: process.env.ADMIN_EMAIL, // Replace with your sending email
      to: adminEmail,
      subject: `New Contact Form Submission: ${subject}`,
      html: emailContent,
    };

    // Send the email to the admin
    await transporter.sendMail(adminMailOptions);

    // Respond to the client with a success message
    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};


