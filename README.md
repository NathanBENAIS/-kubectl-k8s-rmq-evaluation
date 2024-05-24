# Examen

## Prérequis

Récupérer le fichier kubeconfig.yml

```SH
export KUBECONFIG=<absolute-path-to>/kubeconfig.yml
```

Vous allez utiliser un cluster distant, il ne faut donc pas utiliser de commandes commençant par `minikube`.

## Tâches

Vous allez travailler tous sur le même cluster. Il est donc important de créer un namespace pour chacun et de nommer vos ressources avec des noms identifiables.

C'est également important pour les `labels selector` pour éviter les collisions entre le travail de deux élèves.
(un service qui cible des pods de deux personnes par exemple).

### Images docker

Pour utiliser vos images docker dans le cluster il est conseillé d'utiliser un registre docker distant.

Comme dockerhub, une version publique de l'image fera l'affaire.

### Le projet

Le code fourni est un code de serveur en `Node.js` permettant de compter des occurences à partir d'une queue `RabbitMQ` et de stocker la valeurs courantes dans une base de données `PostgreSQL`.

Pour démarrer le serveur vous devez lui fournir les configurations adéquates dans les variables d'environment. (cf .env d'exemple).

### RabbitMQ

Comme spécifié dans <a href="https://github.com/arthurescriou/k8s-exercice-eda" >l'exercice </a> précédent, déployez RabbitMQ sur le cluster.

### PostgreSQL

Vous devez déployer la base Postres comme spécifié dans le dossier `database`.

### Serveur

Fourni dans le dossier `backend`.

Vous devez créer un déploiement pour lancer un pod de serveur en suivant les instructions.

Une fois le serveur fonctionnel ajoutez un autoscaler pour qu'il suive la charge.

### Tester l'application

Vous avez à votre disposition un script: `count.js` dans le dossier du serveur.

Veillez à configurer les variables d'environment pour le lancer.

Vous devez créer un compteur dans votre base pour l'utiliser et spécifier son uuid :

```bash
curl localhost:4040/count/create -X POST
```

## Rendu

Veuillez regrouper tous vos fichiers yaml de déploiement (et ou commande lancées en bash) dans un repository git muni d'un readme.md.

Pousser le repository en ligne (github, gitlab etc).
Et m'envoyer le lien par mail (cela peut être fait en debut d'examen, je regarderai la dernière version poussée)

## Commandes utiles

Créer un namespace

```bash
kubectl create namespace <insert-namespace-name-here>
```

Visualiser les ressources déployées

```bash
kubectl get pods --namespace=name
kubectl get services --namespace=name
kubectl get deployments --namespace=name
kubectl get namespace --namespace=name
```

Récupérer les log d'un pod

```bash
kubectl logs <pod-id>
```

Utiliser un fichier yaml, dans votre cas l'image docker ne devrais pas changer donc il est possible de seulement apply le yaml une fois créé

Pensez à nommer votre yaml avec votre nom (et pas juste pod.yaml, pour éviter les collisions)

```bash
kubectl create -f file.yaml
kubectl delete -f file.yaml
kubectl apply -f file.yaml
```
