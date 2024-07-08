import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "yayakix@yahoo.com", // Change to your recipient
  from: "yayakix@gmail.com", // Change to your verified sender
  subject: "Test a message with SendGrid",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};
sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
