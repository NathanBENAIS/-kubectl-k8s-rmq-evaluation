Etapes 1
Afin de pouvoir interagir avec ce cluster à distance, il est essentiel de récupérer le fichier kubeconfig.yml.

Pour accomplir cette tâche, la commande "export KUBECONFIG='C:\Users\Nathan\Documents\Ecole\CFaInsta\ICVAD\k8s-rmq-evaluation/kubeconfig.yml'"

Cette commande a pour but de définir une variable d'environnement appelée KUBECONFIG

Ensuite,   vérifie que la configuration a fonctionné en affichant les nœuds du cluster on a fait un "kubectl get nodes". Ci-dessous une capture d'écran illusatant les propos : 
![alt text](<Screenshot/Etape 1/image.png>)


A l'issus de cela on a crée le namespace a grace  " kubectl create namespace nathanbenais". Par la suite, nous avons confirmé cette création en exécutant la commande "kubectl get namespaces".
![alt text](<Screenshot/Etape 1/image-1.png>)

Puis pour accéder au namespace on a effectué cette ligne de commande "kubectl config set-context --current --namespace=nathanbenais" : 
![alt text](<Screenshot/Etape 1/kubectl config set-context --current --namespace=nathanbenais.png>)


Etapes 2
Pour installer l'opérateur de cluster RabbitMQ, on a fait la commande "kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"" . Cette action permet d'appliquer la configuration.

Ensuite, pour déployer le cluster RabbitMQ,on a exécuté la commande "kubectl apply -f rabbitmq-cluster.yml".  

Après avoir exécuté ces commandes, pour vérifier les déploiement de RabbitMQ, on a effectué la commande "kubectl get pods"
Voici les résultats :  
![alt text](<Screenshot/Etape 2/déployer RabbitMQ sur le cluster.png>)

![alt text](<Screenshot/Etape 2/déployer RabbitMQ sur le cluster.png>)


Pour déployer la base de données database" PostgreSQL , on a effectuer plusieurs étapes :
Tout d'abord, on a effectué un script de (build.sh). Ce script est conçu pour construire l'image Docker en utilisant la commande "docker build -t counter-database ."
Quant au script "run.sh", son rôle est d'assurer le démarrage du conteneur PostgreSQL. Il commence par essayer de démarrer un conteneur existant nommé "counter-database".
Après l'exécution réussie de ces scripts, on a vérifié que le déploiement s'est effectué correctement en examinant l'image Docker créée à l'aide de la commande "docker images", ainsi que la présence du conteneur actif avec la commande "docker ps"
Voici les résultats : 
[text](<Screenshot/Etape 2>) ![text](<Screenshot/Etape 2/docker images (counter-database ).png>)
 

![alt text](<Screenshot/Etape 2/docker ps (counter-database ).png>)
Etape 3

Pour mettre en place le serveur, les étapes suivantes  :

Tout d'abord, la base de données a été déployée. Cela a impliqué la construction de l'image Docker pour la base de données à l'aide de la commande "docker build -t nathanbenais/counter-database .", suivie de son envoi vers un registre Docker via "docker push nathanbenais/counter-database".

Ensuite, après avoir configuré les paramètres dans le fichier YAML "counter-database-deployment.yaml" à l'aide de la commande "kubectl apply -f counter-database-deployment.yaml", la base de données a été déployée.

Une fois la base de données opérationnelle, le serveur a été déployé. Pour ce faire, l'image Docker du serveur a été construite avec la commande "docker build -t nathanbenais/counter-backend .", puis poussée vers le registre Docker via "docker push nathanbenais/counter-backend".

Enfin, le déploiement du pod du serveur a été effectué en appliquant la configuration spécifiée dans le fichier YAML "counter-backend-deployment.yaml" avec la commande "kubectl apply -f counter-backend-deployment.yaml".

Après ces déploiements, la vérification a été réalisée en listant les pods à l'aide de "kubectl get pods","kubectl get services" pour confirmer que les pods de la base de données et du serveur étaient en cours d'exécution. Voici le résultat :

![alt text](<Screenshot/Etape 3/kubectl get pods.png>)

De plus, pour examiner les journaux du pod du serveur et vérifier son bon fonctionnement, la commande "kubectl logs counter-backend-deployment-6c5fcbd85c-mxdr4" a été utilisée.

![alt text](<Screenshot/Etape 3/kubectl logs counter-backend-deployment-6c5fcbd85c-mxdr4 1er partie.png>)
![alt text](<Screenshot/Etape 3/kubectl logs counter-backend-deployment-6c5fcbd85c-mxdr4 2eme partie.png>)


![alt text](<Screenshot/Etape 3/kubectl logs counter-database-deploymentfd679b886d68jf.png>)




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
