# Build and run the entire application
docker-compose-up:
	docker-compose up --build -d

# Stop all containers
docker-compose-down:
	docker-compose down

# Build and run only the backend
backend-up:
	docker-compose up --build backend

# Build and run only the frontend
frontend-up:
	docker-compose up --build web

# View logs
logs:
	docker-compose logs -f

# Clean up unused Docker resources
clean:
	docker system prune -f

# Rebuild specific service
rebuild-backend:
	docker-compose build backend
	docker-compose up -d backend

rebuild-frontend:
	docker-compose build web
	docker-compose up -d web

# Run tests in containers
test-backend:
	docker-compose run --rm backend npm run test

test-frontend:
	docker-compose run --rm web npm run test
