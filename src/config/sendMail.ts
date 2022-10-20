// main.js
const nodemailer = require("nodemailer");

const onSendVerifyToEmail = (receiver: String, token: String) => {
  // setup mail transporter service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "taekungkub16@gmail.com", // your email
      pass: "rxtvguubwurbnfvu", // your password
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
    if (err) console.log(err);
    else console.log(info);
  });
};

export default onSendVerifyToEmail;
