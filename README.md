# challenge-s2-g19

## Prerequisites:

To start the project, you need Docker with (at least) 6gb of memory allocated, otherwise, the containers won't be able to start properly.

## Getting started

Run the following command:

```
docker compose up --build -d
```

Once all the containers are started, run the following command:

```
sh scripts/docker_migrate.sh
```

## Recreate the deployment

This project is fully automated, and so you can even recreate the infrastructure easily on your own.

First go to /infra/pulumi

Before going anyfurther you'll have to follow pulumi's documentation about installing it and configuring it for GCP [here](https://www.pulumi.com/registry/packages/gcp/installation-configuration/).

When it's done, run

```
pulumi up
```

After that you should have three variables on your output that'll use soon.

If you want to run the CI/CD pipelines, to automate project on github workflow you just have to set secret keys on Github based on the output. It's important to keep the same name, since the workflows are based on them, if you want to customize it, do as you wish but don't forget to modify the files.

The pulumi infrastructure definition, for now, is creating one Artifact Repository to store all our Docker images.
Those images are publicly readable, so anyone can easily test out the projet or even work to make it better

We took care to create the service account to push the docker images, while following GCP best practices. Which we highly recommend to read if you want to understand why we can push images without any token. You can find it [here](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity?hl=fr)
