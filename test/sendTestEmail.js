const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using Mailtrap
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "35fac55975edde", // Mailtrap username
    pass: "08e49ba24b9b6c", // Mailtrap password
  },
});

// Function to send a test email
const sendTestEmail = async () => {
  try {
    // Define email options
    let info = await transport.sendMail({
      from: process.env.USER, // sender address
      to: "jedybrownventures@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #333;
              }
              p {
                color: #555;
              }
              a {
                color: #1a73e8;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Hello World!</h1>
              <p>Thank you for testing our email service. This email is styled with CSS and includes HTML content.</p>
              <p>Best regards,</p>
              <p><strong>Your Name</strong></p>
              <p>Check out <a href="https://example.com" target="_blank">our website</a> for more information.</p>
            </div>
          </body>
        </html>
      `, // HTML body content
    });

    // Log the message ID for debugging
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    // Log any errors
    console.error("Error sending email:", error);
  }
};

// Call the function to send an email
sendTestEmail();
