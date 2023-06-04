export const secret = process.env.JWT_SECRET ?? 'secret';
export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE ?? 'auth-service',
  USER: process.env.USER_SERVICE ?? 'user-service',
};
export const PORTS = {
  AUTH: parseInt(process.env.AUTH_PORT) ?? 3000,
  USER: parseInt(process.env.USER_PORT) ?? 3000,
};
