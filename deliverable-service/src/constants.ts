export const SERVICES = {
    DELIVERABLE: process.env.DELIVERABLE_SERVICE ?? 'deliverable-service',
};

export const PORTS = {
    DELIVERABLE: parseInt(process.env.DELIVERABLE_PORT) ?? 3000,
};
