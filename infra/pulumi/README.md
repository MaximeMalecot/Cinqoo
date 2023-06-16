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
gcloud services enable compute.googleapis.com artifactregistry.googleapis.com container.googleapis.com
pulumi config set gcp:project YOUR_PROJECT_ID
```

Once all this done, we have some configuration to do for MongoDB. 
Go to [Atlas](https://cloud.mongodb.com)

On your project select Access Manager -> API Keys and create one.

Run :
```
cp .env.example .env
```

Modify MONGODB_PUBLIC_KEY and MONGODB_PRIVATE_KEY by the values from the API Key you just created

Now follow this [guide](https://www.pulumi.com/docs/install/) to install pulumi.

And you can finally run 
```
pulumi up
```

After that you should have three variables on your output that'll use soon.

If you want to run the CI/CD pipelines, to automate project on github workflow you just have to set secret keys on Github based on the output. It's important to keep the same name, since the workflows are based on them, if you want to customize it, do as you wish but don't forget to modify the files.

The pulumi infrastructure definition, for now, is creating one Artifact Repository to store all our Docker images.
Those images are publicly readable, so anyone can easily test out the projet or even work to make it better

We took care to create the service account to push the docker images, while following GCP best practices. Which we highly recommend to read if you want to understand why we can push images without any token. You can find it [here](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity?hl=fr)


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