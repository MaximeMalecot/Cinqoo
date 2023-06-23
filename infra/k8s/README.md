# How to

## Requirements

Create the namespace before doing any actions.
Execute this a the root of infra/k8s :

```
kubectl apply -f _namespace.yaml
```

## Infra

We have 3 different overlays, dev, staging and prod.

-   Dev is a simple example to test out our application. We downscale the autoscaler to avoid high cost for testing. We also don't use auto-signed certificates. It is mostly used for testing in local with minikube
-   Staging is using the same ressources as production build, but doesn't have certificates. It'll allow you to test out the production but without HTTPS.
-   Prod is the full infrastructure with auto-signed certificate, loadbalancer handled in GCP and high autoscaling capability.

Each environment has it's own variables and secret, you'll need to set them before any action. For dev's overlas you can just run the next command in local

```
cp .env.example .env;\
cp .env.secrets.example .env.secrets;
```

For production and staging, you'll need to replace all variables written with <> around it

Run at the overlays of your desired environnement of k8s folder (ex : overlays/dev)

```
kubectl apply -k .
```

CAREFULL: For dev default secrets, you need :

-   A mongoDB server running in localhost at port 27017 to be working in localhost.
-   To run infrastructure on latest version of minikube, to allow communication between the cluster, and you local database

You can also communicate to a distant DB by modifying the variables, as you'll do in Staging and Prod environment.

## Deployments

In Dev and Staging, we are exposing "gateway-service" through a "LoadBalancer" service, to allow any incoming traffic on GCP.

In Prod, we are keeping the service as a NodePort, to only allow communication inside VPC network, and use GCP LoadBalancer do the proxy, with a managedcertificate.

This LoadBalancer is connected to a static IP that we created with pulumi. If you change the ressource "gatewayStaticIp" in infrastructure definition, you'll need to change the value of the anotation "kubernetes.io/ingress.global-static-ip-name" in the prod/ingress.yaml according to your new value.

The prod environment can only work if you manage a domain under GCP DNS, and change the value in cert.yaml from "api.cinqoo.fr" to your desired domain.
