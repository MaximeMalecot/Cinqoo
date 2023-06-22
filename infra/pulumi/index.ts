import * as gcp from "@pulumi/gcp";
import { project } from "@pulumi/gcp/config";
import * as mongodbatlas from "@pulumi/mongodbatlas";
import * as pulumi from "@pulumi/pulumi";
import * as dotenv from "dotenv";
dotenv.config();

const repo = "MaximeMalecot/challenge-s2-g19";
const gcpLocation = "europe-west9";
const atlasGcpLocation = "EUROPE_WEST_9";
const DB_USER = process.env.DB_USER ?? "cinqoo-admin";
const DB_PWD = process.env.DB_PWD ?? "cinqoo-admin-pwd";
const organization = mongodbatlas.getRolesOrgId({});

// Create Artifact Registries and give access to all users
const repository = new gcp.artifactregistry.Repository("cinqoo", {
    project: project,
    repositoryId: "challenge",
    format: "DOCKER",
    location: gcpLocation,
});

// Allow all users to read the repository

new gcp.artifactregistry.RepositoryIamMember("publicRead", {
    project: project,
    location: repository.location,
    repository: repository.name,
    role: "roles/artifactregistry.reader",
    member: "allUsers",
});

// Create Service Account for CI/CD

const serviceAccount = new gcp.serviceaccount.Account("githubSA", {
    project: project,
    accountId: "github-sa",
    displayName: "Service Account for Github Actions",
});

// Create WIDP for CI/CD

const widp = new gcp.iam.WorkloadIdentityPool("github-widp-cinqoo", {
    project: project,
    displayName: "WIDP for Github Actions",
    workloadIdentityPoolId: "github-widp-cinqoo",
});

// Create OIDC Provider for CI/CD

const oidcProvider = new gcp.iam.WorkloadIdentityPoolProvider(
    "github-oidc-cinqoo",
    {
        project: project,
        workloadIdentityPoolId: widp.workloadIdentityPoolId,
        workloadIdentityPoolProviderId: "github-oidc",
        displayName: "OIDC Provider for Github Actions",
        attributeMapping: {
            "google.subject": "assertion.sub",
            "attribute.actor": "assertion.actor",
            "attribute.repository": "assertion.repository",
        },
        oidc: {
            issuerUri: "https://token.actions.githubusercontent.com",
        },
    }
);
// Add GKE roles to service account
new gcp.projects.IAMBinding("gkeMember", {
    project: project ?? "cinqoo",
    members: [pulumi.interpolate`serviceAccount:${serviceAccount.email}`],
    role: "roles/container.admin",
});

// Allow repository to impersonate the service account

new gcp.serviceaccount.IAMMember("iamMember", {
    serviceAccountId: serviceAccount.name,
    role: "roles/iam.workloadIdentityUser",
    member: pulumi.interpolate`principalSet://iam.googleapis.com/${widp.name}/attribute.repository/${repo}`,
});

// Allow service account to push to the repository

new gcp.artifactregistry.RepositoryIamMember("admin", {
    project: project,
    location: repository.location,
    repository: repository.name,
    role: "roles/artifactregistry.admin",
    member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
});

//GKE Cluster

const network = new gcp.compute.Network("network", {
    project: project,
});
const subnet = new gcp.compute.Subnetwork("subnet", {
    project: project,
    ipCidrRange: "10.2.0.0/16",
    region: gcpLocation,
    network: network.id,
});

const cluster = new gcp.container.Cluster(
    "cinqoo-gke-cluster",
    {
        enableAutopilot: true,
        location: gcpLocation,
        name: "cinqoo-gke-cluster",
        ipAllocationPolicy: {},
        releaseChannel: {
            channel: "STABLE",
        },
    },
    {
        ignoreChanges: ["verticalPodAutoscaling"], // beacuse we are using autopilot verticalPodAutoscaling is handle by the GCP
    }
);

// MongoDB Atlas Cluster publicly reachable

const mongodbAtlasProject = new mongodbatlas.Project("cinqoo-mongo-project", {
    name: "cinqoo",
    orgId: organization.then((org) => org.orgId),
});

const mongodbAtlasCluster = new mongodbatlas.Cluster("cinqoo-mongodb-cluster", {
    name: "cinqoocluster",
    projectId: mongodbAtlasProject.id,
    providerName: "GCP",
    providerRegionName: atlasGcpLocation,
    mongoDbMajorVersion: "4.4",
    providerInstanceSizeName: "M10",
    providerAutoScalingComputeMinInstanceSize: "M10",
    providerAutoScalingComputeMaxInstanceSize: "M20",
});

new mongodbatlas.ProjectIpAccessList("allow-all", {
    projectId: mongodbAtlasProject.id,
    cidrBlock: "0.0.0.0/0",
});

// DB User

new mongodbatlas.DatabaseUser("admin", {
    authDatabaseName: "admin",
    projectId: mongodbAtlasProject.id,
    username: DB_USER,
    password: DB_PWD,
    roles: [
        {
            databaseName: "admin",
            roleName: "readWriteAnyDatabase",
        },
        {
            databaseName: "admin",
            roleName: "dbAdminAnyDatabase",
        },
    ],
});

// Networking to acces DB from GKE

const atlasNetworkPeer = new mongodbatlas.NetworkPeering("atlasNetworkPerr", {
    containerId: mongodbAtlasCluster.containerId,
    projectId: mongodbAtlasProject.id,
    providerName: "GCP",
    gcpProjectId: project,
    networkName: network.name,
});

new gcp.compute.NetworkPeering("gcpPeering", {
    name: "gcppeering",
    network: network.selfLink,
    peerNetwork: pulumi.interpolate`https://www.googleapis.com/compute/v1/projects/${atlasNetworkPeer.atlasGcpProjectId}/global/networks/${atlasNetworkPeer.atlasVpcName}`,
});

const dns = new gcp.dns.ManagedZone("cinqoo-dns", {
    project: project,
    name: "cinqoo",
    dnsName: "cinqoo.fr.",
});

const gatewayStaticIp = new gcp.compute.GlobalAddress("gateway-service", {
    name: "gateway-service",
    project: project,
});

const aRecord = new gcp.dns.RecordSet("gateway-a-record", {
    project: project,
    managedZone: dns.name,
    name: "api.cinqoo.fr.",
    type: "A",
    ttl: 300,
    rrdatas: [gatewayStaticIp.address],
});

export const PROJECT_ID = project;
export const SERVICE_ACCOUNT = serviceAccount.email;
export const PROVIDER_ID = oidcProvider.name;
export const GATEWAY_IP = gatewayStaticIp.address;
export const DNS = dns.dnsName;

export const GKE_CLUSTER_NAME = cluster.name;
export const GKE_CLUSTER_LOCATION = cluster.location;
export const GKE_ENDPOINT = cluster.endpoint;

export const MONGODB_USER = DB_USER;
export const MONGODB_PASSWORD = DB_PWD;
export const MONGODB_URI = mongodbAtlasCluster.srvAddress;
