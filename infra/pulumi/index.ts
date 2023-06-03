import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const project = gcp.config.project;
const repo = "MaximeMalecot/challenge-s2-g19";

// Create Artifact Registries
const repository = new gcp.artifactregistry.Repository("challenge", {
  repositoryId: "challenge",
  format: "DOCKER",
  location: "europe-west9",
});

const serviceAccount = new gcp.serviceaccount.Account("cinqoo-sa", {
  accountId: "cinqoo-sa",
  displayName: "cinqoo-sa",
  project: project,
});

const workloadIdentityPool = new gcp.iam.WorkloadIdentityPool(
  "cinqooworkload",
  {
    workloadIdentityPoolId: "cinqooworkload",
    displayName: "cinqooworkload",
    project: project,
  }
);

const attributeMapping = {
  "google.subject": "assertion.sub",
  "attribute.actor": "assertion.actor",
  "attribute.repository": "assertion.repository",
};

const workloadIdentityPoolProvider = new gcp.iam.WorkloadIdentityPoolProvider(
  "github",
  {
    workloadIdentityPoolId: workloadIdentityPool.workloadIdentityPoolId,
    workloadIdentityPoolProviderId: "github",
    displayName: "github",
    project: project,
    oidc: {
      issuerUri: "https://token.actions.githubusercontent.com",
    },
    attributeMapping: {
      "google.subject": "assertion.sub",
      "attribute.actor": "assertion.actor",
      "attribute.repository": "assertion.repository",
    },
  }
);

const workloadIdentityUserIamMember = new gcp.serviceaccount.IAMMember(
  "workloadIdentityUser",
  {
    serviceAccountId: serviceAccount.name,
    role: "roles/iam.workloadIdentityUser",
    member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
  }
);

const artifactRegistryAdminIamMember = new gcp.projects.IAMMember(
  "artifactRegistryAdmin",
  {
    project: project?.toString() ?? "cinqoo",
    role: "roles/artifactregistry.admin",
    member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
  }
);

new gcp.artifactregistry.RepositoryIamMember("publicRead", {
  location: repository.location,
  repository: repository.name,
  role: "roles/artifactregistry.reader",
  member: "allUsers",
});

export const workload_idenity_pool_provider_id =
  workloadIdentityPoolProvider.id;
export const project_id = project;
export const service_account = serviceAccount;
