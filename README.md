# challenge-s2-g19

## Prerequisites:

To start the project, you need Docker with (at least) 9gb of memory allocated, otherwise, the containers won't be able to start properly.
Also, you need a Stripe account since we are using it to handle payments and promotion to Freelancer.

## Get your Stripe secret key

The project is using Stripe to handle payments, therefore, you might need an actual Stripe secret key to create products and be able to perform most user flows. To do this, you just have to go to the [Stripe test developer page](https://dashboard.stripe.com/test/apikeys) and generate a secret key.

Create the .env file like that :

```bash
cp .env.example .env
```

Once you have it, copy this key and put it in the root .env file as it is:

```bash
STRIPE_SECRET_KEY=<your_stripe_secret_key>
```

## Listening Stripe events locally

To use the Stripe webhooks without hosting the application, you might need to install the Stripe CLI
https://stripe.com/docs/stripe-cli

Once the settings are done, use the following command in your shell

**Linux/MacOS:**

```bash
stripe listen --forward-to localhost:3000/webhook/stripe/dev
```

**Windows:**

```bash
your/path/to/stripe/executable listen --forward-to localhost:3000/webhook/stripe/dev
```

The CLI should give you your webhook signing secret starting with "whsec\_". Copy this key and put it in the root .env file as it is (it's the same one for both ACCOUNT & PAYMENT secret keys):

```bash
STRIPE_WH_ACCOUNT_SECRET=<your_webhook_key>
STRIPE_WH_PAYMENT_SECRET=<your_webhook_key>
```

## Starting the project

To start the project, run the following command:

```
docker compose up --build -d
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
