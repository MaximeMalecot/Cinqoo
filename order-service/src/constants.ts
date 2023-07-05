export const SERVICES = {
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
  PAYMENT: process.env.PAYMENT_SERVICE ?? 'payment-service',
  MAILER: process.env.MAILER_SERVICE ?? 'mailer-service',
  HYBRID: process.env.HYBRID_SERVICE ?? 'hybrid-service',
};

export const PORTS = {
  ORDER: parseInt(process.env.ORDER_PORT) ?? 3000,
  HYBRID_MS: parseInt(process.env.HYBRID_MS_PORT) ?? 3000,
};

export const FRONT_URL = process.env.FRONT_URL ?? 'http://localhost:8080';
