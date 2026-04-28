'use client'

export default function CorsErrorFix() {
  return (
    <article className="prose-freeutil">
      <p>CORS (Cross-Origin Resource Sharing) errors are among the most common issues in web development. The error message is clear, but the fix requires understanding why the browser is blocking the request in the first place.</p>

      <h2>Why CORS Exists</h2>
      <p>Browsers enforce the Same-Origin Policy — JavaScript can only make requests to the same origin (protocol + domain + port) as the page. CORS is the mechanism that allows servers to opt in to cross-origin requests by setting specific headers.</p>
      <p>A CORS error means: your browser made a cross-origin request, and the server's response didn't include the headers permitting it.</p>
      <div className="callout">
        <p>⚠️ CORS is a browser security feature — it only affects browser-based requests. curl, Postman, and server-to-server requests are never blocked by CORS.</p>
      </div>

      <h2>The Access-Control-Allow-Origin Header</h2>
      <p>The most important CORS header. The server must include it in the response to allow cross-origin requests:</p>
      <pre><code>{`# Allow all origins (not recommended for production with credentials)
Access-Control-Allow-Origin: *

# Allow a specific origin
Access-Control-Allow-Origin: https://yourfrontend.com`}</code></pre>

      <h2>Preflight Requests</h2>
      <p>For non-simple requests (anything other than GET/POST with simple headers), browsers send a preflight OPTIONS request first to check if the real request is allowed:</p>
      <pre><code>{`// Browser sends before the actual request:
OPTIONS /api/users HTTP/1.1
Origin: https://yourfrontend.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type, Authorization

// Server must respond:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://yourfrontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400`}</code></pre>

      <h2>Fix: Express (Node.js)</h2>
      <pre><code>{`const cors = require('cors')

// Allow all origins
app.use(cors())

// Allow specific origin with credentials
app.use(cors({
  origin: 'https://yourfrontend.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))`}</code></pre>

      <h2>Fix: Nginx</h2>
      <pre><code>{`location /api/ {
    add_header 'Access-Control-Allow-Origin' 'https://yourfrontend.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;

    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Max-Age' 86400;
        return 204;
    }
}`}</code></pre>

      <h2>Fix: FastAPI (Python)</h2>
      <pre><code>{`from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourfrontend.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`}</code></pre>

      <h2>Common Mistakes</h2>
      <ul>
        <li><strong>Using <code>*</code> with <code>credentials: true</code></strong> — browsers reject this combination. You must specify an explicit origin when using credentials.</li>
        <li><strong>Missing preflight handler</strong> — if your server doesn't respond to OPTIONS requests, preflight fails even if simple requests work.</li>
        <li><strong>Setting CORS headers in the wrong place</strong> — if another middleware (like authentication) returns a 401 before CORS headers are added, the browser sees a CORS error instead of an auth error.</li>
      </ul>
    </article>
  )
}
