# Cinqoo

This project is a Fiverr like marketplace using a microservices architecture with CI/CD and IaC deployment.

## Developers

-   Maxime Malécot
-   Julian Saleix
-   Sacha Francisco-Leblanc

## Technologies / frameworks / libraries

-   Docker
-   NestJS
-   Express
-   React
-   MongoDB
-   Stripe
-   EventSource/Server-sent events
-   Tailwind/DaisyUI
-   Kubernetes
-   Pulumi

## Urls (dev)

-   http://localhost:3000: Gateway api
-   http://localhost:3001/conversations/sse: Hybrid-gateway api to handle Server-sent events
-   http://localhost:3000/docs: Api documentation
-   http://localhost:8080: Front-end
-   http://localhost:8081: Progressive Web App

## Prerequisites:

To start the project, you need Docker with a good amount of memory allocated, otherwise, the containers won't be able to start properly.
Also, you need a Stripe account since we are using it to handle payments and promotion to Freelancer.

## Get your Stripe secret key

The project is using Stripe to handle payments, therefore, you need an actual Stripe secret key to create products and be able to perform most user flows. To do this, you just have to go to the [Stripe test developer page](https://dashboard.stripe.com/test/apikeys) and generate a secret key.

Create the .env file like that :

```bash
cp .env.example .env
```

Once you have it, copy this key and put it in the root .env file as it is:

```bash
STRIPE_SECRET_KEY=<your_stripe_secret_key>
```

## Setup Stripe Connect

To manage a marketplace such as Cinqoo or Fiverr, Stripe Connect is the way we are using to integrate payments into the marketplace without managing KYC and customers sensitives informations. Follow the steps available here: [Stripe Connect Settings](https://dashboard.stripe.com/test/settings/connect).

🚨 The new Stripe dashboard is a bit messy, if you encounter issues like "Internal error" when registering or creating a user, it's probably because you haven't finished the Stripe Connect settings yet.

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

## Starting and trying the project

To start and try the project, run the following command:

```
docker compose -f compose.test.yml up --build -d
```

If you want to work on it, use the following command, but keep in mind you must have enough resources to run the project:

```
docker compose up --build -d
```

## Seeding the database

Use the following command to run the seeds:

```
docker compose exec gateway-service npm run db:seed
```

Only 3 users accounts are created, along with a few categories.
Both users cannot create any service/prestation since they need to follow the "Become a Freelancer" workflow that implies to complete the Stripe Connect Account procedure and cannot be automated since it requires a human interaction.

**Accounts credentials:**
| email | Password | Roles
|--|--| -- |
| user@test.com | User123+= | User
| freelancer@test.com | User123+= | User
| admin@test.com | Admin123+= | User, Admin

## Recreating the deployment or infrastructure

This project is fully automated, and you can recreate the infrastructure easily on your own.

To do so, you'll have to check out both documentations.

The one for k8s, if you only want to test it out, or handle your servers/providers on your own, [here](/infra/k8s/README.md).

The one for pulumi, which is our IaC solution, for creating ressources to easily reproduce the automation pipelines or the deployment of the infrastructure on k8s. You can find it [here](/infra/pulumi/README.md).
