'use client'

export default function HowToDebugApiRequests() {
  return (
    <article className="prose-freeutil">
      <p>Debugging API requests is a core developer skill. Whether you're integrating a third-party API, building your own, or tracking down an intermittent bug, the right tools and techniques make the difference between a 5-minute fix and an afternoon of frustration.</p>

      <h2>Browser DevTools (Network Tab)</h2>
      <p>The first tool to reach for when debugging browser-initiated requests:</p>
      <ol>
        <li>Open DevTools (F12 or Cmd+Option+I)</li>
        <li>Go to the <strong>Network</strong> tab</li>
        <li>Trigger the action in your app</li>
        <li>Click the request to inspect it</li>
      </ol>
      <p>Key things to check:</p>
      <ul>
        <li><strong>Headers tab</strong> — request headers (Authorization, Content-Type), response headers (CORS, Content-Type, Set-Cookie)</li>
        <li><strong>Payload tab</strong> — request body (is the JSON malformed? missing fields?)</li>
        <li><strong>Preview/Response tab</strong> — decoded response body</li>
        <li><strong>Timing tab</strong> — how long each phase took (DNS, TLS, TTFB, download)</li>
      </ul>

      <h2>curl — Universal HTTP Client</h2>
      <pre><code>{`# Basic GET
curl https://api.example.com/users

# With auth header
curl -H "Authorization: Bearer TOKEN" https://api.example.com/users

# POST with JSON body
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# Show response headers
curl -I https://api.example.com/users

# Show both request and response headers
curl -v https://api.example.com/users

# Save response to file
curl -o response.json https://api.example.com/data

# Follow redirects
curl -L https://api.example.com/redirect

# Set timeout
curl --connect-timeout 5 --max-time 10 https://api.example.com/slow`}</code></pre>

      <h2>curl Debugging Tips</h2>
      <pre><code>{`# See exactly what curl sends (verbose)
curl -v -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'

# Test with different Content-Type
curl -X POST https://api.example.com/data \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=Alice&email=alice@example.com"

# Decode a JWT from response
curl https://api.example.com/auth/login \
  -d '{"email":"test@example.com","password":"pass"}' \
  | python3 -c "
import sys, json, base64
token = json.load(sys.stdin)['token']
payload = token.split('.')[1]
payload += '=' * (4 - len(payload) % 4)
print(json.dumps(json.loads(base64.b64decode(payload)), indent=2))
"`}</code></pre>

      <h2>Diagnosing Common Issues</h2>
      <h3>401 Unauthorized</h3>
      <pre><code>{`# Check token is present and correctly formatted
curl -v https://api.example.com/protected \
  -H "Authorization: Bearer YOUR_TOKEN" 2>&1 | grep -i "authorization\|401"

# Decode JWT to check expiry
# exp claim is a Unix timestamp — compare with current time`}</code></pre>

      <h3>CORS Errors</h3>
      <pre><code>{`# CORS only affects browser requests. Test with curl to isolate:
curl -v -X OPTIONS https://api.example.com/data \
  -H "Origin: https://yourfrontend.com" \
  -H "Access-Control-Request-Method: POST"

# Look for these headers in response:
# Access-Control-Allow-Origin: https://yourfrontend.com
# Access-Control-Allow-Methods: POST, GET, OPTIONS`}</code></pre>

      <h3>Slow Responses</h3>
      <pre><code>{`# Time each phase of the request
curl -w "\n
Time to connect:    %{time_connect}s
Time for TLS:       %{time_appconnect}s
Time to first byte: %{time_starttransfer}s
Total time:         %{time_total}s\n" \
  -o /dev/null -s https://api.example.com/slow

# High time_starttransfer = slow server processing
# High time_appconnect = TLS overhead
# High time_connect = network/DNS latency`}</code></pre>

      <h2>Inspecting HTTPS Traffic with mitmproxy</h2>
      <pre><code>{`# Install and start mitmproxy
pip install mitmproxy
mitmproxy --listen-port 8080

# Configure your app to use HTTP proxy:
export HTTP_PROXY=http://localhost:8080
export HTTPS_PROXY=http://localhost:8080
export NODE_TLS_REJECT_UNAUTHORIZED=0  # Dev only!

# Now all requests appear in mitmproxy with full detail`}</code></pre>

      <h2>Logging API Requests in Code</h2>
      <pre><code>{`// Node.js with axios interceptor — log all requests
axios.interceptors.request.use(config => {
  console.log('[API Request]', config.method?.toUpperCase(), config.url)
  console.log('Headers:', config.headers)
  if (config.data) console.log('Body:', JSON.stringify(config.data, null, 2))
  return config
})

axios.interceptors.response.use(
  response => {
    console.log('[API Response]', response.status, response.config.url)
    return response
  },
  error => {
    console.error('[API Error]', error.response?.status, error.message)
    console.error('Response body:', error.response?.data)
    return Promise.reject(error)
  }
)`}</code></pre>
    </article>
  )
}
