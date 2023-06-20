export const SERVICES = {
  USER: process.env.USER_SERVICE ?? 'user-service',
  STRIPE: process.env.STRIPE_SERVICE ?? 'stripe-service',
};

export const PORTS = {
  USER: parseInt(process.env.USER_PORT) ?? 3000,
};
