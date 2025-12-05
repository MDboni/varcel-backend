// src/utility/emailUtility.js
import nodemailer from "nodemailer";

const SendEmail = async (EmailTo, EmailText, EmailSubject) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //  Email template
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: EmailTo,
      subject: EmailSubject,
      html: `
        <div style="font-family:Arial;padding:20px;background:#f7f7f7">
          <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:8px;">
            <h2 style="color:#0d6efd;text-align:center;">Your OTP Code</h2>
            <p style="font-size:18px;color:#333;text-align:center;">
              <b>${EmailText}</b>
            </p>
            <p style="font-size:14px;color:#666;text-align:center;">This OTP will expire in 10 minutes.</p>
            <br/>
            <p style="font-size:12px;color:#999;text-align:center;">
              Best Regards,<br/> <b>MD BONI AMIN JAYED</b>
            </p>
          </div>
        </div>
      `,
    };

    //  Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    return { success: true };
  } catch (error) {
    console.error("Email Error:", error.message);
    return { success: false, message: error.message };
  }
};

export default SendEmail;
