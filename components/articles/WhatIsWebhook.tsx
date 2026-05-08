'use client'

export default function WhatIsWebhook() {
  return (
    <article className="prose-freeutil">
      <p>A webhook is a way for one application to automatically notify another when something happens. Instead of repeatedly asking "did anything change?" (polling), the source pushes data to you the moment an event occurs.</p>

      <h2>Webhook vs Polling vs API</h2>
      <table>
        <thead><tr><th></th><th>Polling</th><th>API</th><th>Webhook</th></tr></thead>
        <tbody>
          <tr><td>Direction</td><td>You ask repeatedly</td><td>You ask once</td><td>They push to you</td></tr>
          <tr><td>Timing</td><td>Delayed (interval)</td><td>On demand</td><td>Real-time</td></tr>
          <tr><td>Efficiency</td><td>Wasteful</td><td>Efficient</td><td>Most efficient</td></tr>
          <tr><td>Complexity</td><td>Simple</td><td>Simple</td><td>Need public endpoint</td></tr>
        </tbody>
      </table>

      <h2>Real-world Webhook Examples</h2>
      <ul>
        <li><strong>Stripe</strong> → sends webhook to your server when payment succeeds, fails, or refunds</li>
        <li><strong>GitHub</strong> → sends webhook when code is pushed, PR is opened, or issue is created (triggers CI/CD)</li>
        <li><strong>Slack</strong> → sends webhook when someone posts a message (for bots)</li>
        <li><strong>Shopify</strong> → sends webhook when order is placed, fulfilled, or cancelled</li>
      </ul>

      <h2>Receiving a Webhook</h2>
      <p>You need a publicly accessible HTTP endpoint on your server. The source sends a POST request to your URL with a JSON payload:</p>
      <pre><code>{`// Express.js webhook receiver
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature']

  // 1. Verify the webhook signature
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send('Webhook signature verification failed')
  }

  // 2. Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    console.log('Payment succeeded:', paymentIntent.amount)
    // → Update order status in database
  }

  // 3. Return 200 quickly (webhook sender may retry if no response)
  res.json({ received: true })
})`}</code></pre>

      <h2>Webhook Security</h2>
      <p>Anyone can POST to your webhook URL — always verify the request came from the legitimate source:</p>
      <ul>
        <li><strong>HMAC signature</strong> — most services (Stripe, GitHub) include an HMAC-SHA256 signature in a header. Compute your own signature using the shared secret and compare.</li>
        <li><strong>Secret token</strong> — include a secret in the URL or header that only the source knows.</li>
        <li><strong>IP allowlist</strong> — only accept requests from the source's known IP ranges (less flexible).</li>
      </ul>

      <h2>Testing Webhooks Locally</h2>
      <pre><code>{`# Use ngrok to expose localhost to the internet
ngrok http 3000
# → Forwarding: https://abc123.ngrok.io → localhost:3000

# Set webhook URL in Stripe/GitHub/etc to:
# https://abc123.ngrok.io/webhooks/stripe

# Or use Stripe CLI for local testing
stripe listen --forward-to localhost:3000/webhooks/stripe
stripe trigger payment_intent.succeeded`}</code></pre>

      <h2>Handling Failures & Retries</h2>
      <p>Webhook delivery can fail if your server is down or returns a non-2xx status. Most services retry failed webhooks on a schedule (e.g. Stripe retries over 3 days). Design your handler to be idempotent — receiving the same event twice should produce the same result. Use the event ID to detect and skip duplicates.</p>
    </article>
  )
}
