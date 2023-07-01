export const SERVICES = {
  MAILER: process.env.MAILER_SERVICE ?? 'mailer-service',
  USER: process.env.USER_SERVICE ?? 'user-service',
};

export const PORTS = {
  MAILER: parseInt(process.env.MAILER_PORT) ?? 3000,
  USER: parseInt(process.env.USER_PORT) ?? 3000,
};

export const TRANSPORTER = {
  host: process.env.MAILER_CLIENT_HOST ?? 'smtp.ethereal.email',
  port: parseInt(process.env.MAILER_CLIENT_PORT) ?? 587,
  auth: {
    user: process.env.MAILER_CLIENT_USER ?? 'user',
    pass: process.env.MAILER_CLIENT_PASS ?? 'pass',
  },
};

export const FROM = process.env.MAILER_CLIENT_FROM ?? 'test@test.com';

export const FRONT_URL = process.env.FRONT_URL ?? 'http://localhost:8080';
