export const SERVICES = {
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
  STRIPE: process.env.STRIPE_SERVICE ?? 'stripe-service',
};

export const PORTS = {
  PRESTATION: parseInt(process.env.PRESTATION_PORT) ?? 3000,
};
