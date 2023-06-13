export const SERVICES = {
  PAYMENT: process.env.PAYMENT_SERVICE ?? 'payment-service',
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
};

export const PORTS = {
  PAYMENT: parseInt(process.env.PAYMENT_PORT) ?? 3000,
};
