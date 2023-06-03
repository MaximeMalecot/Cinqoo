import * as gcp from "@pulumi/gcp";

const projectId = "YOUR_PROJECT_ID";
const serviceAccountEmail =
  "YOUR_SERVICE_ACCOUNT_EMAIL@example.iam.gserviceaccount.com";
const gitHubRepoUrl =
  "https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY.git";

const workloadIdentityPool = new gcp.iam.WorkIdentityPool(
  "my-workload-identity-pool",
  {
    // Your desired Workload Identity Pool ID
    workloadIdentityPoolId: "my-pool-id",
    displayName: "My Workload Identity Pool",
  }
);

const workloadIdentityPoolProvider = new gcp.iam.WorkloadIdentityPoolProvider(
  "my-github-provider",
  {
    workloadIdentityPoolId: workloadIdentityPool.workloadIdentityPoolId,
    workloadIdentityPoolProviderId: "my-provider-id",
    displayName: "My GitHub Provider",
    oidc: {
      issuerUri: gitHubRepoUrl,
    },
  }
);

const myIAMRole = "roles/iam.workloadIdentityUser";

const workloadIdentityUserIAMMember = new gcp.serviceAccount.IAMMember(
  "workloadIdentityUserIAMMember",
  {
    serviceAccountId: serviceAccountEmail,
    role: myIAMRole,
    member: `serviceAccount:${serviceAccountEmail}`,
  }
);

// Export the Workload Identity Pool name and the IAM Member name as outputs.
export const workloadIdentityPoolName = workloadIdentityPool.name;
export const workloadIdentityUserIAMMemberName =
  workloadIdentityUserIAMMember.name;
