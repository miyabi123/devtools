'use client'

export default function DockerComposeGuide() {
  return (
    <article className="prose-freeutil">
      <p>Docker Compose lets you define and run multi-container applications — your app server, database, cache, and message queue — with a single <code>docker compose up</code> command. No more manual container orchestration.</p>

      <h2>docker-compose.yml Structure</h2>
      <pre><code>{`version: '3.9'   # Compose file format version

services:         # Each container is a service
  app:            # Service name (used as hostname in the network)
    build: .      # Build from Dockerfile in current directory
    ports:
      - "3000:3000"       # host:container
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://user:pass@db:5432/mydb
    depends_on:
      db:
        condition: service_healthy   # Wait for health check
    volumes:
      - ./logs:/app/logs             # Bind mount

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data   # Named volume (persists)
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --save 60 1  # Persist every 60s if 1+ key changed

volumes:
  pgdata:    # Declare named volumes here`}</code></pre>

      <h2>Essential Commands</h2>
      <pre><code>{`docker compose up              # Start all services (foreground)
docker compose up -d           # Start in background (detached)
docker compose up --build      # Rebuild images before starting
docker compose down            # Stop and remove containers
docker compose down -v         # Also remove volumes ⚠️ deletes data!

docker compose logs            # View all service logs
docker compose logs -f app     # Follow specific service logs
docker compose ps              # List running containers
docker compose exec app bash   # Shell into running container
docker compose restart app     # Restart a specific service`}</code></pre>

      <h2>Patterns: App + PostgreSQL + Redis</h2>
      <pre><code>{`services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: \${DB_PASSWORD:-devpassword}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Run on first start
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:`}</code></pre>

      <h2>Override Files for Different Environments</h2>
      <pre><code>{`# docker-compose.yml — base config (shared)
# docker-compose.override.yml — auto-loaded locally (dev settings)
# docker-compose.prod.yml — production overrides

# Development (auto-loads override.yml)
docker compose up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# docker-compose.override.yml (development)
services:
  app:
    volumes:
      - .:/app          # Mount source code for hot reload
    environment:
      NODE_ENV: development`}</code></pre>
    </article>
  )
}
