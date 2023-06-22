export const SERVICES = {
  MAILER: process.env.MAILER_SERVICE ?? 'mailer-service',
};

export const PORTS = {
  MAILER: parseInt(process.env.MAILER_PORT) ?? 3000,
};
