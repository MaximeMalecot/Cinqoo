export const SERVICES = {
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
};

export const PORTS = {
  ORDER: parseInt(process.env.ORDER_PORT) ?? 3000,
};
