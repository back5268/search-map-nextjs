import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const connectNodemailer = () => {
  transporter.verify(function (error) {
    if (error) console.log(error);
    else console.log("Nodemailer connect successful!");
  });
};

export const sendMail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  let mailOptions = {
    from: process.env.NODEMAILER_USERNAME,
    to,
    subject,
    text,
    html: html
      ? `<!DOCTYPE html>
          <html>
          <head>
          <style>
            body { font-family: 'Times New Roman', Times, serif; }
            .container { width: 100%; max-width: 1000px; margin: auto; padding: 20px; 
              border: 1px solid #ddd; border-radius: 4px; }
          </style>
          </head>
          <body>
          <div class="container">
            ${html}
          </div>
          </body>
          </html>`
      : undefined,
    attachments,
  };
  try {
    await transporter.sendMail(mailOptions);
    return { status: 1 };
  } catch (error) {
    return { status: 0, mess: error.toString() };
  }
};

export const sendMailUse = async ({ type, params = {}, to }) => {
  const template = await detailTemplateMd({ type, status: 1 });
  if (template) {
    const subject = convertParams(params, template.subject);
    const html = convertParams(params, template.content);
    return await sendMail({ to, subject, html, type });
  } else return { status: 0, mess: "Chưa có mẫu gửi thông báo!" };
};

export const sendMailForgotPassword = async ({ to, username, otp }) => {
  const subject = "Quên mật khẩu!";
  const html = `<p>Bạn hoặc ai đó đã sử dụng email lấy lại mật khẩu tài khoản: <b>${username}</b>!</p>
            <p>Mã xác nhận của bạn là: <b>${otp}</b> </p> <br />
            <p>Lưu ý: Mã xác nhận chỉ được sử dụng 1 lần và có <b>thời hạn trong 5 phút.</b></p>
            <p>Vui lòng không cung cấp mã xác nhận trên cho bất kỳ ai.</p>
            <p>Trân trọng cảm ơn,</p> <br />
            <p>------------------------------------------------------------</p>
            <p>Trân trọng thông báo!</p>`;

  return await sendMail({ to, subject, html });
};
