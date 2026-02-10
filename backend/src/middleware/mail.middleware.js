import e from "express";
import nodemailer from "nodemailer";

try {
  const mailSender = async (email, resetCode) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // Use true for port 465, false for port 587
      auth: {
        user: `${process.env.MAIL_SERVICE}`,
        pass: `${process.env.MAIL_KEY}`,
      },
    });

    // Send an email using async/await
    (async () => {
      const info = await transporter.sendMail({
        from: '"Library Management System" <lms@ethereal.email>',
        to: email,
        subject: "Your library account has been created",
        text: "your code for resetting the password is: " + resetCode, // Plain-text version of the message
        html:
          "<b>Your code for resetting the password is: " + resetCode + "</b>", // HTML version of the message
      });
    })();
  };
} catch (error) {
  console.error("Error sending email:", error);
}

export default mailSender;
