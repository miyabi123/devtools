'use client'

export default function ThaiStartupTechStack() {
  return (
    <article className="prose-freeutil">
      <p>
        การเลือก Tech Stack ที่ถูกต้องตั้งแต่ต้นช่วยประหยัดเวลาและเงินได้มาก บทความนี้แนะนำ Stack ที่เหมาะสำหรับ Startup และ SME ในไทย พิจารณาจากความเร็วในการพัฒนา ต้นทุน และชุมชนนักพัฒนาไทย
      </p>

      <h2>หลักการเลือก Tech Stack สำหรับ Startup</h2>
      <ul>
        <li><strong>เลือก Stack ที่ทีมรู้จักดีที่สุด</strong> — ไม่ใช่ Stack ที่ฮิตที่สุดหรือใหม่ที่สุด</li>
        <li><strong>Speed to market สำคัญกว่า Performance</strong> — ใน Phase แรก คุณต้องการ Validate Product ก่อน</li>
        <li><strong>เลือก Stack ที่หา Developer ในไทยได้ง่าย</strong> — ถ้าต้องขยายทีม</li>
        <li><strong>ต้นทุน Hosting ต้องเหมาะกับงบ</strong> — ระหว่าง 0-10,000 บาท/เดือน</li>
      </ul>

      <h2>Stack แนะนำ: MERN / Next.js</h2>
      <p>เหมาะที่สุดสำหรับ Web App และ SaaS ใน Stage แรก:</p>
      <table>
        <thead><tr><th>Layer</th><th>Technology</th><th>ทำไม?</th></tr></thead>
        <tbody>
          <tr><td>Frontend</td><td>Next.js (React)</td><td>SEO ดี, Full-stack ได้, Vercel ง่าย</td></tr>
          <tr><td>Backend</td><td>Node.js / Next.js API Routes</td><td>ภาษาเดียวทั้ง Front-Back</td></tr>
          <tr><td>Database</td><td>PostgreSQL (Supabase)</td><td>SQL มาตรฐาน, Auth built-in, มี Free tier</td></tr>
          <tr><td>ORM</td><td>Prisma</td><td>Type-safe, migration ง่าย</td></tr>
          <tr><td>Auth</td><td>NextAuth.js / Supabase Auth</td><td>OAuth Google/LINE รวดเร็ว</td></tr>
          <tr><td>Hosting</td><td>Vercel + Supabase</td><td>Free tier เพียงพอสำหรับ MVP</td></tr>
          <tr><td>File Storage</td><td>Cloudflare R2 / Supabase Storage</td><td>ถูกกว่า AWS S3 มาก</td></tr>
        </tbody>
      </table>

      <h2>Stack แนะนำ: Python (Django/FastAPI)</h2>
      <p>เหมาะถ้าทีมเป็น Python หรือมี Data Science / AI:</p>
      <table>
        <thead><tr><th>Layer</th><th>Technology</th></tr></thead>
        <tbody>
          <tr><td>API Backend</td><td>FastAPI (modern) หรือ Django REST (mature)</td></tr>
          <tr><td>Frontend</td><td>React / Vue.js / HTMX</td></tr>
          <tr><td>Database</td><td>PostgreSQL</td></tr>
          <tr><td>Hosting</td><td>Railway.app หรือ Render.com (ราคาดี)</td></tr>
        </tbody>
      </table>

      <h2>ต้นทุน Hosting โดยประมาณ</h2>
      <table>
        <thead><tr><th>Stage</th><th>Stack</th><th>ต้นทุน/เดือน</th></tr></thead>
        <tbody>
          <tr><td>MVP / Prototype</td><td>Vercel Free + Supabase Free</td><td>฿0</td></tr>
          <tr><td>Early users (&lt;1K MAU)</td><td>Vercel Pro + Supabase Pro</td><td>฿700-1,400</td></tr>
          <tr><td>Growing (&lt;10K MAU)</td><td>Vercel + Supabase + Cloudflare</td><td>฿2,000-5,000</td></tr>
          <tr><td>Scale (10K+ MAU)</td><td>AWS / GCP + RDS</td><td>฿10,000+</td></tr>
        </tbody>
      </table>

      <h2>สิ่งที่ไม่ควรทำ</h2>
      <ul>
        <li><strong>Microservices ตั้งแต่วันแรก</strong> — Monolith ก่อน แยกเมื่อจำเป็น</li>
        <li><strong>Over-engineering</strong> — ไม่ต้องมี Redis, Kafka, Kubernetes ตั้งแต่ต้น</li>
        <li><strong>เลือก Stack เพราะฮิปมากที่สุด</strong> — เลือกเพราะทีมถนัด</li>
        <li><strong>Lock-in กับ AWS อย่างเดียว</strong> — ใช้ Managed Services ที่ย้ายได้ง่าย</li>
      </ul>

      <h2>LINE API สำหรับตลาดไทย</h2>
      <p>LINE มีผู้ใช้ในไทยสูงมาก หากทำสินค้าสำหรับ B2C ไทย ควรพิจารณา:</p>
      <ul>
        <li><strong>LINE Login</strong> — ผู้ใช้ไทยคุ้นเคยกว่า Google Login</li>
        <li><strong>LINE OA (Official Account)</strong> — push notification ผ่าน LINE Chatbot</li>
        <li><strong>LINE Pay</strong> — payment สำหรับ B2C ไทย</li>
        <li><strong>LINE LIFF</strong> — Mini App ใน LINE</li>
      </ul>
    </article>
  )
}
