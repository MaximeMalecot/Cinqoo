export const SERVICES = {
  REVIEW: process.env.REVIEW_SERVICE ?? 'review-service',
};

export const PORTS = {
  REVIEW: parseInt(process.env.REVIEW_PORT) ?? 3000,
};
