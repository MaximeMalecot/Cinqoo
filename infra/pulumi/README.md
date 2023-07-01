# IAC

## Setup

First of all, create an account on GCP and a new project [here](https://cloud.google.com)

Then, create a mongodb atlas account [here](https://www.mongodb.com/cloud/atlas/register)

Install GCloud CLI and configure it to use your project by following these instructions [here](https://cloud.google.com/sdk/docs/install)

Now run these commands ONE BY ONE :

```
gcloud auth application-default login
gcloud projects list
gcloud config set project PROJECT_ID
gcloud services enable compute.googleapis.com artifactregistry.googleapis.com container.googleapis.com file.googleapis.com
pulumi config set gcp:project YOUR_PROJECT_ID
```

Once all this done, we have some configuration to do for MongoDB.
Go to [Atlas](https://cloud.mongodb.com)

On your project select Access Manager -> API Keys and create one.

Run :

```
cp .env.example .env
```

For MONGODB_PUBLIC_KEY and MONGODB_PRIVATE_KEY, you'll need to set them in your OWN environment manually. For more informations follow this [link](https://www.pulumi.com/registry/packages/mongodbatlas/installation-configuration/)

Now follow this [guide](https://www.pulumi.com/docs/install/) to install pulumi.

And you can finally run

```
pulumi up
```

After that you should have few variables on your output that'll use soon.

## How to use

We created a service account that you can use to automate Docker images push to GCR, or k8s infrastucture automation.

You can use our Github Workflows but'll need to set a lot of variables.

### Docker images

If you only want to automate image pushes, you just have to set the secrets on github with the following ones from pulumi's output :

-   PROJECT_ID
-   SERVICE_ACCOUNT
-   PROVIDER_ID

## Indepts and k8s automation

We created everything you need with pulumi such as :

-   Service account with impersonation through workload_identity_provider as recommended by GCP. (To understand this, go [here](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity?hl=fr))
-   GKE k8s cluster
-   Mongodb atlas cluster (hosted in GCP ofc)
-   GCP Cloud DNS
-   GCP static IP for loadbalancing and GCP ManagedCertificate.

There is only a few things missing that we couldn't automate through IAC that we'll overview.

### Staging overlay

For staging overlay, you'll need to set this variables from pulumi's output to github actions:

-   PROJECT_ID
-   SERVICE_ACCOUNT
-   PROVIDER_ID
-   GKE_CLUSTER_LOCATION
-   GKE_CLUSTER_NAME
-   MONGODB_PASSWORD
-   MONGODB_URI
-   MONGODB_USER

You'll also need to set this variables on your own, we couldn't create these from pulumi sorry... (For the explanation on stripe follow root's folder [README](/README.md#get-your-stripe-secret-key) to understand)

-   JWT_SECRET
-   STRIPE_SECRET_KEY
-   STRIPE_WH_ACCOUNT_SECRET
-   STRIPE_WH_PAYMENT_SECRET

### Prod overlay

For production, you'll need, in plus of what done for staging, to own a domain name, and let the ressources created by pulumi in GCP Cloud DNS have access to it.

Your domain provider should explain how to do.

## How to adapt

If you want to create a new stack :

```
pulumi stack init MYSTACK
pulumi config set gcp:project MYPROJECT
```

Check and change stack

```
pulumi stack ls
pulumi stack select MYSTACK
```

You'll need to modify the variable "repo" at the start of the index.ts based on your own repository if you want to reproduce the automation part.

For the datase, you might also want to give it custom data, to not let everyone know your password, throught a .env that'll be looked by the dotenv.config().

## Renaming after destroy

Unfortunately, google keeps some ressources allocated even if it has been destroy.
If you want to destroy and recreate resource, you'll need to manually change it's name in the index.ts (the problem has only been encountered for "widp" and "oidcProvider")
