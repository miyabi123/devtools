export default function JSONvsYAML() {
  return (
    <>
      <h2>JSON and YAML: An Overview</h2>
      <p>JSON (JavaScript Object Notation) and YAML (YAML Ain't Markup Language) are both data serialization formats used to represent structured data as text. They serve similar purposes but have different strengths and typical use cases.</p>

      <h2>Syntax Comparison</h2>
      <pre><code>{`// JSON
{
  "name": "FreeUtil",
  "version": "1.0",
  "features": ["jwt", "base64", "regex"],
  "config": {
    "maxItems": 100,
    "debug": false
  }
}

# YAML (same data)
name: FreeUtil
version: "1.0"
features:
  - jwt
  - base64
  - regex
config:
  maxItems: 100
  debug: false`}</code></pre>

      <h2>Key Differences</h2>
      <table>
        <thead><tr><th></th><th>JSON</th><th>YAML</th></tr></thead>
        <tbody>
          <tr><td>Comments</td><td>❌ Not supported</td><td>✅ Yes (<code>#</code>)</td></tr>
          <tr><td>Readability</td><td>Moderate</td><td>High (no brackets/quotes)</td></tr>
          <tr><td>Strictness</td><td>Strict</td><td>Flexible (can be error-prone)</td></tr>
          <tr><td>Multi-line strings</td><td>Awkward (<code>\n</code>)</td><td>Native support</td></tr>
          <tr><td>Data types</td><td>String, number, boolean, null, array, object</td><td>All JSON types + dates, anchors, aliases</td></tr>
          <tr><td>Parsing speed</td><td>Fast</td><td>Slower</td></tr>
          <tr><td>Browser support</td><td>Native</td><td>Requires library</td></tr>
          <tr><td>Common use</td><td>APIs, web</td><td>Config files, DevOps</td></tr>
        </tbody>
      </table>

      <h2>When to Use JSON</h2>
      <ul>
        <li>REST API requests and responses</li>
        <li>Web browser storage (localStorage, IndexedDB)</li>
        <li>Configuration files that need to be parsed by browsers</li>
        <li>Package.json, tsconfig.json</li>
        <li>When performance and strict parsing matter</li>
      </ul>

      <h2>When to Use YAML</h2>
      <ul>
        <li>Kubernetes manifests and Helm charts</li>
        <li>Docker Compose files</li>
        <li>CI/CD pipelines (GitHub Actions, GitLab CI)</li>
        <li>Application configuration files (where humans write/edit the config)</li>
        <li>Ansible playbooks</li>
      </ul>

      <div className="callout">
        <p>⚠️ YAML's flexibility can be a source of bugs. The "Norway problem" is famous: the two-letter country code "NO" is parsed as boolean <code>false</code> in YAML 1.1. Always quote strings that could be ambiguous.</p>
      </div>
    </>
  )
}
