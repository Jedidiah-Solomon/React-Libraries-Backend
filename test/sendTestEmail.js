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
      // text: "Hello world 222 ?", // plain text body
      text: `Hello World!

Thank you for testing our email service. This email is styled with basic HTML formatting.

Best regards,
Your Name

Check out our website for more information: https://example.com`,
      html: `
              <html>
        <body style="font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd;">
                  <tr>
                    <td align="center">
                      <h1 style="color: #333333; margin: 0;">Hello World 22223!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #555555; padding-top: 20px;">
                      <p style="margin: 0;">Thank you for testing our email service. This email is styled with basic HTML formatting.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 20px;">
                      <p style="margin: 0;">Best regards,</p>
                      <p style="margin: 0;"><strong>Your Name</strong></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 20px;">
                      <p style="margin: 0;">
                        Check out
                        <a href="https://example.com" style="color: #1a73e8;">our website</a>
                        for more information.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
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

//node test/sendTestEmail.js
