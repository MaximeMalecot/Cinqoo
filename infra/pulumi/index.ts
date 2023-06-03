import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const project = gcp.config.project;
const repo = "MaximeMalecot/challenge-s2-g19";

// Create Artifact Registries and give access to all users
const repository = new gcp.artifactregistry.Repository("cinqoo", {
  repositoryId: "challenge",
  format: "DOCKER",
  location: "europe-west9",
});

new gcp.artifactregistry.RepositoryIamMember("publicRead", {
  location: repository.location,
  repository: repository.name,
  role: "roles/artifactregistry.reader",
  member: "allUsers",
});

// Create Service Account for CI/CD

const serviceAccount = new gcp.serviceaccount.Account("githubSA", {
  accountId: "github-sa",
  displayName: "Service Account for Github Actions",
});

// Create WIDP for CI/CD

const widp = new gcp.iam.WorkloadIdentityPool("github-widp", {
  displayName: "WIDP for Github Actions",
  workloadIdentityPoolId: "github-widp",
});

// Create OIDC Provider for CI/CD

const oidcProvider = new gcp.iam.WorkloadIdentityPoolProvider("github-oidc", {
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
});

const iamMember = new gcp.serviceaccount.IAMMember("iamMember", {
  serviceAccountId: serviceAccount.name,
  role: "roles/iam.workloadIdentityUser",
  member: pulumi.interpolate`principalSet://iam.googleapis.com/${widp.name}/attribute.repository/${repo}`,
});

export const SA = serviceAccount;
export const POOL = widp.name;
