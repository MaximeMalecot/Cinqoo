import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const project = gcp.config.project;

// Create Artifact Registries
const repository = new gcp.artifactregistry.Repository("challenge", {
  repositoryId: "challenge",
  format: "DOCKER",
  location: "europe-west9",
});

const repositoryIamPolicy = new gcp.artifactregistry.RepositoryIamMember(
  "publicRead",
  {
    location: repository.location,
    repository: repository.name,
    role: "roles/artifactregistry.reader",
    member: "allUsers",
  }
);

export const repoId = repository.repositoryId;
