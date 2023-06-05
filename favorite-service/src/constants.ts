export const SERVICES = {
    FAVORITE: process.env.FAVORITE_SERVICE ?? 'favorite-service',
};

export const PORTS = {
    FAVORITE: parseInt(process.env.FAVORITE_PORT) ?? 3000,
};