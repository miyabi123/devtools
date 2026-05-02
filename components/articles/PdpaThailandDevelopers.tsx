'use client'

export default function PdpaThailandDevelopers() {
  return (
    <>
      <h2>What is Thailand's PDPA?</h2>
      <p>
        The <strong>Personal Data Protection Act B.E. 2562 (2019)</strong> — known as PDPA — is Thailand's comprehensive data privacy law that came into full effect on June 1, 2022. It applies to any organization that collects, uses, or discloses personal data of individuals in Thailand, regardless of where the organization is located.
      </p>
      <p>
        If you're building apps, websites, or systems that handle Thai users' data, PDPA compliance is not optional. Non-compliance can result in fines up to 5 million baht per violation, plus criminal liability in severe cases.
      </p>

      <h2>What Counts as Personal Data?</h2>
      <p>
        Under PDPA, personal data is broadly defined as any information that can identify a natural person, directly or indirectly:
      </p>
      <ul>
        <li>Name, surname, date of birth</li>
        <li>National ID number, passport number</li>
        <li>Email address, phone number</li>
        <li>IP address, device ID, cookies</li>
        <li>Location data</li>
        <li>Behavioral data, browsing history</li>
        <li>Photos, audio, video containing identifiable individuals</li>
      </ul>

      <h3>Sensitive Personal Data (Higher Protection Required)</h3>
      <ul>
        <li>Race, ethnicity, political opinion, religious belief</li>
        <li>Sexual behavior or orientation</li>
        <li>Criminal record</li>
        <li>Health data, disabilities, medical records</li>
        <li>Labor union membership</li>
        <li>Genetic data, biometric data (fingerprints, facial recognition)</li>
      </ul>
      <div className="callout">
        <p><strong>Sensitive data requires explicit consent</strong> — no legitimate interest or other bases. Never collect sensitive data unless you have a clear, documented reason and proper consent.</p>
      </div>

      <h2>Lawful Bases for Processing Data</h2>
      <p>PDPA requires a lawful basis for every processing activity. The six bases are:</p>
      <table>
        <thead><tr><th>Basis</th><th>When to Use</th></tr></thead>
        <tbody>
          <tr><td><strong>Consent</strong></td><td>User explicitly agrees. Must be freely given, specific, informed, and revocable.</td></tr>
          <tr><td><strong>Contract</strong></td><td>Processing necessary to perform a contract with the data subject (e.g., delivery address for an order).</td></tr>
          <tr><td><strong>Legal obligation</strong></td><td>Required by law (e.g., tax records, KYC requirements).</td></tr>
          <tr><td><strong>Vital interests</strong></td><td>Protecting life in emergencies.</td></tr>
          <tr><td><strong>Public interest</strong></td><td>Tasks in the public interest or official authority.</td></tr>
          <tr><td><strong>Legitimate interests</strong></td><td>Necessary for your legitimate business interests, unless overridden by the individual's rights. Cannot be used for sensitive data.</td></tr>
        </tbody>
      </table>

      <h2>Consent Requirements</h2>
      <p>When relying on consent, it must be:</p>
      <ul>
        <li><strong>Freely given</strong> — no forced bundling ("accept cookies or you can't use the site" is questionable)</li>
        <li><strong>Specific</strong> — for a defined purpose, not a blanket "we may use your data for anything"</li>
        <li><strong>Informed</strong> — users must know what they're consenting to</li>
        <li><strong>Unambiguous</strong> — clear affirmative action (opt-in checkbox, not pre-ticked)</li>
        <li><strong>Revocable</strong> — users can withdraw consent at any time, as easily as they gave it</li>
      </ul>
      <div className="callout callout-blue">
        <p><strong>Developer implementation:</strong> Store consent records with timestamp, IP, consent version, and what the user agreed to. When your privacy policy changes significantly, you may need to re-obtain consent.</p>
      </div>

      <h2>Data Subject Rights You Must Support</h2>
      <p>PDPA grants eight rights to individuals. Your app must have mechanisms to handle these:</p>
      <table>
        <thead><tr><th>Right</th><th>What it means for your app</th></tr></thead>
        <tbody>
          <tr><td>Right to be informed</td><td>Privacy notice explaining what you collect and why — before collection</td></tr>
          <tr><td>Right of access</td><td>Users can request a copy of their personal data you hold</td></tr>
          <tr><td>Right to rectification</td><td>Users can request corrections to inaccurate data</td></tr>
          <tr><td>Right to erasure</td><td>"Right to be forgotten" — delete data when no longer needed or consent withdrawn</td></tr>
          <tr><td>Right to restriction</td><td>Users can request you stop processing (but keep) their data</td></tr>
          <tr><td>Right to data portability</td><td>Provide data in machine-readable format (JSON/CSV)</td></tr>
          <tr><td>Right to object</td><td>Users can object to processing based on legitimate interests</td></tr>
          <tr><td>Right not to be subject to automated decisions</td><td>Users can request human review of automated profiling/scoring decisions</td></tr>
        </tbody>
      </table>
      <p>
        You must respond to requests within <strong>30 days</strong>. Build an internal process (even a simple email form) for handling these requests before you launch.
      </p>

      <h2>Data Retention — Don't Keep Data Longer Than Needed</h2>
      <p>
        You must define and document retention periods for each type of data. Once the purpose is fulfilled, data must be deleted or anonymized.
      </p>
      <pre><code>{`// Example: Define retention in your system
const RETENTION_POLICY = {
  userAccounts: '3 years after last login or account deletion request',
  transactionRecords: '7 years (tax law requirement)',
  marketingPreferences: 'Until consent withdrawn',
  serverLogs: '90 days',
  supportTickets: '2 years after resolution',
  cookies: 'Per cookie purpose (session/persistent)',
}`}</code></pre>

      <h2>Technical Requirements for Developers</h2>
      <h3>Privacy by Design</h3>
      <ul>
        <li>Collect only what you need (data minimization)</li>
        <li>Use pseudonymization where possible</li>
        <li>Default to privacy-preserving settings</li>
        <li>Encrypt personal data at rest and in transit</li>
      </ul>

      <h3>Security Measures</h3>
      <ul>
        <li>HTTPS everywhere — no plain HTTP with personal data</li>
        <li>Encrypt database fields containing sensitive personal data</li>
        <li>Hash passwords with bcrypt, Argon2, or scrypt — never MD5/SHA1</li>
        <li>Implement access controls — staff should only access data they need</li>
        <li>Log data access for audit trails</li>
      </ul>

      <h3>Data Breach Notification</h3>
      <p>
        If a data breach occurs, you must notify the <strong>Personal Data Protection Committee (PDPC)</strong> within <strong>72 hours</strong> of becoming aware of the breach. If the breach poses high risk to individuals, notify affected users without delay.
      </p>

      <h3>Cookies and Tracking</h3>
      <pre><code>{`// Cookie consent must be granular
const cookieCategories = {
  necessary: true,          // No consent needed (session, security)
  analytics: false,         // Requires consent (Google Analytics)
  marketing: false,         // Requires consent (Facebook Pixel)
  preferences: false,       // Requires consent (language, theme)
}

// Store consent decision
localStorage.setItem('cookie_consent', JSON.stringify({
  given: true,
  timestamp: new Date().toISOString(),
  version: '2025-01',
  categories: cookieCategories,
}))`}</code></pre>

      <h2>Third-Party Processors</h2>
      <p>
        If you use third-party services that process personal data on your behalf (AWS, SendGrid, Stripe, Google Analytics), you must have a <strong>Data Processing Agreement (DPA)</strong> with them. Most major cloud providers offer these — check their compliance documentation.
      </p>

      <h2>Cross-Border Data Transfer</h2>
      <p>
        Transferring personal data outside Thailand requires that the destination country has "adequate protection standards," or you have appropriate safeguards (contractual clauses, binding corporate rules). Practically, if you host on AWS or GCP with data stored outside Thailand, check their data residency options and DPA terms.
      </p>

      <h2>Privacy Notice Requirements</h2>
      <p>Your privacy notice (policy) must include:</p>
      <ul>
        <li>What personal data you collect</li>
        <li>Purpose and lawful basis for each type of processing</li>
        <li>Retention periods</li>
        <li>Who you share data with (third parties, processors)</li>
        <li>Data subject rights and how to exercise them</li>
        <li>Contact details of the Data Controller and DPO (if applicable)</li>
        <li>Cross-border transfer information if relevant</li>
      </ul>

      <h2>Do You Need a Data Protection Officer (DPO)?</h2>
      <p>A DPO is required if your organization:</p>
      <ul>
        <li>Processes personal data on a large scale as a core activity</li>
        <li>Processes sensitive personal data regularly and systematically</li>
        <li>Is a public authority</li>
      </ul>
      <p>
        Most small apps and startups don't require a formal DPO, but should designate someone responsible for data protection.
      </p>

      <h2>Summary Checklist</h2>
      <ul>
        <li>✅ Privacy notice in place before data collection</li>
        <li>✅ Lawful basis documented for each processing activity</li>
        <li>✅ Consent mechanism with proper opt-in (not pre-ticked)</li>
        <li>✅ Cookie consent with granular categories</li>
        <li>✅ Process for handling data subject rights requests (30-day SLA)</li>
        <li>✅ Data retention policy defined and enforced</li>
        <li>✅ HTTPS + encryption in place</li>
        <li>✅ DPAs with all third-party processors</li>
        <li>✅ Breach notification procedure (72 hours to PDPC)</li>
        <li>✅ Staff trained on data handling basics</li>
      </ul>
    </>
  )
}
