'use client'

export default function WhatIsApi() {
  return (
    <article className="prose-freeutil">
      <p>API stands for Application Programming Interface. In plain terms, an API is a contract between two software systems that defines how they can talk to each other — what you can ask for, how to ask, and what you'll get back.</p>

      <h2>The Restaurant Analogy</h2>
      <p>Think of a restaurant. You (the client) sit at a table and look at a menu. The menu is the API — it lists what's available and how to order. You tell the waiter (the API) what you want. The waiter takes your order to the kitchen (the server). The kitchen prepares the food and the waiter brings it back. You never go into the kitchen directly.</p>
      <p>APIs work the same way. Your app sends a request to an API, the server processes it, and the API returns a response. The server's internal logic stays hidden.</p>

      <h2>How an API Request Works</h2>
      <pre><code>{`// Request
GET https://api.example.com/users/42
Authorization: Bearer eyJhbGc...
Content-Type: application/json

// Response
HTTP/1.1 200 OK
{
  "id": 42,
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}`}</code></pre>

      <h2>Types of APIs</h2>
      <h3>REST (Representational State Transfer)</h3>
      <p>The most common type. Uses standard HTTP methods (GET, POST, PUT, DELETE) and URLs to represent resources. Returns JSON. Stateless — each request contains all needed information.</p>
      <pre><code>{`GET    /users        → list users
POST   /users        → create user
GET    /users/42     → get user 42
PUT    /users/42     → update user 42
DELETE /users/42     → delete user 42`}</code></pre>

      <h3>GraphQL</h3>
      <p>A query language where clients specify exactly what data they need. One endpoint, flexible queries. Avoids over-fetching and under-fetching data.</p>
      <pre><code>{`POST /graphql
{ "query": "{ user(id: 42) { name email posts { title } } }" }
→ Returns exactly: name, email, and post titles — nothing more`}</code></pre>

      <h3>Webhooks</h3>
      <p>Reverse APIs — instead of you asking for data, the server pushes data to you when something happens. Stripe sends a webhook to your server when a payment succeeds. GitHub sends a webhook when code is pushed.</p>
      <pre><code>{`// Stripe sends this to YOUR server when payment succeeds:
POST https://yoursite.com/webhooks/stripe
{
  "type": "payment_intent.succeeded",
  "data": { "object": { "amount": 2000, "currency": "thb" } }
}`}</code></pre>

      <h2>API Authentication</h2>
      <ul>
        <li><strong>API Key</strong> — a secret string sent in headers. Simple, common for server-to-server calls.</li>
        <li><strong>Bearer Token / JWT</strong> — a signed token proving identity. Common in web and mobile apps.</li>
        <li><strong>OAuth 2.0</strong> — delegated access. "Login with Google" uses OAuth to let your app access Google data on the user's behalf.</li>
      </ul>

      <h2>Reading API Documentation</h2>
      <p>Good API docs show: the base URL, authentication method, each endpoint with method and path, request parameters and body schema, response format with examples, and error codes. OpenAPI/Swagger format is the standard — it can auto-generate interactive documentation.</p>

      <h2>Testing APIs</h2>
      <pre><code>{`# curl — universal command-line tool
curl -X GET https://api.example.com/users \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# httpie — friendlier syntax
http GET https://api.example.com/users Authorization:"Bearer TOKEN"
http POST https://api.example.com/users name=Alice email=alice@example.com`}</code></pre>
    </article>
  )
}
