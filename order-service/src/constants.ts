export const SERVICES = {
    ORDER: process.env.ORDER_SERVICE ?? 'order-service',
};

export const PORTS = {
    ORDER: parseInt(process.env.ORDER_PORT) ?? 3000,
};