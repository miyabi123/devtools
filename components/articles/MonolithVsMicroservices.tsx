'use client'

export default function MonolithVsMicroservices() {
  return (
    <article className="prose-freeutil">
      <p>The monolith vs microservices debate is one of the most consequential architectural decisions in software engineering. The wrong choice multiplies complexity and slows teams down. Here's how to think through it clearly.</p>

      <h2>What Is a Monolith?</h2>
      <p>A single deployable unit containing all application functionality. The entire codebase is built, tested, and deployed together.</p>
      <pre><code>{`my-app/
├── auth/         # Authentication
├── users/        # User management
├── orders/       # Order processing
├── payments/     # Payment handling
└── notifications/ # Email/SMS

→ One deployment unit
→ One database
→ One process to run`}</code></pre>

      <h2>What Are Microservices?</h2>
      <p>Independent services, each responsible for a single business capability, communicating over a network (HTTP, gRPC, or message queues).</p>
      <pre><code>{`auth-service/     → Port 3001, its own DB
user-service/     → Port 3002, its own DB
order-service/    → Port 3003, its own DB
payment-service/  → Port 3004, its own DB
notification-svc/ → Port 3005, listens to event queue

→ Each deploys independently
→ Each scales independently
→ Each has its own database`}</code></pre>

      <h2>The Honest Tradeoffs</h2>
      <table>
        <thead><tr><th>Factor</th><th>Monolith</th><th>Microservices</th></tr></thead>
        <tbody>
          <tr><td>Initial development speed</td><td>Fast ✅</td><td>Slow ❌</td></tr>
          <tr><td>Operational complexity</td><td>Low ✅</td><td>Very high ❌</td></tr>
          <tr><td>Independent scaling</td><td>Limited ❌</td><td>Per-service ✅</td></tr>
          <tr><td>Deployment independence</td><td>Deploy all or nothing ❌</td><td>Deploy each separately ✅</td></tr>
          <tr><td>Data consistency</td><td>Easy (ACID transactions) ✅</td><td>Hard (distributed transactions) ❌</td></tr>
          <tr><td>Debugging/tracing</td><td>Simple ✅</td><td>Needs distributed tracing ❌</td></tr>
          <tr><td>Technology flexibility</td><td>One stack ❌</td><td>Per-service choice ✅</td></tr>
          <tr><td>Team independence</td><td>Shared codebase</td><td>Teams own services ✅</td></tr>
        </tbody>
      </table>

      <h2>The Distributed Systems Tax</h2>
      <p>Microservices force you to solve hard distributed systems problems that monoliths avoid entirely:</p>
      <ul>
        <li><strong>Network failures</strong> — service calls can fail; you need retries, timeouts, circuit breakers</li>
        <li><strong>Data consistency</strong> — no cross-service ACID transactions; you need eventual consistency patterns</li>
        <li><strong>Service discovery</strong> — services need to find each other (Kubernetes, Consul, etc.)</li>
        <li><strong>Distributed tracing</strong> — debugging a request across 5 services requires tracing (Jaeger, Zipkin)</li>
        <li><strong>Deployment complexity</strong> — 10 services means 10 CI/CD pipelines, 10 Kubernetes deployments</li>
      </ul>

      <h2>When Each Makes Sense</h2>
      <p><strong>Start with a monolith when:</strong></p>
      <ul>
        <li>You're building something new (boundaries not yet understood)</li>
        <li>Team is small (less than 10-15 engineers)</li>
        <li>Startup or MVP — speed matters most</li>
        <li>Scale requirements are modest</li>
      </ul>
      <p><strong>Consider microservices when:</strong></p>
      <ul>
        <li>Specific components have radically different scaling needs</li>
        <li>Multiple independent teams need to deploy without coordinating</li>
        <li>You have organizational scale (50+ engineers) to absorb the complexity</li>
        <li>You have clear, stable service boundaries from experience with the domain</li>
      </ul>
      <div className="callout">
        <p>Martin Fowler's rule: "Don't start with microservices. Start with a monolith and break it apart when you have clear reasons to do so."</p>
      </div>
    </article>
  )
}
