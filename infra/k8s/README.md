# How to

## Prerequis

Create the namespace before doing any actions.
Execute this a the root of infra/k8s :

```
kubectl apply -f _namespace.yaml
```

## Infra

Run at the overlays of your desired environnement of k8s folder : (ex : overlays/dev)

```
cp .env.example .env; \
cp .env.secrets.example .env.secrets; \
kubectl apply -k .
```

ATTENTION: you need a mongoDB server running in localhost at port 27017 to be working in localhost.

Either you can just adjust and communicate with distant DB.

IF YOU ARE NOT RUNNING UNDER MINIKUBE LATEST VERSIONS the connection to the dabase won't work.

## Get informations

Check error of a pod :

```
kubectl describe pod auth-service -n cinqoo
```

Check env variables of a pod :

```
kubectl exec -it POD.METADATA.NAME -- printenv | egrep "ENV1|ENV2|ENV3"
```

## Get endpoint

```
minikube service gateway-service -n cinqoo --url
```
