import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  tls: {
    ciphers: "TLSv1.2",
    rejectUnauthorized: true,
  },
  auth: {
    user: process.env.NODEMAIL,
    pass: process.env.NODEMAIL_PASSWORD,
  },
});

const sendContactEmail = async (email, subject, message) => {
  const mailOptions = {
    to: process.env.NODEMAIL,
    from: process.env.NODEMAIL,
    subject: email,
    text: subject + "\n\n" + message,
  };

  return transporter.sendMail(mailOptions);
};

export { sendContactEmail };
