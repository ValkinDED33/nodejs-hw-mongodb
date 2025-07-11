import nodemailer from 'nodemailer';

import { getEnvVar } from './getEnvVar.js';

const transport = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: getEnvVar('SMTP_PORT'),
  secure: false,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export function sendMail(to, subject, html) {
  return transport.sendMail({
    from: getEnvVar('SMTP_FROM'),
    to,
    subject,
    html,
  });
}

