export const SERVICES = {
  USER: process.env.USER_SERVICE ?? 'user-service',
  STRIPE: process.env.STRIPE_SERVICE ?? 'stripe-service',
  MAILER: process.env.MAILER_SERVICE ?? 'mailer-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
};

export const PORTS = {
  USER: parseInt(process.env.USER_PORT) ?? 3000,
  PRESTATION: parseInt(process.env.PRESTATION_PORT) ?? 3000,
};
