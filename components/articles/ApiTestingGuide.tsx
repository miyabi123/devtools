'use client'

export default function ApiTestingGuide() {
  return (
    <>
      <h2>Why API Testing Matters</h2>
      <p>
        Testing APIs before integrating them saves hours of debugging later. Whether you're consuming a third-party API or building your own, being able to fire requests and inspect responses directly — without writing application code — is a fundamental skill.
      </p>

      <h2>curl — The Universal API Client</h2>
      <p>
        curl is available on every Linux, macOS, and Windows system. No installation needed on most machines. It's the fastest way to make a one-off API request.
      </p>
      <h3>Basic GET request</h3>
      <pre><code>{`curl https://api.github.com/users/octocat
curl -s https://api.example.com/v1/users | jq .  # pretty-print with jq`}</code></pre>

      <h3>POST with JSON body</h3>
      <pre><code>{`curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"name": "Alice", "email": "alice@example.com"}'`}</code></pre>

      <h3>Useful curl flags</h3>
      <table>
        <thead><tr><th>Flag</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>-s</code></td><td>Silent — suppress progress meter</td></tr>
          <tr><td><code>-i</code></td><td>Include response headers in output</td></tr>
          <tr><td><code>-v</code></td><td>Verbose — show request headers too (debugging TLS issues)</td></tr>
          <tr><td><code>-o file</code></td><td>Save response to file instead of stdout</td></tr>
          <tr><td><code>{'-w "%{http_code}"'}</code></td><td>Print response code only (good for scripts)</td></tr>
          <tr><td><code>--compressed</code></td><td>Request gzip compression</td></tr>
          <tr><td><code>-k</code></td><td>Skip SSL verification (dev only — never prod)</td></tr>
          <tr><td><code>-u user:pass</code></td><td>Basic auth</td></tr>
          <tr><td><code>-F "file=@path"</code></td><td>Upload a file (multipart/form-data)</td></tr>
        </tbody>
      </table>

      <h3>Test response codes in scripts</h3>
      <pre><code>{`STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health)
if [ "$STATUS" -ne 200 ]; then
  echo "API unhealthy: $STATUS"
  exit 1
fi`}</code></pre>

      <h2>httpie — More Human-Friendly</h2>
      <p>Install: <code>pip install httpie</code> or <code>brew install httpie</code></p>
      <pre><code>{`# GET
http GET api.example.com/users

# POST JSON (auto-detected)
http POST api.example.com/users name=Alice email=alice@example.com

# With auth header
http GET api.example.com/profile Authorization:"Bearer $TOKEN"

# Upload file
http POST api.example.com/upload file@/path/to/file.pdf`}</code></pre>

      <h2>Postman — Organized Collections</h2>
      <p>
        Postman is best when you're working with an API regularly and want to organize requests, share them with a team, or run automated test suites.
      </p>
      <h3>Key Postman features</h3>
      <ul>
        <li><strong>Collections</strong> — group related requests (e.g., all user endpoints in one collection)</li>
        <li><strong>Environments</strong> — switch between dev/staging/production with variable substitution (<code>{'{{base_url}}'}</code>, <code>{'{{token}}'}</code>)</li>
        <li><strong>Pre-request scripts</strong> — run JavaScript before a request (e.g., refresh auth token)</li>
        <li><strong>Tests</strong> — write assertions on response status, body, headers</li>
        <li><strong>Collection Runner</strong> — run all requests in a collection sequentially</li>
        <li><strong>Newman</strong> — run Postman collections from the command line in CI/CD</li>
      </ul>
      <pre><code>{`// Postman test example (Tests tab)
pm.test("Status is 200", () => {
  pm.response.to.have.status(200)
})

pm.test("Response has user id", () => {
  const body = pm.response.json()
  pm.expect(body.id).to.be.a("number")
})`}</code></pre>

      <h2>Bruno — Git-Friendly Alternative</h2>
      <p>
        Bruno stores API collections as plain files on disk — you can commit them to your repository alongside the code they test. No account required, fully open source.
      </p>
      <pre><code>{`# Example Bruno request file (users/get-user.bru)
meta {
  name: Get User
  type: http
}

get {
  url: {{baseUrl}}/users/{{userId}}
  body: none
  auth: bearer
}

auth:bearer {
  token: {{authToken}}
}`}</code></pre>

      <h2>Testing GraphQL APIs</h2>
      <pre><code>{`# curl a GraphQL endpoint
curl -X POST https://api.example.com/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ user(id: 1) { name email } }"}'`}</code></pre>
      <p>For GraphQL, <strong>Insomnia</strong> or <strong>Altair</strong> have better built-in GraphQL support with schema introspection and autocomplete.</p>

      <h2>Reading API Responses</h2>
      <h3>Important headers to check</h3>
      <table>
        <thead><tr><th>Header</th><th>What to look for</th></tr></thead>
        <tbody>
          <tr><td><code>Content-Type</code></td><td>Should be <code>application/json</code> for JSON APIs</td></tr>
          <tr><td><code>X-RateLimit-Remaining</code></td><td>How many requests you have left before rate limiting</td></tr>
          <tr><td><code>X-Request-Id</code></td><td>Unique ID for the request — send this to support when reporting bugs</td></tr>
          <tr><td><code>Cache-Control</code></td><td>Whether response can be cached</td></tr>
          <tr><td><code>Location</code></td><td>URL of newly created resource (201 responses)</td></tr>
        </tbody>
      </table>

      <h2>Summary</h2>
      <p>
        Use curl for quick one-off tests and scripting. Use httpie when you want cleaner syntax interactively. Use Postman or Bruno for organized collections you'll use repeatedly and share with a team. The key habit is to always test API endpoints manually before integrating — it's much faster to spot a mismatch in curl than to debug it inside your application.
      </p>
    </>
  )
}
