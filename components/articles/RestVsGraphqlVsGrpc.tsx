'use client'

export default function RestVsGraphqlVsGrpc() {
  return (
    <article className="prose-freeutil">
      <p>REST, GraphQL, and gRPC are three fundamentally different approaches to API design. Choosing the wrong one adds unnecessary complexity; choosing the right one makes your system significantly simpler. Here's a practical comparison.</p>

      <h2>REST</h2>
      <p>Representational State Transfer. Resources are URLs, HTTP verbs are actions. The web's native API style — simple, universally understood, works everywhere.</p>
      <pre><code>{`GET    /orders           → list orders
POST   /orders           → create order
GET    /orders/123       → get order 123
PUT    /orders/123       → replace order 123
PATCH  /orders/123       → partially update
DELETE /orders/123       → delete order`}</code></pre>
      <p><strong>Best for:</strong> Public APIs, browser-based apps, CRUD services, anything where universal compatibility matters.</p>
      <p><strong>Weaknesses:</strong> Over-fetching (getting more data than needed) and under-fetching (needing multiple requests to assemble data). Versioning (/v1/, /v2/) gets messy.</p>

      <h2>GraphQL</h2>
      <p>A query language where the client specifies exactly what it needs. One endpoint, infinitely flexible. Developed by Facebook to solve REST's over/under-fetching problem in their mobile apps.</p>
      <pre><code>{`# Client asks for exactly what it needs
POST /graphql
{
  "query": "{ order(id: 123) { id status items { name price } customer { name } } }"
}

# Returns exactly: order id, status, item names and prices, customer name
# Nothing more, nothing less`}</code></pre>
      <p><strong>Best for:</strong> Complex data graphs, mobile apps (bandwidth-sensitive), teams where frontend and backend evolve independently, apps where different clients need different data shapes.</p>
      <p><strong>Weaknesses:</strong> N+1 query problem requires DataLoader, caching is harder than REST, complex queries can overload servers without depth limiting, tooling overhead.</p>

      <h2>gRPC</h2>
      <p>Google's RPC framework using Protocol Buffers (binary serialization) over HTTP/2. Defines services and messages in <code>.proto</code> files; code is generated automatically for all languages.</p>
      <pre><code>{`// users.proto
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);  // streaming
}

message GetUserRequest { int32 id = 1; }
message User { int32 id = 1; string name = 2; string email = 3; }`}</code></pre>
      <p><strong>Best for:</strong> Internal microservice communication, high-performance systems (binary is 5-10x smaller than JSON), polyglot environments (auto-generated clients), streaming (real-time data).</p>
      <p><strong>Weaknesses:</strong> Not human-readable, browser support requires grpc-web proxy, learning curve, overkill for simple CRUD APIs.</p>

      <h2>Comparison Table</h2>
      <table>
        <thead><tr><th>Factor</th><th>REST</th><th>GraphQL</th><th>gRPC</th></tr></thead>
        <tbody>
          <tr><td>Protocol</td><td>HTTP/1.1+</td><td>HTTP/1.1+</td><td>HTTP/2</td></tr>
          <tr><td>Format</td><td>JSON (usually)</td><td>JSON</td><td>Protobuf (binary)</td></tr>
          <tr><td>Performance</td><td>Good</td><td>Good</td><td>Excellent</td></tr>
          <tr><td>Browser support</td><td>✅ Native</td><td>✅ Native</td><td>⚠️ Needs proxy</td></tr>
          <tr><td>Type safety</td><td>Manual/OpenAPI</td><td>Schema enforced</td><td>✅ Enforced</td></tr>
          <tr><td>Streaming</td><td>Limited (SSE)</td><td>Subscriptions</td><td>✅ Built-in</td></tr>
          <tr><td>Learning curve</td><td>Low</td><td>Medium</td><td>High</td></tr>
          <tr><td>Best use case</td><td>Public APIs</td><td>Complex frontends</td><td>Microservices</td></tr>
        </tbody>
      </table>

      <h2>Decision Guide</h2>
      <ul>
        <li>Building a public API others will consume → <strong>REST</strong></li>
        <li>Mobile app with complex data needs → <strong>GraphQL</strong></li>
        <li>Internal microservice communication → <strong>gRPC</strong></li>
        <li>Team unfamiliar with GraphQL/gRPC → <strong>REST</strong></li>
        <li>Real-time data streaming → <strong>gRPC</strong> or GraphQL subscriptions</li>
        <li>Need maximum performance between services → <strong>gRPC</strong></li>
      </ul>
    </article>
  )
}
