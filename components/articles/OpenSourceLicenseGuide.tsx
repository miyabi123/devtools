'use client'

export default function OpenSourceLicenseGuide() {
  return (
    <>
      <h2>Why Licenses Matter</h2>
      <p>
        Copyright law grants the author of code exclusive rights by default. Without a license, no one can legally copy, modify, or distribute your code — even if it's publicly visible on GitHub. A license grants users specific permissions and defines what obligations come with those permissions.
      </p>
      <p>
        When you use a library without checking its license, you may be unknowingly violating copyright. When you publish code without adding a license, you're not making it "free to use" — you're making it legally ambiguous.
      </p>

      <h2>The Three Categories of Open Source Licenses</h2>
      <table>
        <thead><tr><th>Category</th><th>Key Requirement</th><th>Examples</th></tr></thead>
        <tbody>
          <tr><td><strong>Permissive</strong></td><td>Keep copyright notice. Do almost anything else.</td><td>MIT, Apache 2.0, BSD</td></tr>
          <tr><td><strong>Weak Copyleft</strong></td><td>Modifications to the library must be open-sourced, but you can use it in proprietary software.</td><td>LGPL, MPL 2.0</td></tr>
          <tr><td><strong>Strong Copyleft</strong></td><td>Any software using this code must also be open-sourced under the same license.</td><td>GPL v2, GPL v3, AGPL</td></tr>
        </tbody>
      </table>

      <h2>MIT License</h2>
      <p>
        The most popular open source license. Short, simple, and permissive.
      </p>
      <p><strong>You can:</strong> Use commercially, modify, distribute, sublicense, use privately</p>
      <p><strong>You must:</strong> Include the copyright notice and license text in any distribution</p>
      <p><strong>You cannot:</strong> Hold the author liable</p>
      <p><strong>Used by:</strong> React, Vue, Rails, jQuery, Bootstrap, Next.js, most npm packages</p>
      <div className="callout callout-green">
        <p><strong>In practice:</strong> You can use MIT-licensed libraries in proprietary commercial software. You don't need to open-source your code. You just need to include the MIT license file (usually in a LICENSES directory or NOTICE file).</p>
      </div>

      <h2>Apache License 2.0</h2>
      <p>
        Similar to MIT but adds explicit patent grants and has stronger trademark protections.
      </p>
      <p><strong>You can:</strong> Use commercially, modify, distribute, sublicense, use privately</p>
      <p><strong>You must:</strong> Include license and copyright notice; state changes made to files; include NOTICE file if present</p>
      <p><strong>You cannot:</strong> Use contributor trademarks; hold authors liable</p>
      <p><strong>Key difference from MIT:</strong> Contributors explicitly grant you a patent license. If a contributor has a patent covering the code, they can't sue you for using it. MIT has no such protection.</p>
      <p><strong>Used by:</strong> Kubernetes, Hadoop, Kafka, TensorFlow, Android (AOSP), many Apache Software Foundation projects</p>
      <div className="callout callout-blue">
        <p><strong>MIT vs Apache 2.0:</strong> For most projects, they're functionally equivalent. Choose Apache 2.0 if patent protection matters (e.g., in enterprise or biotech contexts). MIT is simpler and more widely understood.</p>
      </div>

      <h2>BSD Licenses</h2>
      <p>
        Several variants exist. All are permissive like MIT.
      </p>
      <ul>
        <li><strong>BSD 2-Clause ("Simplified BSD")</strong> — nearly identical to MIT</li>
        <li><strong>BSD 3-Clause ("New BSD")</strong> — adds a clause prohibiting use of project name in endorsements without permission</li>
        <li><strong>BSD 4-Clause</strong> — deprecated; had an "advertising clause" that caused GPL incompatibility</li>
      </ul>
      <p><strong>Used by:</strong> FreeBSD, many older Unix utilities, some Python packages</p>

      <h2>GNU GPL (General Public License)</h2>
      <p>
        The original strong copyleft license by the Free Software Foundation. The defining concept is <strong>"copyleft"</strong>: any software that incorporates GPL code must itself be GPL-licensed.
      </p>
      <p><strong>You can:</strong> Use, modify, distribute</p>
      <p><strong>You must:</strong> Release source code of your modified version; use GPL for the entire combined work; include license text</p>
      <p><strong>You cannot:</strong> Use in proprietary software (the entire project becomes GPL)</p>
      <p><strong>Used by:</strong> Linux kernel (GPLv2), Git, GCC, WordPress (plugins), VLC</p>

      <h3>GPL v2 vs v3</h3>
      <table>
        <thead><tr><th>Aspect</th><th>GPL v2</th><th>GPL v3</th></tr></thead>
        <tbody>
          <tr><td>Tivoization</td><td>Allowed</td><td>Prohibited — hardware must allow modified software to run</td></tr>
          <tr><td>Patent retaliation</td><td>No explicit clause</td><td>Explicit patent grant and retaliation clause</td></tr>
          <tr><td>Compatibility with Apache 2.0</td><td>Incompatible</td><td>Compatible</td></tr>
          <tr><td>Adoption</td><td>Linux kernel uses v2-only</td><td>Most new GPL projects use v3</td></tr>
        </tbody>
      </table>
      <div className="callout">
        <p><strong>Commercial implications:</strong> If you use GPL v2/v3 code in your commercial product, your entire product must be open-sourced under GPL. This is why many companies pay for commercial licenses from projects like MySQL, Qt, and MongoDB.</p>
      </div>

      <h2>LGPL (Lesser GPL)</h2>
      <p>
        A "weaker" copyleft license that allows proprietary software to <em>use</em> the library without requiring the entire project to be open-sourced. However, modifications to the library itself must remain LGPL.
      </p>
      <p><strong>Used by:</strong> Qt (LGPL edition), GNU libc, FFmpeg (portions)</p>
      <p><strong>Typical use:</strong> Libraries designed to be usable in proprietary software. If you modify the LGPL library, you must release your modifications. If you just use it via standard interfaces, your application can remain proprietary.</p>

      <h2>AGPL (Affero GPL)</h2>
      <p>
        Like GPL v3 but closes the "SaaS loophole": if you run AGPL software as a service over a network, you must make the source code available to users of that service. GPL only triggers when distributing software, not when running it as a service.
      </p>
      <p><strong>Used by:</strong> MongoDB (SSPL, similar), Nextcloud, Mastodon, many "open core" SaaS companies</p>
      <p><strong>Implication:</strong> If you build a SaaS product using AGPL code, your service's source must be open. This is how companies like MongoDB protect against cloud providers building competing services.</p>

      <h2>Mozilla Public License 2.0 (MPL)</h2>
      <p>
        File-level weak copyleft. MPL-licensed files must remain MPL, but you can combine them with proprietary code in the same project as long as the files stay separate.
      </p>
      <p><strong>Used by:</strong> Firefox, Thunderbird, LibreOffice</p>

      <h2>License Compatibility</h2>
      <p>
        When combining code with different licenses, they must be compatible. Key incompatibilities:
      </p>
      <ul>
        <li>GPL v2 + Apache 2.0 — <strong>incompatible</strong> (patent clause conflicts)</li>
        <li>GPL v3 + Apache 2.0 — compatible</li>
        <li>GPL + MIT — compatible (MIT becomes GPL when combined)</li>
        <li>GPL v2 + GPL v3 — incompatible (v2-only code can't be relicensed to v3)</li>
      </ul>

      <h2>Choosing a License for Your Project</h2>
      <table>
        <thead><tr><th>Goal</th><th>Recommended License</th></tr></thead>
        <tbody>
          <tr><td>Maximum adoption, businesses and individuals can use freely</td><td>MIT or Apache 2.0</td></tr>
          <tr><td>Want patent protection for contributors</td><td>Apache 2.0</td></tr>
          <tr><td>Want contributions to stay open source, but allow commercial use</td><td>GPL v3</td></tr>
          <tr><td>Library that can be used in proprietary software, modifications stay open</td><td>LGPL v2.1 or MPL 2.0</td></tr>
          <tr><td>Protect against SaaS providers forking without contributing back</td><td>AGPL v3</td></tr>
          <tr><td>No one can use this code for anything</td><td>No license (default copyright)</td></tr>
        </tbody>
      </table>
      <p>
        Use <strong>choosealicense.com</strong> (by GitHub) to help choose. Once you decide, add a <code>LICENSE</code> file to the root of your repository — GitHub detects it automatically.
      </p>

      <h2>Dual Licensing</h2>
      <p>
        Many successful open source companies use dual licensing: release under AGPL or GPL for free/open use, and offer a commercial license to businesses that need proprietary integration. Examples: MySQL, Qt, MongoDB, Redis (SSPL), Elasticsearch.
      </p>

      <h2>What "Open Source" Does NOT Mean</h2>
      <ul>
        <li>Visible source code ≠ open source (you need an OSI-approved license)</li>
        <li>Open source ≠ free to use commercially (check the license)</li>
        <li>Open source ≠ no copyright (author retains copyright)</li>
        <li>No license ≠ public domain (all rights reserved by default)</li>
      </ul>

      <h2>Summary</h2>
      <p>
        MIT and Apache 2.0 are permissive — use in commercial projects freely, just include the copyright notice. GPL is strong copyleft — using GPL code requires open-sourcing your project. LGPL allows library use in proprietary software. AGPL extends GPL to SaaS. When choosing a license for your project, MIT is the simplest for maximum adoption; Apache 2.0 if patent protection matters; GPL if you want derivative works to stay open.
      </p>
    </>
  )
}
