export const SERVICES = {
  MAILER: process.env.MESSAGE_SERVICE ?? 'message-service',
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
  HYBRID: process.env.HYBRID_SERVICE ?? 'hybrid-service',
};

export const PORTS = {
  MESSAGE: parseInt(process.env.MESSAGE_PORT) ?? 3000,
  ORDER: parseInt(process.env.ORDER_PORT) ?? 3000,
  HYBRID_MS: parseInt(process.env.HYBRID_MS_PORT) ?? 3000,
};
