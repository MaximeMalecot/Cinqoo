export const SERVICES = {
  FAVORITE: process.env.FAVORITE_SERVICE ?? 'favorite-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
};

export const PORTS = {
  FAVORITE: parseInt(process.env.FAVORITE_PORT) ?? 3000,
  PRESTATION: parseInt(process.env.PRESTATION_PORT) ?? 3000,
};
