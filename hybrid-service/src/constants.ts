export const FRONT_URL = process.env.FRONT_URL ?? 'http://localhost:8080';

export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE ?? 'auth-service',
  DELIVERABLE: process.env.DELIVERABLE_SERVICE ?? 'deliverable-service',
  FAVORITE: process.env.FAVORITE_SERVICE ?? 'favorite-service',
  HYBRID: process.env.HYBRID_SERVICE ?? 'hybrid-service',
  MAILER: process.env.MAILER_SERVICE ?? 'mailer-service',
  MESSAGE: process.env.MESSAGE_SERVICE ?? 'message-service',
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
  PAYMENT: process.env.PAYMENT_SERVICE ?? 'payment-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
  REPORT: process.env.REPORT_SERVICE ?? 'report-service',
  REVIEW: process.env.REVIEW_SERVICE ?? 'review-service',
  USER: process.env.USER_SERVICE ?? 'user-service',
  STRIPE: process.env.STRIPE_SERVICE ?? 'stripe-service',
};

export const PORTS = {
  AUTH: parseInt(process.env.AUTH_PORT) ?? 3000,
  DELIVERABLE: parseInt(process.env.DELIVERABLE_PORT) ?? 3000,
  FAVORITE: parseInt(process.env.FAVORITE_PORT) ?? 3000,
  HYBRID: parseInt(process.env.HYBRID_PORT) ?? 3001,
  HYBRID_MS: parseInt(process.env.HYBRID_MS_PORT) ?? 3000,
  MESSAGE: parseInt(process.env.MESSAGE_PORT) ?? 3000,
  MAILER: parseInt(process.env.MAILER_PORT) ?? 3000,
  ORDER: parseInt(process.env.ORDER_PORT) ?? 3000,
  PAYMENT: parseInt(process.env.PAYMENT_PORT) ?? 3000,
  PRESTATION: parseInt(process.env.PRESTATION_PORT) ?? 3000,
  REPORT: parseInt(process.env.REPORT_PORT) ?? 3000,
  REVIEW: parseInt(process.env.REVIEW_PORT) ?? 3000,
  USER: parseInt(process.env.USER_PORT) ?? 3000,
  STRIPE: parseInt(process.env.STRIPE_PORT) ?? 3000,
};
