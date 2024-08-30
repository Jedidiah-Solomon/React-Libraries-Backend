const { Vonage } = require("@vonage/server-sdk");
const { NEXMO_API_KEY, NEXMO_API_SECRET, NEXMO_PHONE_NUMBER } = process.env;

const vonage = new Vonage({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET,
});

exports.sendSMS = async (req, res) => {
  const { to, body } = req.body;

  try {
    vonage.message.sendSms(
      NEXMO_PHONE_NUMBER,
      to,
      body,
      (err, responseData) => {
        if (err) {
          res.status(500).json({ success: false, error: err.message });
        } else if (responseData.messages[0].status !== "0") {
          res.status(500).json({
            success: false,
            error: responseData.messages[0].error_text,
          });
        } else {
          res.status(200).json({
            success: true,
            message: responseData.messages[0].message_id,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
