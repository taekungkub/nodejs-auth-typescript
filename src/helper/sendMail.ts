import { nodemailerCredentials } from "../config/globalConfig";

// main.js
const nodemailer = require("nodemailer");

const onSendVerifyToEmail = (receiver: string, token: string) => {
  return new Promise((resolve, reject) => {
    // setup mail transporter service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodemailerCredentials.email, // your email
        pass: nodemailerCredentials.password, // your password
      },
    });

    // setup email data with unicode symbols
    const mailOptions = {
      from: "no-reply@test.com", // sender
      to: receiver,
      subject: "Verify Your  Account", // Mail subject
      html: `<b>You're receiving this email because you chose to verify your account through this email address. 
      <br/>
      ${token}
      </b>`, // HTML body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (err: any, info: any) {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

export default onSendVerifyToEmail;
