# Projet YSpotify

## Objectif

Le projet Spotify Group Sessions vise à créer une application permettant à des utilisateurs de s'inscrire, se connecter et rejoindre ou créer des groupes pour partager des sessions d'écoute Spotify. 
L'application utilise l'API Spotify pour gérer l'authentification et la récupération des informations relatives aux morceaux en cours de lecture. De plus, elle implémente un système de gestion des utilisateurs et des groupes.

## Fonctionnalités principales

- **Authentification d'utilisateur** : Permet aux utilisateurs de s'inscrire et de se connecter à l'application en utilisant un pseudo et un mot de passe.
- **Gestion des groupes** : Les utilisateurs peuvent créer des groupes, rejoindre des groupes existants et voir la liste des groupes disponibles.
- **Intégration de l'API Spotify** : Utilisation de l'API Spotify pour permettre aux utilisateurs d'accéder à leur compte Spotify, récupérer des informations sur les morceaux en cours de lecture et contrôler la lecture.
- **Sécurité** : Utilisation de JWT (JSON Web Tokens) pour sécuriser les routes de l'API et s'assurer que les requêtes sont authentifiées.

## Technologie utilisée

- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express** : Framework pour Node.js facilitant la création d'applications web et d'API.
- **Spotify Web API Node** : Bibliothèque facilitant l'intégration de l'API Spotify dans des applications Node.js.
- **JWT** : Pour la création et la vérification des tokens d'authentification.
- **Swagger** : Pour documenter l'API et fournir une interface utilisateur pour explorer les endpoints.

## Structure du projet

- `app.js` : Fichier principal de l'application, configurant le serveur, les routes, et l'intégration avec l'API Spotify.
- `users.json` : Stocke les informations des utilisateurs inscrits.
- `groups.json` : Contient les informations sur les groupes créés par les utilisateurs.
- `swagger.json` : Configuration de la documentation de l'API avec Swagger.

## Sécurité

Le projet utilise des clés privées et publiques pour la signature et la vérification des JWT, assurant que seuls les utilisateurs authentifiés peuvent accéder aux routes sécurisées.

## Démarrage du projet

1. Installer les dépendances : `npm install`.
2. Démarrer le serveur : `npm start` ou `node app.js`.
3. Accéder à l'API via le navigateur à l'adresse `http://localhost:8888/api-docs` pour explorer la documentation Swagger.

### Prérequis

Pour importer le projet utiliser la commande : 
`git clone https://github.com/Rookuro/YSpotify.git`
