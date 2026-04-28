'use client'

export default function JsonVsXml() {
  return (
    <article className="prose-freeutil">
      <p>
        JSON and XML are both data interchange formats used to represent structured data. JSON has largely replaced XML in web APIs, but XML remains dominant in enterprise systems, document formats, and configuration files. Understanding the tradeoffs helps you choose the right format and work with both confidently.
      </p>

      <h2>Syntax Comparison</h2>
      <p>The same data in both formats:</p>
      <pre><code>{`// JSON
{
  "user": {
    "id": 42,
    "name": "Alice",
    "roles": ["admin", "editor"],
    "active": true
  }
}

<!-- XML -->
<user>
  <id>42</id>
  <name>Alice</name>
  <roles>
    <role>admin</role>
    <role>editor</role>
  </roles>
  <active>true</active>
</user>`}</code></pre>
      <p>
        JSON is immediately more compact. The XML equivalent is roughly 2–3x larger due to closing tags. For high-volume APIs, this difference in payload size is significant.
      </p>

      <h2>Data Types</h2>
      <p>
        JSON has native data types: string, number, boolean, null, array, and object. XML has only one data type — text. Everything in XML is a string, and consumers must interpret types from context or a schema.
      </p>
      <table>
        <thead>
          <tr><th>Concept</th><th>JSON</th><th>XML</th></tr>
        </thead>
        <tbody>
          <tr><td>Numbers</td><td>Native: <code>42</code>, <code>3.14</code></td><td>String: <code>&lt;price&gt;3.14&lt;/price&gt;</code></td></tr>
          <tr><td>Booleans</td><td>Native: <code>true</code>, <code>false</code></td><td>String: <code>&lt;active&gt;true&lt;/active&gt;</code></td></tr>
          <tr><td>Null</td><td>Native: <code>null</code></td><td>No standard — use attribute or empty tag</td></tr>
          <tr><td>Arrays</td><td>Native: <code>[1, 2, 3]</code></td><td>Repeated elements: <code>&lt;item&gt;1&lt;/item&gt;&lt;item&gt;2&lt;/item&gt;</code></td></tr>
          <tr><td>Attributes</td><td>Not applicable</td><td>Metadata on elements: <code>&lt;user id="42"&gt;</code></td></tr>
          <tr><td>Comments</td><td>Not supported</td><td>Supported: <code>&lt;!-- comment --&gt;</code></td></tr>
          <tr><td>Namespaces</td><td>Not supported</td><td>Full namespace support</td></tr>
        </tbody>
      </table>

      <h2>Schema Validation</h2>
      <p>
        XML has mature schema standards: DTD, XML Schema (XSD), and RELAX NG. XSD in particular allows precise definition of element types, required fields, value constraints, and complex relationships. This makes XML the format of choice for highly structured document standards like XBRL (financial reporting), HL7 (healthcare), and SOAP web services.
      </p>
      <p>
        JSON Schema is the JSON equivalent and has matured significantly — it's now used widely in OpenAPI specifications and configuration validation. However, XML Schema remains more expressive for deeply nested, document-oriented data.
      </p>

      <h2>Parsing and Performance</h2>
      <p>
        JSON parsing is faster in JavaScript (it's a subset of JavaScript object notation) and generally in most languages. XML parsers must handle namespaces, attributes, mixed content, and a more complex grammar.
      </p>
      <p>
        For a typical 10KB payload, JSON parsing is roughly 2–5x faster than XML parsing. At scale — millions of API calls per day — this difference is meaningful.
      </p>

      <h2>When XML Is Still the Right Choice</h2>
      <ul>
        <li><strong>SOAP web services</strong> — SOAP envelopes are XML and there's no alternative</li>
        <li><strong>Document formats</strong> — Microsoft Office (DOCX, XLSX), SVG, and RSS/Atom feeds are XML</li>
        <li><strong>Enterprise standards</strong> — XBRL, HL7, FHIR (older versions), EDI, and many government data standards require XML</li>
        <li><strong>Mixed content</strong> — XML handles documents where markup and text are interleaved (like HTML): <code>&lt;p&gt;Hello &lt;b&gt;world&lt;/b&gt;&lt;/p&gt;</code></li>
        <li><strong>Namespaces</strong> — when combining data from multiple sources with potentially conflicting element names</li>
        <li><strong>XSLT transformations</strong> — XML has powerful transformation capabilities with no JSON equivalent</li>
      </ul>

      <h2>When JSON Is the Right Choice</h2>
      <ul>
        <li><strong>REST APIs</strong> — JSON is the default for virtually all modern web APIs</li>
        <li><strong>JavaScript applications</strong> — JSON maps directly to JS objects with <code>JSON.parse()</code></li>
        <li><strong>Configuration files</strong> — <code>package.json</code>, <code>tsconfig.json</code>, most tool configs</li>
        <li><strong>NoSQL databases</strong> — MongoDB, DynamoDB, and Firestore store and query JSON natively</li>
        <li><strong>Mobile APIs</strong> — smaller payloads mean faster responses on mobile networks</li>
      </ul>

      <h2>Converting Between Them</h2>
      <p>
        Converting between JSON and XML is straightforward for simple structures but has edge cases: XML attributes have no JSON equivalent, XML supports mixed content (text + elements), and XML element order is significant in some schemas.
      </p>
      <pre><code>{`// Python: JSON to XML
import json
import dicttoxml

data = json.loads('{"name": "Alice", "age": 30}')
xml = dicttoxml.dicttoxml(data)

// Node.js: XML to JSON
const { XMLParser } = require('fast-xml-parser')
const parser = new XMLParser({ ignoreAttributes: false })
const json = parser.parse(xmlString)`}</code></pre>
    </article>
  )
}
