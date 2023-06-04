import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const repo = "MaximeMalecot/challenge-s2-g19";

// Create Artifact Registries and give access to all users
const repository = new gcp.artifactregistry.Repository("cinqoo", {
  repositoryId: "challenge",
  format: "DOCKER",
  location: "europe-west9",
});

// Allow all users to read the repository

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

// Allow repository to impersonate the service account

new gcp.serviceaccount.IAMMember("iamMember", {
  serviceAccountId: serviceAccount.name,
  role: "roles/iam.workloadIdentityUser",
  member: pulumi.interpolate`principalSet://iam.googleapis.com/${widp.name}/attribute.repository/${repo}`,
});

// Allow service account to push to the repository

new gcp.artifactregistry.RepositoryIamMember("admin", {
  location: repository.location,
  repository: repository.name,
  role: "roles/artifactregistry.admin",
  member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
});

export const SERVICE_ACCOUNT = serviceAccount.email;
export const PROVIDER_ID = oidcProvider.name;
export const PROJECT_ID = pulumi.getProject();
