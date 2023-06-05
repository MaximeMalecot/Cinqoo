export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE ?? 'auth-service',
  DELIVERABLE: process.env.DELIVERABLE_SERVICE ?? 'deliverable-service',
  FAVORITE: process.env.FAVORITE_SERVICE ?? 'favorite-service',
  FRONT: process.env.FRONT ?? 'front',
  ORDER: process.env.ORDER_SERVICE ?? 'order-service',
  PAYMENT: process.env.PAYMENT_SERVICE ?? 'payment-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
  REPORT: process.env.REPORT_SERVICE ?? 'report-service',
  REVIEW: process.env.REVIEW_SERVICE ?? 'review-service',
  USER: process.env.USER_SERVICE ?? 'user-service',
};

export const PORTS = {
  AUTH: parseInt(process.env.AUTH_PORT) ?? 3000,
  DELIVERABLE: parseInt(process.env.DELIVERABLE_PORT) ?? 3000,
  FAVORITE: parseInt(process.env.FAVORITE_PORT) ?? 3000,
  FRONT: parseInt(process.env.FRONT_PORT) ?? 8080,
  ORDER: parseInt(process.env.ORDER_PORT) ?? 3000,
  PAYMENT: parseInt(process.env.PAYMENT_PORT) ?? 3000,
  PRESTATION: parseInt(process.env.PRESTATION_PORT) ?? 3000,
  REPORT: parseInt(process.env.REPORT_PORT) ?? 3000,
  REVIEW: parseInt(process.env.REVIEW_PORT) ?? 3000,
  USER: parseInt(process.env.USER_PORT) ?? 3000,
};