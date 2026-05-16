'use client'

export default function ApiDesignBestPractices() {
  return (
    <article className="prose-freeutil">
      <p>A well-designed API is intuitive, predictable, and a pleasure to work with. A poorly designed one creates confusion, bugs, and frustrated developers. Here's a comprehensive guide to REST API design that your consumers will actually enjoy using.</p>

      <h2>URL Design</h2>
      <pre><code>{`# Resources are nouns, not verbs
✅ GET /users
✅ GET /users/42
✅ POST /users
✅ PUT /users/42
✅ DELETE /users/42

❌ GET /getUsers
❌ POST /createUser
❌ DELETE /deleteUser/42

# Use plural nouns consistently
✅ /users, /orders, /products
❌ /user, /order, /product (mixing is confusing)

# Nested resources for relationships
✅ GET /users/42/orders          # Orders belonging to user 42
✅ GET /users/42/orders/7        # Specific order of user 42
✅ POST /users/42/orders         # Create order for user 42

# Avoid deep nesting (max 2 levels)
❌ /users/42/orders/7/items/3/reviews  # Too deep`}</code></pre>

      <h2>HTTP Methods</h2>
      <table>
        <thead><tr><th>Method</th><th>Use for</th><th>Idempotent?</th><th>Body?</th></tr></thead>
        <tbody>
          <tr><td>GET</td><td>Retrieve resource(s)</td><td>✅ Yes</td><td>No</td></tr>
          <tr><td>POST</td><td>Create new resource</td><td>❌ No</td><td>Yes</td></tr>
          <tr><td>PUT</td><td>Replace entire resource</td><td>✅ Yes</td><td>Yes</td></tr>
          <tr><td>PATCH</td><td>Partial update</td><td>Usually</td><td>Yes</td></tr>
          <tr><td>DELETE</td><td>Remove resource</td><td>✅ Yes</td><td>Optional</td></tr>
        </tbody>
      </table>

      <h2>Response Status Codes</h2>
      <pre><code>{`# Creation
POST /users → 201 Created (with Location header pointing to new resource)

# Success with no body
DELETE /users/42 → 204 No Content

# Validation error
POST /users { invalid body } → 422 Unprocessable Entity

# Not found
GET /users/999 → 404 Not Found

# Unauthorized
GET /admin/users (no token) → 401 Unauthorized

# Forbidden
GET /admin/users (non-admin token) → 403 Forbidden`}</code></pre>

      <h2>Error Response Format</h2>
      <pre><code>{`// Consistent error format — every error should have this shape
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "age", "message": "Must be a positive integer" }
    ]
  }
}

// Don't leak implementation details
❌ { "error": "ERROR: duplicate key value violates unique constraint users_email_key" }
✅ { "error": { "code": "EMAIL_ALREADY_EXISTS", "message": "An account with this email already exists" } }`}</code></pre>

      <h2>Pagination</h2>
      <pre><code>{`# Cursor-based (preferred for large datasets)
GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ
→ {
    "data": [...],
    "pagination": {
      "nextCursor": "eyJpZCI6MTIwfQ",
      "hasMore": true
    }
  }

# Offset-based (simpler, fine for small datasets)
GET /posts?page=3&limit=20
→ {
    "data": [...],
    "pagination": {
      "page": 3,
      "limit": 20,
      "total": 847,
      "totalPages": 43
    }
  }`}</code></pre>

      <h2>Filtering, Sorting, Field Selection</h2>
      <pre><code>{`# Filtering
GET /orders?status=pending&userId=42

# Sorting
GET /products?sort=price&order=desc
GET /products?sort=-price  # Minus prefix = descending

# Field selection (reduces payload size)
GET /users?fields=id,name,email

# Search
GET /products?q=wireless+headphones`}</code></pre>

      <h2>Versioning</h2>
      <pre><code>{`# URL versioning (most visible, easiest to use)
GET /v1/users
GET /v2/users

# Header versioning (cleaner URLs, harder to test in browser)
GET /users
API-Version: 2

# Never break existing versions — add, don't change
# Deprecate with a Sunset header
Sunset: Sat, 31 Dec 2025 23:59:59 GMT
Deprecation: true`}</code></pre>

      <h2>Response Envelope</h2>
      <pre><code>{`// Wrap responses for consistency and metadata
{
  "data": { "id": 42, "name": "Alice" },
  "meta": { "requestId": "req_abc123", "timestamp": "2025-01-15T10:30:00Z" }
}

// Collections
{
  "data": [{ "id": 1 }, { "id": 2 }],
  "meta": { "total": 847 },
  "links": {
    "self": "/users?page=1",
    "next": "/users?page=2",
    "last": "/users?page=43"
  }
}`}</code></pre>

      <h2>Authentication Conventions</h2>
      <pre><code>{`# Bearer token in Authorization header (standard)
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

# API key (server-to-server)
X-API-Key: sk_live_abc123

# Never in URL query parameters
❌ GET /users?api_key=sk_live_abc123  # Appears in server logs, browser history`}</code></pre>

      <h2>Rate Limiting Headers</h2>
      <pre><code>{`# Return rate limit info in every response
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1714003600

# When limit exceeded
HTTP/1.1 429 Too Many Requests
Retry-After: 60`}</code></pre>
    </article>
  )
}
