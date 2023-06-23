export const SERVICES = {
  MAILER: process.env.MESSAGE_SERVICE ?? 'message-service',
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
};

export const PORTS = {
  MESSAGE: parseInt(process.env.MESSAGE_PORT) ?? 3000,
  ORDER: parseInt(process.env.ORDER_PORT) ?? 3000,
};
