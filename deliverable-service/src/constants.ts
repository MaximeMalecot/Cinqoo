export const SERVICES = {
  DELIVERABLE: process.env.DELIVERABLE_SERVICE ?? 'deliverable-service',
  MAILER: process.env.MAILER_SERVICE ?? 'mailer-service',
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
};

export const PORTS = {
  DELIVERABLE: parseInt(process.env.DELIVERABLE_PORT) ?? 3000,
};
