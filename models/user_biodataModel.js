const mongoose = require("mongoose");

const userBiodataSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    smsCode: { type: String, required: false },
  },
  { collection: "user_biodata" }
);

const UserBiodata =
  mongoose.models.UserBiodata ||
  mongoose.model("UserBiodata", userBiodataSchema);

module.exports = UserBiodata;
