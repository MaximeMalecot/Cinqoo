export const SERVICES = {
  REPORT: process.env.REPORT_SERVICE ?? 'report-service',
};

export const PORTS = {
  REPORT: parseInt(process.env.REPORT_PORT) ?? 3000,
};
