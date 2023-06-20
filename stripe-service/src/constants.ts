export const SERVICES = {
  PAYMENT: process.env.PAYMENT_SERVICE ?? 'payment-service',
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
  USER: process.env.USER_SERVICE ?? 'user-service',
};

export const PORTS = {
  STRIPE: parseInt(process.env.STRIPE_PORT) ?? 3000,
};
