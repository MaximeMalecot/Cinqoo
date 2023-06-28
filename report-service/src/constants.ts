export const SERVICES = {
  REPORT: process.env.REPORT_SERVICE ?? 'report-service',
  USER: process.env.USER_SERVICE ?? 'user-service',
  PRESTATION: process.env.PRESTATION_SERVICE ?? 'prestation-service',
};

export const PORTS = {
  REPORT: parseInt(process.env.REPORT_PORT) ?? 3000,
  USER: parseInt(process.env.USER_PORT) ?? 3001,
  PRESTATION: parseInt(process.env.PRESTATION_PORT) ?? 3002,
};
