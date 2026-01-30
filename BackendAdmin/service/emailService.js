const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html, templateId = null, dynamicTemplateData = {}) => {
  const msg = {
    to,
    from: process.env.SENDGRID_EMAIL, // verified sender
    subject,
  };

  if (text) {
    msg.text = text;
  }

  if (html) {
    msg.html = html;
  }

  if (templateId) {
    msg.templateId = templateId;
    msg.dynamic_template_data = dynamicTemplateData;
  }

  await sgMail.send(msg);
};

module.exports = sendEmail;
