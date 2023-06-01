import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const artifactRegistryNames = [
  "auth-service",
  "gateway-service",
  "prestation-service",
  "review-service",
  "user-service",
];
const dbNames = ["prestation", "review", "user"];

// Create Artifact Registries
artifactRegistryNames.forEach((registryName) => {
  new gcp.artifactregistry.Repository(registryName, {
    repositoryId: registryName,
    format: "DOCKER",
    location: "europe-west9",
  });
});

// Create a PostgreSQL instance and 3 databases
const postgresInstance = new gcp.sql.DatabaseInstance("cinqoo", {
  databaseVersion: "POSTGRES_13",
  region: "europe-west9",
  deletionProtection: false,
  settings: {
    tier: "db-f1-micro",
  },
});

console.log(process.env.DB_USER, process.env.DB_PWD);

export const user = new gcp.sql.User("user", {
  instance: postgresInstance.name,
  name: process.env.DB_USER || "user",
  password: process.env.DB_PWD || "Password123+=",
});

dbNames.forEach((dbName) => {
  new gcp.sql.Database(dbName, {
    instance: postgresInstance.name,
    name: dbName,
  });
});

// Export the PostgreSQL instance private and public IP addresses
export const privateIp = postgresInstance.ipAddresses.apply(
  (ipAddresses) =>
    ipAddresses.find((addr) => addr.type === "PRIVATE")?.ipAddress || ""
);
export const publicIp = postgresInstance.ipAddresses.apply(
  (ipAddresses) =>
    ipAddresses.find((addr) => addr.type === "PRIMARY")?.ipAddress || ""
);
