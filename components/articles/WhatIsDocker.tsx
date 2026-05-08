'use client'

export default function WhatIsDocker() {
  return (
    <article className="prose-freeutil">
      <p>Docker packages your application and all its dependencies into a container — a lightweight, isolated environment that runs identically on your laptop, a colleague's machine, and production servers. "It works on my machine" becomes irrelevant.</p>

      <h2>Containers vs Virtual Machines</h2>
      <table>
        <thead><tr><th></th><th>Virtual Machine</th><th>Docker Container</th></tr></thead>
        <tbody>
          <tr><td>OS</td><td>Full guest OS per VM</td><td>Shares host OS kernel</td></tr>
          <tr><td>Size</td><td>GBs</td><td>MBs</td></tr>
          <tr><td>Startup</td><td>Minutes</td><td>Seconds</td></tr>
          <tr><td>Isolation</td><td>Complete hardware isolation</td><td>Process-level isolation</td></tr>
          <tr><td>Overhead</td><td>High (hypervisor)</td><td>Near-native performance</td></tr>
        </tbody>
      </table>
      <p>VMs virtualize hardware. Containers virtualize the OS. Both provide isolation, but containers are much lighter and faster.</p>

      <h2>Core Concepts</h2>
      <ul>
        <li><strong>Image</strong> — a read-only template containing your app, runtime, libraries, and config. Built from a Dockerfile. Like a class in OOP.</li>
        <li><strong>Container</strong> — a running instance of an image. Like an object instantiated from a class. Isolated, but shares the host kernel.</li>
        <li><strong>Dockerfile</strong> — instructions for building an image. Each line creates a layer.</li>
        <li><strong>Registry</strong> — storage for images. Docker Hub is the public registry. AWS ECR, GCR, and GHCR are common private registries.</li>
        <li><strong>Volume</strong> — persistent storage that survives container restarts. Containers are ephemeral by default.</li>
        <li><strong>Network</strong> — Docker containers can communicate through virtual networks.</li>
      </ul>

      <h2>Essential Docker Commands</h2>
      <pre><code>{`# Images
docker pull node:20-alpine           # Download image
docker images                        # List local images
docker rmi node:20-alpine            # Remove image
docker build -t myapp:1.0 .         # Build from Dockerfile

# Containers
docker run node:20-alpine            # Run container
docker run -d -p 3000:3000 myapp    # Detached, port mapping
docker run -it ubuntu bash           # Interactive shell
docker ps                            # Running containers
docker ps -a                         # All containers
docker stop container_id             # Stop container
docker rm container_id               # Remove container
docker logs container_id             # View logs
docker exec -it container_id bash   # Shell into running container`}</code></pre>

      <h2>Writing a Dockerfile</h2>
      <pre><code>{`# Node.js app example
FROM node:20-alpine          # Base image

WORKDIR /app                 # Set working directory

COPY package*.json ./        # Copy dependency files
RUN npm ci                   # Install dependencies

COPY . .                     # Copy app source

EXPOSE 3000                  # Document the port

CMD ["node", "server.js"]    # Start command`}</code></pre>

      <h2>Docker Compose</h2>
      <p>Run multi-container apps (app + database + cache) with a single command:</p>
      <pre><code>{`# docker-compose.yml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb
    depends_on: [db, redis]

  db:
    image: postgres:16
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      POSTGRES_PASSWORD: pass

  redis:
    image: redis:7-alpine

volumes:
  pgdata:

# Commands
docker compose up -d       # Start all services
docker compose down        # Stop all services
docker compose logs -f app # Follow app logs`}</code></pre>
    </article>
  )
}
