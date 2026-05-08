'use client'

export default function ThaiPdpaDevelopers() {
  return (
    <article className="prose-freeutil">
      <p>Thailand's Personal Data Protection Act (PDPA) came into full effect in June 2022. If you're building a product for Thai users or operating a business in Thailand, understanding your obligations is essential. This guide covers what developers and tech teams need to know.</p>

      <h2>What is PDPA?</h2>
      <p>The PDPA (พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562) is Thailand's comprehensive data privacy law, similar in spirit to Europe's GDPR. It governs how personal data is collected, processed, stored, and transferred.</p>

      <h2>Who Must Comply?</h2>
      <p>Any organization that:</p>
      <ul>
        <li>Collects or processes personal data of people in Thailand</li>
        <li>Operates a business or offers goods/services in Thailand</li>
        <li>Monitors behavior of people in Thailand</li>
      </ul>
      <p>This includes foreign companies — if you have Thai users, PDPA applies.</p>

      <h2>What is Personal Data Under PDPA?</h2>
      <p>Any information that can identify an individual, directly or indirectly:</p>
      <ul>
        <li>Name, email, phone number, address</li>
        <li>National ID number, passport number</li>
        <li>IP address, device ID, cookies</li>
        <li>Location data, biometric data</li>
        <li>Health information, financial data</li>
      </ul>
      <p>Sensitive categories (requiring explicit consent): race, religion, health, sexual behavior, criminal record, biometric data, union membership, political opinion.</p>

      <h2>Lawful Bases for Processing</h2>
      <p>You must have a legal basis for processing personal data:</p>
      <ul>
        <li><strong>Consent</strong> — explicit, informed, specific, freely given, and revocable</li>
        <li><strong>Contract</strong> — necessary to perform a contract with the person</li>
        <li><strong>Legal obligation</strong> — required by law</li>
        <li><strong>Vital interests</strong> — to protect life</li>
        <li><strong>Legitimate interests</strong> — balanced against data subject rights</li>
        <li><strong>Public task</strong> — government functions</li>
      </ul>

      <h2>Data Subject Rights (What Users Can Request)</h2>
      <table>
        <thead><tr><th>Right</th><th>What it means for your system</th></tr></thead>
        <tbody>
          <tr><td>Access</td><td>User can request a copy of their data</td></tr>
          <tr><td>Rectification</td><td>User can correct inaccurate data</td></tr>
          <tr><td>Erasure</td><td>User can request deletion ("right to be forgotten")</td></tr>
          <tr><td>Data portability</td><td>Export data in machine-readable format</td></tr>
          <tr><td>Withdraw consent</td><td>Opt out of processing at any time</td></tr>
          <tr><td>Object to processing</td><td>Stop processing for specific purposes</td></tr>
        </tbody>
      </table>

      <h2>Developer Compliance Checklist</h2>
      <ul>
        <li>✅ Add a privacy policy describing what data you collect and why</li>
        <li>✅ Implement consent banners for cookies and tracking</li>
        <li>✅ Log consent with timestamp and user ID</li>
        <li>✅ Build a data export endpoint for portability requests</li>
        <li>✅ Build a data deletion pipeline for erasure requests</li>
        <li>✅ Encrypt personal data at rest (AES-256) and in transit (TLS)</li>
        <li>✅ Log data access for audit trails</li>
        <li>✅ Implement data breach notification within 72 hours to PDPC</li>
        <li>✅ Sign Data Processing Agreements with third-party services (analytics, email, CRM)</li>
        <li>✅ Appoint a Data Protection Officer (DPO) if processing at scale</li>
      </ul>

      <h2>Penalties</h2>
      <p>Administrative fines up to ฿5 million. Criminal penalties of up to 1 year imprisonment and ฿1 million fine for certain violations. Civil liability to affected individuals. The PDPC (Personal Data Protection Committee) is the enforcement authority.</p>
    </article>
  )
}
