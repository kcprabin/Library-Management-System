import e from "express";
import nodemailer from "nodemailer";


  const mailSender = async (email, resetCode) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use true for port 465, false for port 587
        auth: {
          user: `${process.env.MAIL_USER}`,
          pass: `${process.env.MAIL_PASSWORD}`,
        },
      });
  
      // Send an email using async/await
      (async () => {
        const info = await transporter.sendMail({
          from: `"Library Management System" <${process.env.MAIL_USER}>`,
          to: email,
          subject: "Your library account has been created",
          text: "your code for resetting the password is: " + resetCode, // Plain-text version of the message
          html:
            "<b>Your code for resetting the password is: " + resetCode + "</b>", // HTML version of the message
        });
      })();
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send email" }); 
      
    }
  };


export default mailSender;
