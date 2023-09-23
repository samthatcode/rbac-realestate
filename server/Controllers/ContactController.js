const nodemailer = require('nodemailer');
// const { google } = require('googleapis'); 

// const oauth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
// );

// oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN }); 

// const newAccessToken = oauth2Client.getAccessToken(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_VERIFY,
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
    const emailContent =
      `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Contact Form Submission</h2>
          <p style="font-size: 16px;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 16px;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 16px;"><strong>Phone:</strong> ${phone}</p>
          <p style="font-size: 16px;"><strong>Subject:</strong> ${subject}</p>
          <p style="font-size: 16px;"><strong>Message:</strong> ${message}</p>
        </div>`
      ;

    // Email configuration for sending the contact form submission to the admin 
    const adminEmail = process.env.ADMIN_EMAIL;  // Replace with your admin's email

    const adminMailOptions = {
      from: email,
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


