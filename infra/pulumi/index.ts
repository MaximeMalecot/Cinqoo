import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Create Artifact Registries
new gcp.artifactregistry.Repository("challenge", {
  repositoryId: "challenge",
  format: "DOCKER",
  location: "europe-west9",
});
