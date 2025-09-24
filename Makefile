COMPOSE_FILE = docker-compose.yml
COMPOSE = docker compose -f $(COMPOSE_FILE)
NETWORK = Transcendence

all: build

monitor:
	@watch -n1 docker ps -a
# Services de base (sans ELK ni monitoring)
build: 
	@echo "🪛 Building base services..."
	@docker build -t node-sqlite -f ./images/bdd/Dockerfile .
	@$(COMPOSE) up --build -d

up:
	@echo "🟩 Starting base services..."
	@$(COMPOSE) up -d

down:
	@echo "❌ Stopping base services..."
	@$(COMPOSE) down

stop:
	@echo "⭕️ Stopping base containers..."
	@$(COMPOSE) stop
	@echo "Base containers stopped."

start:
	@echo "✅ Starting base containers..."
	@$(COMPOSE) start
	@echo "Base containers started."

restart: stop start
	@echo "Base containers restarted."

# Services ELK
elk-build:
	@echo "🔨 Building ELK images..."
	@$(COMPOSE) --profile elk build

elk-up:
	@echo "📊 Starting ELK stack..."
	@$(COMPOSE) --profile elk up -d

elk-down:
	@echo "📊 Stopping ELK stack..."
	@$(COMPOSE) --profile elk down

elk-restart:
	@echo "📊 Restarting ELK stack..."
	@$(COMPOSE) --profile elk restart

# Services de monitoring

monitoring-up:
	@echo "📈 Starting monitoring stack..."
	@$(COMPOSE) --profile monitoring up -d

monitoring-down:
	@echo "📈 Stopping monitoring stack..."
	@$(COMPOSE) --profile monitoring down

monitoring-restart:
	@echo "📈 Restarting monitoring stack..."
	@$(COMPOSE) --profile monitoring restart

# Démarrer tous les services (base + ELK + monitoring)
all-build:
	@echo "🔨 Building ALL images..."
	@docker build -t node-sqlite -f ./images/bdd/Dockerfile .
	@$(COMPOSE) --profile elk --profile monitoring up --build -d

all-up:
	@echo "🚀 Starting all services (base + ELK + monitoring)..."
	@$(COMPOSE) --profile elk --profile monitoring up -d

all-down:
	@echo "🛑 Stopping all services..."
	@$(COMPOSE) --profile elk --profile monitoring down
  
fclean:
	@echo "🧹 Stopping and removing ALL containers, images, networks, and volumes (including ELK and monitoring)..."
	@$(COMPOSE) --profile elk --profile monitoring down --rmi local --volumes --remove-orphans
	@echo "✅ All services cleaned."

prune:
	@echo "🧼 Running full Docker system prune (containers, images, volumes, networks)..."
	@docker system prune -a --volumes -f
	@echo "✅ Docker system fully pruned."

re: fclean build
	@echo "Complete rebuild finished."

# Aide pour les commandes disponibles
help:
	@echo "📖 Available commands:"
	@echo ""
	@echo "🏗️  BUILD COMMANDS:"
	@echo "  make build          - Build and start base services only"
	@echo "  make elk-build      - Build ELK images"
	@echo "  make monitoring-build - Build monitoring images"
	@echo "  make all-build      - Build ALL images"
	@echo ""
	@echo "🚀 START/STOP COMMANDS:"
	@echo "  make up             - Start base services"
	@echo "  make down           - Stop base services"
	@echo "  make elk-up         - Start ELK stack"
	@echo "  make elk-down       - Stop ELK stack"
	@echo "  make monitoring-up  - Start monitoring stack"
	@echo "  make monitoring-down - Stop monitoring stack"
	@echo "  make all-up         - Start ALL services"
	@echo "  make all-down       - Stop ALL services"
	@echo ""
	@echo "🧹 Cleaning:"
	@echo "  make fclean         - Remove ALL containers, images, and volumes"
	@echo "  make re             - Complete rebuild (fclean + build)"
	@echo "  make prune          - Remove all unused containers, networks, images (both dangling and unused), and optionally, volumes."
	@echo ""
	@echo "🔧 Utils:"
	@echo "  monitor	         - Monitor the state of the docker with docker ps -a"


.PHONY : all up down du re clean stop start restart fclean prune update elk-build elk-up elk-down elk-restart monitoring-build monitoring-up monitoring-down monitoring-restart all-build all-up all-down help monitor