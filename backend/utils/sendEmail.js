// utils/sendEmail.js
const nodemailer = require("nodemailer");
// utils/sendEmail.js
require("dotenv").config(); // ← add this

// …

exports.sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bhmoha158@gmail.com",
      pass: "hkwu sifb bsim btht",
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  });
};
