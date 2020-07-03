const nodemailer = require("nodemailer");

const sendEmail = async options => {
  // 1. Create a transporter
  // if you use gmail, you should make your gmail less secure
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2. define email options
  const mailOptions = {
    from: `Mustafa Hayati <mustafa@source.com>`, // this can be anything you want (IDK, probably) like bill@microsoft.com
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3. send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
