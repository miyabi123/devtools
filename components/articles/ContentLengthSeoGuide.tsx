'use client'

export default function ContentLengthSeoGuide() {
  return (
    <article className="prose-article">
      <p>
        "How long should my blog post be?" is one of the most frequently asked questions in content
        marketing. The answer matters — but probably not in the way most guides suggest. This
        article cuts through the myths and focuses on what actually drives SEO performance.
      </p>

      <h2>Does Word Count Affect SEO Rankings?</h2>
      <p>
        Google has repeatedly stated that word count is not a ranking factor. A 300-word page that
        fully answers a query can outrank a 3,000-word page that rambles. What matters is{' '}
        <strong>content quality and relevance</strong>, not quantity.
      </p>
      <p>
        That said, longer content tends to rank better in practice — not because of word count, but
        because it correlates with depth, coverage of related topics, and more opportunities to
        naturally include relevant terms. Long content that answers follow-up questions keeps users
        engaged longer, which sends positive engagement signals.
      </p>
      <p>The nuance: longer is better only if every word earns its place.</p>

      <h2>Recommended Content Lengths by Type</h2>
      <table>
        <thead>
          <tr>
            <th>Content Type</th>
            <th>Recommended Length</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Product page</td>
            <td>300–500 words</td>
            <td>Focus on benefits and specs</td>
          </tr>
          <tr>
            <td>News / announcement</td>
            <td>300–600 words</td>
            <td>Freshness matters more than length</td>
          </tr>
          <tr>
            <td>Blog post (informational)</td>
            <td>1,200–2,000 words</td>
            <td>Cover the topic fully</td>
          </tr>
          <tr>
            <td>Pillar / guide article</td>
            <td>2,000–4,000 words</td>
            <td>Comprehensive reference</td>
          </tr>
          <tr>
            <td>Tool / landing page</td>
            <td>200–500 words</td>
            <td>FAQs and how-to add value</td>
          </tr>
          <tr>
            <td>FAQ page</td>
            <td>40–100 words per answer</td>
            <td>Concise answers win featured snippets</td>
          </tr>
        </tbody>
      </table>

      <h2>Meta Tag Character Limits</h2>
      <p>
        Character counts matter critically for SEO meta tags — these are displayed in search results
        and get truncated if too long.
      </p>
      <table>
        <thead>
          <tr>
            <th>Tag</th>
            <th>Recommended</th>
            <th>Max before truncation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Title tag</td>
            <td>50–60 characters</td>
            <td>~580 pixels (≈ 60 chars)</td>
          </tr>
          <tr>
            <td>Meta description</td>
            <td>120–160 characters</td>
            <td>~920 pixels (≈ 160 chars)</td>
          </tr>
          <tr>
            <td>URL slug</td>
            <td>3–5 words</td>
            <td>Under 75 characters total</td>
          </tr>
          <tr>
            <td>H1 heading</td>
            <td>20–70 characters</td>
            <td>No hard limit, but concise is better</td>
          </tr>
          <tr>
            <td>Image alt text</td>
            <td>Under 125 characters</td>
            <td>Screen readers cut off at ~125 chars</td>
          </tr>
        </tbody>
      </table>

      <h2>Social Media Character Limits</h2>
      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Post limit</th>
            <th>Optimal length</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>X (Twitter)</td>
            <td>280 characters</td>
            <td>71–100 characters</td>
          </tr>
          <tr>
            <td>LinkedIn</td>
            <td>3,000 characters</td>
            <td>150–300 characters (feed preview)</td>
          </tr>
          <tr>
            <td>Facebook</td>
            <td>63,206 characters</td>
            <td>40–80 characters for highest engagement</td>
          </tr>
          <tr>
            <td>Instagram caption</td>
            <td>2,200 characters</td>
            <td>138–150 characters (before "more")</td>
          </tr>
          <tr>
            <td>YouTube title</td>
            <td>100 characters</td>
            <td>Under 60 characters</td>
          </tr>
          <tr>
            <td>YouTube description</td>
            <td>5,000 characters</td>
            <td>First 100 characters are above the fold</td>
          </tr>
        </tbody>
      </table>

      <h2>Reading Time</h2>
      <p>
        The average adult reads at approximately 200–238 words per minute. Reading time estimates
        assume reading for comprehension (slower) rather than skimming (faster). Common conventions:
      </p>
      <ul>
        <li><strong>200 WPM</strong> — conservative (technical content, non-native readers)</li>
        <li><strong>238 WPM</strong> — Medium's algorithm</li>
        <li><strong>250 WPM</strong> — general adult average</li>
      </ul>
      <p>
        Displaying reading time reduces bounce rate — readers who know a post is 4 minutes are
        more likely to start and finish it than if they don't know what they're committing to.
      </p>

      <h2>Flesch Reading Ease</h2>
      <p>
        Readability scoring measures how easy text is to understand. The Flesch Reading Ease
        formula uses average sentence length and average syllables per word:
      </p>
      <table>
        <thead>
          <tr>
            <th>Score</th>
            <th>Difficulty</th>
            <th>Typical audience</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>90–100</td>
            <td>Very easy</td>
            <td>5th grade, everyday content</td>
          </tr>
          <tr>
            <td>70–80</td>
            <td>Easy</td>
            <td>6th–7th grade, plain language</td>
          </tr>
          <tr>
            <td>60–70</td>
            <td>Standard</td>
            <td>8th–9th grade, news articles</td>
          </tr>
          <tr>
            <td>30–50</td>
            <td>Difficult</td>
            <td>College level, technical content</td>
          </tr>
          <tr>
            <td>0–30</td>
            <td>Very difficult</td>
            <td>Academic papers, legal documents</td>
          </tr>
        </tbody>
      </table>
      <p>
        For developer documentation and technical blogs, a score of 40–60 is typical and
        appropriate. Aim for shorter sentences (under 25 words) and prefer common words over
        jargon where possible.
      </p>

      <h2>Quality Over Quantity — What Google Actually Rewards</h2>
      <p>Google's helpful content system evaluates:</p>
      <ul>
        <li>
          <strong>Original information</strong> — research, experience, analysis not found
          elsewhere.
        </li>
        <li>
          <strong>Satisfying the search intent</strong> — does the content answer what the user
          actually wanted to know?
        </li>
        <li>
          <strong>Expertise</strong> — does the content demonstrate real knowledge of the topic?
        </li>
        <li>
          <strong>No fluff</strong> — padding to hit a word count target is penalized, not
          rewarded.
        </li>
      </ul>
      <p>
        The practical advice: write until you've fully answered the question, then stop. Delete
        anything that doesn't serve the reader. A well-edited 800-word piece consistently
        outperforms an unedited 2,000-word piece on the same topic.
      </p>
    </article>
  )
}
