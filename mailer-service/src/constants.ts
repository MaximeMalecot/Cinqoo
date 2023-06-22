export const SERVICES = {
  MAILER: process.env.MAILER_SERVICE ?? 'mailer-service',
  USER: process.env.USER_SERVICE ?? 'user-service',
};

export const PORTS = {
  MAILER: parseInt(process.env.MAILER_PORT) ?? 3000,
  USER: parseInt(process.env.USER_PORT) ?? 3000,
};
