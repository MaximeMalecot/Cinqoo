export const secret = process.env.JWT_SECRET ?? 'secret';
export const SERVICES = {
  USER: process.env.USER_SERVICE ?? 'user-service',
};
export const PORTS = {
  USER: parseInt(process.env.USER_PORT) ?? 3000,
};
