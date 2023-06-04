export const SERVICES = {
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
};

export const PORTS = {
  PRESTATION: parseInt(process.env.PRESTATION_PORT) ?? 3000,
};
