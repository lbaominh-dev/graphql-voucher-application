import {
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
  SMTP_USERNAME,
} from "../../config";

import nodemailer from "nodemailer";
import { Message } from "./email.interface";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const config: SMTPTransport.Options = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,

  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
};


const transporter = nodemailer.createTransport(config);

const sendMailVoucher = async (to: string, voucherCode: string) => {
  const subject = "Voucher code";
  const text = `Your voucher code is: ${voucherCode}`;
  const html = `<p>Your voucher code is: <strong>${voucherCode}</strong></p>`;
  await sendEmail(to, subject, text, html);
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
): Promise<void> => {
  const msg: Message = {
    from: `<${SMTP_USERNAME}> ${SMTP_USER}`,
    to,
    subject,
    text,
    html,
  };
  await transporter.sendMail(msg);
};

const emailService = {
  sendMailVoucher,
};

export default emailService;
