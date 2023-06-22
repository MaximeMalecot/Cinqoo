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

## Recreate the deployment or infrastructure

This project is fully automated, and you can recreate the infrastructure easily on your own.

To do so, you'll have to check out both documentations.

The one for k8s, if you only want to test it out, or handle your servers/providers on your own, [here](/infra/k8s/README.md).

The one for pulumi, which is our IaC solution, for creating ressources to easily reproduce the automation pipelines or the deployment of the infrastructure on k8s. You can find it [here](/infra/pulumi/README.md).
