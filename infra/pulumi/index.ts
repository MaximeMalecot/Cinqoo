import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const project = gcp.config.project;
const repo = "MaximeMalecot/challenge-s2-g19";

// Create Artifact Registries
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
