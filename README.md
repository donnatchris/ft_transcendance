# transcendence - Projet ft_transcendence

## Description du projet

transcendence est une plateforme web de jeu multijoueur en temps réel centrée sur le classique **Pong**. Ce projet a pour objectif de développer une application complète combinant un backend performant avec Fastify, une base de données SQLite légère, et un frontend moderne utilisant Tailwind CSS et Typescript.

Le projet respecte les contraintes pédagogiques strictes du sujet ft_transcendence, favorisant l’apprentissage, la maîtrise de nouvelles technologies et la gestion de modules fonctionnels.

# Résumé des modules ft_transcendence

---

## IV.2 Web

### 1. **Backend Framework (Fastify)**
   - Initialiser un projet Node.js avec **Fastify** pour gérer le serveur backend.
   - Configurer des middlewares pour la gestion des logs, des erreurs et des requêtes.
   - Implémenter des **API REST** pour gérer les utilisateurs, les parties et les tournois.
   - Intégrer **WebSocket** pour permettre la communication en temps réel entre le serveur et les clients.
   - Ajouter des mécanismes de validation pour les données entrantes.
   - Gérer les erreurs de manière globale pour garantir une meilleure gestion des exceptions.

### 2. **Frontend Framework (Tailwind + TypeScript)**
   - Initialiser le projet frontend avec **TypeScript** pour un code JavaScript typé.
   - Configurer **Tailwind CSS** pour la gestion du design responsif et flexible.
   - Créer une **Single Page Application (SPA)** avec routage pour gérer les différentes vues sans recharger la page.
   - Intégrer les appels **API backend** dans le frontend pour récupérer les données nécessaires.
   - Styliser l'interface utilisateur de manière **responsive** afin qu'elle soit adaptée à tous les types d'appareils.
   - Tester la compatibilité avec différents navigateurs pour garantir une expérience utilisateur homogène.

### 3. **Database Backend (SQLite)**
   - Définir le schéma de la base de données **SQLite** pour stocker les informations sur les utilisateurs, les parties et les tournois.
   - Créer les **tables** nécessaires et établir les **relations** entre elles (par exemple, relation entre utilisateurs et parties).
   - Écrire des requêtes **CRUD** (Create, Read, Update, Delete) pour manipuler les données.
   - Tester l'intégrité des données pour s'assurer qu'elles sont correctement enregistrées et récupérées.
   - Configurer la persistance des données dans Docker en utilisant un **volume Docker** pour stocker les fichiers de la base de données.

### 4. **Blockchain Score Storage (Avalanche + Solidity)**
   - Étudier l'intégration de la blockchain **Avalanche** pour stocker de manière sécurisée les scores des tournois.
   - Développer des **smart contracts** en **Solidity** pour gérer les enregistrements des scores sur la blockchain.
   - Intégrer l'API backend pour communiquer avec la blockchain et gérer les interactions nécessaires.
   - Tester la fonctionnalité de stockage et de récupération des scores sur un environnement de **test blockchain**.
   - Gérer les environnements blockchain de test pour éviter les risques liés au déploiement sur une blockchain en production.

---

## IV.3 User Management

### 5. **Standard User Management**
   - Implémenter l'inscription des utilisateurs de manière **sécurisée** (validation des entrées, hachage des mots de passe).
   - Implémenter le **login** et la gestion des **sessions** avec **JWT** pour garantir que chaque utilisateur est authentifié.
   - Gérer les **profils utilisateurs**, permettant la modification d'avatars et la consultation des statistiques de jeu.
   - Ajouter une gestion des **amis** et de leur statut en ligne.
   - Valider les données des formulaires et sécuriser toutes les interactions avec l'utilisateur.

### 6. **Remote Authentication (Google Sign-in)**
   - Configurer **OAuth Google** pour permettre aux utilisateurs de se connecter via leur compte Google.
   - Implémenter l'authentification **Google Sign-In** et gérer l'échange de tokens de manière sécurisée.
   - Intégrer l'authentification via Google tant côté **frontend** qu'**backend**.
   - Tester les flux d'authentification pour garantir que l'intégration fonctionne de manière fluide et sécurisée.

---

## IV.4 Gameplay & User Experience

### 7. **Remote Players**
   - Permettre à deux joueurs de jouer à distance l'un contre l'autre sur la même partie de Pong.
   - Gérer la **synchronisation réseau** pour que les actions des joueurs soient reflétées en temps réel.
   - Traiter la **latence** et les **déconnexions** pour garantir une expérience de jeu fluide.

### 8. **Multiplayer (>2 joueurs)**
   - Adapter la logique du jeu pour permettre à **plus de deux joueurs** de participer simultanément.
   - Modifier l'**interface utilisateur** pour afficher correctement les actions de plusieurs joueurs.

### 9. **Add Another Game + Matchmaking**
   - Développer un **nouveau jeu** à ajouter à la plateforme en plus de Pong.
   - Implémenter un système de **matchmaking** pour permettre aux utilisateurs de trouver facilement un adversaire.
   - Intégrer un **historique des parties** et afficher les **statistiques** pour chaque joueur.
   - Ajouter le **nouveau jeu** à l'interface utilisateur du site.

### 10. **Game Customization Options**
   - Offrir des options de **personnalisation** pour les jeux disponibles, telles que des **power-ups** et des **cartes** personnalisées.
   - Créer un **menu de configuration** pour que les joueurs puissent ajuster ces paramètres à leur goût.

### 11. **Live Chat**
   - Implémenter un système de **messagerie directe** pour que les joueurs puissent discuter entre eux pendant la partie.
   - Gérer la possibilité pour un joueur de **bloquer** un autre joueur pour ne plus recevoir ses messages.
   - Ajouter des **invitations de jeu** directement via le chat pour que les utilisateurs puissent défier leurs amis.
   - Implémenter des **notifications** concernant les prochains matchs du tournoi et les profils des joueurs.

---

## IV.5 AI-Algo

### 12. **AI Opponent**
   - Développer un adversaire **IA** capable de jouer contre l'utilisateur sans utiliser l'algorithme **A***.
   - Simuler les **entrées clavier** de l'IA pour contrôler les mouvements dans le jeu.
   - Actualiser l'état du jeu à une fréquence de **1 fois par seconde**.
   - Si des **power-ups** sont activés, l'IA doit pouvoir les utiliser.

### 13. **User & Game Stats Dashboards**
   - Créer des **tableaux de bord** pour afficher les statistiques des utilisateurs et des jeux.
   - Intégrer des **graphiques** et des **indicateurs** pour rendre les données plus visuelles et compréhensibles.

---

## IV.6 Cybersecurity

### 14. **WAF/ModSecurity & HashiCorp Vault**
   - Configurer un **Web Application Firewall (WAF)** et **ModSecurity** pour sécuriser l'application contre les attaques web.
   - Intégrer **HashiCorp Vault** pour gérer de manière sécurisée les secrets, comme les clés API et les informations sensibles.

### 15. **GDPR Compliance**
   - Implémenter des fonctionnalités de **conformité GDPR** pour que les utilisateurs puissent exercer leurs droits sur leurs données personnelles.
   - Permettre l'**anonymisation des données** des utilisateurs et la **suppression de leurs comptes**.
   - Proposer une **gestion des données personnelles** où les utilisateurs peuvent consulter, modifier ou supprimer leurs informations.

### 16. **Two-Factor Authentication (2FA) & JWT**
   - Implémenter un système de **2FA** pour ajouter une couche de sécurité supplémentaire à l'authentification des utilisateurs.
   - Gérer les **tokens JWT** pour sécuriser les sessions et assurer que seules les personnes autorisées peuvent accéder aux données sensibles.

---

## IV.7 Devops

### 17. **Infrastructure Log Management (ELK)**
   - Déployer et configurer **Elasticsearch** pour stocker et indexer les logs du système.
   - Configurer **Logstash** pour collecter et transformer les logs des différents services.
   - Mettre en place **Kibana** pour visualiser les logs et créer des dashboards pour analyser l'activité du système.

### 18. **Monitoring System (Prometheus / Grafana)**
   - Installer **Prometheus** pour collecter des métriques et surveiller les performances du système.
   - Installer **Grafana** pour créer des visualisations et des dashboards pour afficher les métriques en temps réel.
   - Configurer des **alertes** pour détecter rapidement les anomalies dans le système.

### 19. **Backend Microservices Design**
   - Découper le backend en **microservices** indépendants, chacun responsable d'une fonction spécifique.
   - Définir des **interfaces API** pour permettre aux microservices de communiquer entre eux.

---

## IV.8 Graphics

### 20. **Advanced 3D Techniques (Babylon.js)**
   - Intégrer **Babylon.js** pour créer des graphismes **3D immersifs** dans le jeu Pong.
   - Développer des effets visuels avancés pour améliorer l'expérience de jeu.

---

## IV.9 Accessibility

### 21. **Support on All Devices**
   - Rendre l'application **responsive** pour qu'elle fonctionne correctement sur tous les types d'appareils (ordinateurs, tablettes, smartphones).

### 22. **Expanding Browser Compatibility**
   - Ajouter le support pour **d'autres navigateurs** afin d'assurer la compatibilité maximale.

### 23. **Multiple Languages Support**
   - Ajouter la possibilité de supporter au moins **3 langues** différentes pour rendre l'application accessible à un public international.
   - Implémenter un **sélecteur de langue** pour que les utilisateurs puissent choisir leur préférence.

### 24. **Accessibility Features for Visually Impaired**
   - Ajouter le support des **lecteurs d'écran** pour les utilisateurs malvoyants.
   - Proposer un **contraste élevé** et des options de **taille de texte** pour améliorer la lisibilité.

### 25. **Server-Side Rendering (SSR) Integration**
   - Implémenter le **Server-Side Rendering (SSR)** pour améliorer les performances et le SEO de l'application.

---

## IV.10 Server-Side Pong

### 26. **Replace Basic Pong with Server-Side + API**
   - Remplacer le jeu Pong de base par une version **côté serveur** pour améliorer la scalabilité.
   - Créer une **API** pour permettre l'interaction avec le jeu et gérer les matchs.

### 27. **Enabling Pong Gameplay via CLI + API Integration**
   - Développer une interface **CLI** pour jouer à Pong en ligne de commande.
   - Connecter le CLI au serveur web et permettre aux utilisateurs de jouer ensemble, que ce soit via le navigateur ou le terminal.

---

## Prérequis et Installation

1. Installer Docker et Docker Compose sur votre machine  
2. Cloner ce repository  
3. Construire et lancer les containers avec :

```bash
docker-compose up --build
