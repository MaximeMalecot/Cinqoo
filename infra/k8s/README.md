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


## Get informations

Check error of a pod :
```
kubectl describe pod auth-service -n cinqoo
```

Check env variables of a pod :
```
kubectl exec -it POD.METADATA.NAME -- printenv | egrep "ENV1|ENV2|ENV3"
```