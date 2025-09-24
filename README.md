##### [🇫🇷 Version française](README.fr.md) / [🇬🇧 English version](README.md)

# FT_TRANSCENDANCE PROJECT FOR 42
By chdonnat (Christophe Donnat from 42 Perpignan, France)

## PROJECT GOAL:
This project involves creating a complete web platform for a real-time multiplayer Pong game. The objective is to develop a modern web application including a backend, a frontend, a database, user authentication, and many other features, all containerized with Docker.

The project is divided into several modules that progressively add advanced features, ranging from a simple game of Pong to a complete gaming platform with chat, tournaments, and even blockchain integration.

## FEATURES (MODULES):
The project is built around a series of optional modules that enrich the experience. Here is an overview of the implemented features:

*   **Backend & Frontend:** Using Fastify for the backend and TypeScript/Tailwind CSS for the frontend as a Single Page Application (SPA).
*   **Database:** Managing user and game data with SQLite.
*   **User Management:** Registration, secure login (JWT), customizable profiles, and remote authentication via Google (OAuth).
*   **Gameplay:**
    *   Remote multiplayer game.
    *   Ability to play with more than 2 players.
    *   Addition of another game and a matchmaking system.
    *   Game customization options (power-ups, maps).
*   **User Experience:**
    *   Live chat with the ability to block users.
    *   Dashboards for player statistics.
*   **AI & Algorithms:**
    *   An AI-controlled opponent.
*   **Cybersecurity:**
    *   Implementation of a WAF (ModSecurity).
    *   Secret management with HashiCorp Vault.
    *   Two-factor authentication (2FA).
*   **DevOps:**
    *   Full containerization with Docker.
    *   Log management with the ELK stack (Elasticsearch, Logstash, Kibana).
    *   Monitoring with Prometheus and Grafana.
*   **Graphics:**
    *   Integration of 3D graphics with Babylon.js.
*   **Accessibility:**
    *   Responsive design for all devices.
    *   Multi-language support.

## USEFUL COMMANDS:
To build and launch all services (requires Docker and Docker Compose):
```bash
make
```
or directly with docker-compose:
```bash
docker-compose up --build
```

To stop the containers:
```bash
docker-compose down
```

## ARCHITECTURE:
The project is organized into several key folders and configuration files:
- **docker-compose.yml**: Main file for orchestrating services with Docker.
- **Makefile**: Contains rules to simplify project management (build, up, down, clean).
- **traefik.yml, services.yml, certs.yml**: Configuration files for the Traefik reverse proxy and service definitions.
- **game/**: Contains the Pong game logic.
- **gate/**: Gateway service (API Gateway) that serves as the single entry point for the frontend.
- **user/**: Service dedicated to user management (authentication, profiles).
- **ia/**: Service for the opponent's artificial intelligence.
- **packages/**: Shared Node.js modules between the different services.
- **public/**: Static frontend files (HTML, CSS, JS).
- **monitoring/**: Configuration for Prometheus and Grafana.
- **ELK/**: Configuration for the Elasticsearch, Logstash, and Kibana stack.
- **certs/**: Storage for SSL certificates.
- **images/**: Contains images used in the project, such as demonstration GIFs.
- **README.md**: This file.

## TECHNICAL DOCUMENTATION:

### Docker and Microservices
The project is fully containerized with Docker, following a microservices architecture. Each major feature (user, game, chat...) is isolated in its own service, communicating via APIs. `docker-compose.yml` orchestrates the deployment of these services.

### Backend: Fastify & Node.js
The backend is built with **Fastify**, a web framework for Node.js known for its speed and low overhead. It handles:
- **REST APIs** for CRUD (Create, Read, Update, Delete) operations on users, games, etc.
- Real-time communication via **WebSockets** for gameplay.
- Authentication and session management with **JWT Tokens**.

### Frontend: TypeScript & Tailwind CSS
The frontend is a **Single Page Application (SPA)**, which means the page is never fully reloaded, providing a smooth user experience.
- **TypeScript** is used to add static typing to JavaScript, making the code more robust and maintainable.
- **Tailwind CSS** is a "utility-first" CSS framework that allows for building modern and responsive designs quickly.

### Authentication: JWT & OAuth
User account security is ensured by several mechanisms:
- **JWT (JSON Web Tokens)**: After logging in, the client receives a token that is used to authenticate subsequent requests.
- **OAuth 2.0**: Users can register and log in via third-party services like Google, without having to create a site-specific password.
- **2FA (Two-Factor Authentication)**: An additional security layer where the user must provide a second code (usually from a mobile app) to log in.

### Monitoring: Prometheus & Grafana
To ensure the stability and performance of the platform, monitoring tools are integrated:
- **Prometheus** continuously collects metrics on the status of the different services (CPU usage, memory, number of requests...).
- **Grafana** allows for visualizing these metrics in the form of graphs and dashboards, and for configuring alerts in case of anomalies.
