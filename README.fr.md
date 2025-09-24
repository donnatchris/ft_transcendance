##### [🇫🇷 Version française](README.fr.md) / [🇬🇧 English version](README.md)

# PROJET FT_TRANSCENDANCE POUR 42
Par chdonnat (Christophe Donnat de 42 Perpignan, France)

## BUT DU PROJET:
Ce projet consiste à créer une plateforme web complète pour un jeu de Pong multijoueur en temps réel. L'objectif est de développer une application web moderne incluant un backend, un frontend, une base de données, une authentification des utilisateurs, et de nombreuses autres fonctionnalités, le tout conteneurisé avec Docker.

Le projet est divisé en plusieurs modules qui permettent d'ajouter progressivement des fonctionnalités avancées, allant de la simple partie de Pong à une plateforme de jeu complète avec chat, tournois, et même une intégration blockchain.

## FONCTIONNALITÉS (MODULES):
Le projet est construit autour d'une série de modules optionnels qui enrichissent l'expérience. Voici un aperçu des fonctionnalités implémentées :

*   **Backend & Frontend:** Utilisation de Fastify pour le backend et TypeScript/Tailwind CSS pour le frontend en Single Page Application (SPA).
*   **Base de données:** Gestion des données utilisateurs et des parties avec SQLite.
*   **Gestion des utilisateurs:** Inscription, connexion sécurisée (JWT), profils personnalisables, et authentification distante via Google (OAuth).
*   **Gameplay:**
    *   Jeu multijoueur à distance.
    *   Possibilité de jouer à plus de 2 joueurs.
    *   Ajout d'un autre jeu et système de matchmaking.
    *   Options de personnalisation du jeu (power-ups, cartes).
*   **Expérience utilisateur:**
    *   Chat en direct avec possibilité de bloquer des utilisateurs.
    *   Tableaux de bord pour les statistiques des joueurs.
*   **IA & Algorithmes:**
    *   Un adversaire contrôlé par une IA.
*   **Cybersécurité:**
    *   Mise en place d'un WAF (ModSecurity).
    *   Gestion des secrets avec HashiCorp Vault.
    *   Authentification à deux facteurs (2FA).
*   **DevOps:**
    *   Conteneurisation complète avec Docker.
    *   Gestion des logs avec la stack ELK (Elasticsearch, Logstash, Kibana).
    *   Monitoring avec Prometheus et Grafana.
*   **Graphismes:**
    *   Intégration de graphismes 3D avec Babylon.js.
*   **Accessibilité:**
    *   Design responsive pour tous les appareils.
    *   Support multi-langues.

## COMMANDES UTILES:
Pour construire et lancer l'ensemble des services (nécessite Docker et Docker Compose):
```bash
make
```
ou directement avec docker-compose:
```bash
docker-compose up --build
```

Pour arrêter les conteneurs:
```bash
docker-compose down
```

## ARCHITECTURE:
Le projet est organisé en plusieurs dossiers et fichiers de configuration clés :
- **docker-compose.yml**: Fichier principal pour l'orchestration des services avec Docker.
- **Makefile**: Contient des règles pour simplifier la gestion du projet (build, up, down, clean).
- **traefik.yml, services.yml, certs.yml**: Fichiers de configuration pour le reverse proxy Traefik et la définition des services.
- **game/**: Contient la logique du jeu Pong.
- **gate/**: Service de passerelle (API Gateway) qui sert de point d'entrée unique pour le frontend.
- **user/**: Service dédié à la gestion des utilisateurs (authentification, profils).
- **ia/**: Service pour l'intelligence artificielle de l'adversaire.
- **packages/**: Modules Node.js partagés entre les différents services.
- **public/**: Fichiers statiques du frontend (HTML, CSS, JS).
- **monitoring/**: Configuration pour Prometheus et Grafana.
- **ELK/**: Configuration pour la stack Elasticsearch, Logstash, et Kibana.
- **certs/**: Stockage des certificats SSL.
- **images/**: Contient les images utilisées dans le projet, comme les GIFs de démonstration.
- **README.md**: Ce fichier.

## DOCUMENTATION TECHNIQUE:

### Docker et Microservices
Le projet est entièrement conteneurisé avec Docker, suivant une architecture de microservices. Chaque fonctionnalité majeure (utilisateur, jeu, chat...) est isolée dans son propre service, communiquant via des APIs. `docker-compose.yml` orchestre le déploiement de ces services.

### Backend : Fastify & Node.js
Le backend est construit avec **Fastify**, un framework web pour Node.js reconnu pour sa rapidité et sa faible surcharge. Il gère :
- Les **API REST** pour les opérations CRUD (Create, Read, Update, Delete) sur les utilisateurs, les parties, etc.
- La communication en temps réel via **WebSockets** pour le gameplay.
- L'authentification et la gestion des sessions avec des **Tokens JWT**.

### Frontend : TypeScript & Tailwind CSS
Le frontend est une **Single Page Application (SPA)**, ce qui signifie que la page n'est jamais entièrement rechargée, offrant une expérience utilisateur fluide.
- **TypeScript** est utilisé pour ajouter un typage statique au JavaScript, rendant le code plus robuste et maintenable.
- **Tailwind CSS** est un framework CSS "utility-first" qui permet de construire des designs modernes et responsives rapidement.

### Authentification : JWT & OAuth
La sécurité des comptes utilisateurs est assurée par plusieurs mécanismes :
- **JWT (JSON Web Tokens)** : Après connexion, le client reçoit un token qui est utilisé pour authentifier les requêtes suivantes.
- **OAuth 2.0** : Les utilisateurs peuvent s'inscrire et se connecter via des services tiers comme Google, sans avoir à créer un mot de passe spécifique pour le site.
- **2FA (Two-Factor Authentication)** : Une couche de sécurité supplémentaire où l'utilisateur doit fournir un second code (généralement depuis une application mobile) pour se connecter.

### Monitoring : Prometheus & Grafana
Pour assurer la stabilité et la performance de la plateforme, des outils de monitoring sont intégrés :
- **Prometheus** collecte en continu des métriques sur l'état des différents services (utilisation CPU, mémoire, nombre de requêtes...).
- **Grafana** permet de visualiser ces métriques sous forme de graphiques et de tableaux de bord, et de configurer des alertes en cas d'anomalie.
