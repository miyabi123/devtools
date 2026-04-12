'use client'

import { useState, useMemo } from 'react'

// ── อัตราภาษีแบบขั้นบันได ปี 2568 ──────────────────────────────
const TAX_BRACKETS = [
  { min: 0,        max: 150000,   rate: 0   },
  { min: 150000,   max: 300000,   rate: 0.05 },
  { min: 300000,   max: 500000,   rate: 0.10 },
  { min: 500000,   max: 750000,   rate: 0.15 },
  { min: 750000,   max: 1000000,  rate: 0.20 },
  { min: 1000000,  max: 2000000,  rate: 0.25 },
  { min: 2000000,  max: 5000000,  rate: 0.30 },
  { min: 5000000,  max: Infinity, rate: 0.35 },
]

function calcTax(netIncome: number): number {
  if (netIncome <= 0) return 0
  let tax = 0
  for (const b of TAX_BRACKETS) {
    if (netIncome <= b.min) break
    const taxable = Math.min(netIncome, b.max) - b.min
    tax += taxable * b.rate
  }
  return Math.max(0, tax)
}

function fmt(n: number): string {
  return n.toLocaleString('th-TH', { maximumFractionDigits: 0 })
}

function numInput(
  value: number,
  onChange: (v: number) => void,
  placeholder = '0',
  max?: number
) {
  return (
    <input
      type="number"
      min={0}
      max={max}
      placeholder={placeholder}
      value={value === 0 ? '' : value}
      onChange={e => {
        const v = Math.max(0, Number(e.target.value) || 0)
        onChange(max ? Math.min(v, max) : v)
      }}
      style={{
        width: '100%', padding: '8px 10px', border: '0.5px solid #c8c6c0',
        borderRadius: 6, outline: 'none', fontFamily: 'var(--font-mono)',
        fontSize: 13, color: '#1a1917', background: '#ffffff',
      }}
    />
  )
}

// ── Types ───────────────────────────────────────────────────────
interface Deductions {
  // ส่วนตัวและครอบครัว
  self: number          // ส่วนตัว 60,000 (auto)
  spouse: boolean       // คู่สมรส 60,000
  children: number      // บุตร (คนที่ 1 = 30,000, คนที่ 2+ = 60,000)
  childrenPost62: number // บุตรคนที่ 2+ ที่เกิดตั้งแต่ปี 2561
  parents: number       // บิดามารดา คนละ 30,000 (สูงสุด 4 คน = 120,000)
  disabled: number      // ผู้พิการ/ทุพพลภาพ คนละ 60,000
  prenatal: number      // ฝากครรภ์และคลอดบุตร ไม่เกิน 60,000

  // ประกันและการลงทุน
  socialSecurity: number   // ประกันสังคม ไม่เกิน 9,000
  lifeInsurance: number    // ประกันชีวิต ไม่เกิน 100,000
  healthInsurance: number  // ประกันสุขภาพตนเอง ไม่เกิน 25,000
  parentHealthInsurance: number // ประกันสุขภาพบิดามารดา ไม่เกิน 15,000
  rmf: number              // RMF ไม่เกิน 30% เงินได้ และไม่เกิน 500,000
  ssf: number              // SSF ไม่เกิน 30% เงินได้ และไม่เกิน 200,000
  thaiEsg: number          // Thai ESG ไม่เกิน 30% เงินได้ และไม่เกิน 300,000
  govPension: number       // กบข. ไม่เกิน 30% เงินได้
  providentFund: number    // กองทุนสำรองเลี้ยงชีพ ไม่เกิน 10,000 + 500,000
  nsf: number              // กอช. ไม่เกิน 30,000

  // กระตุ้นเศรษฐกิจ
  easyEReceipt: number     // Easy E-Receipt 2568 ไม่เกิน 50,000
  homeLoan: number         // ดอกเบี้ยบ้าน ไม่เกิน 100,000
  newHouse: number         // ค่าสร้างบ้านใหม่ 2567-2568 ไม่เกิน 100,000
  tourMain: number         // เที่ยวเมืองหลัก ไม่เกิน 20,000 (ต.ค.-ธ.ค.68)
  tourSecondary: number    // เที่ยวเมืองรอง ไม่เกิน 20,000

  // เงินบริจาค
  donationEducation: number // บริจาคเพื่อการศึกษา 2 เท่า ไม่เกิน 10% เงินได้
  donationGeneral: number   // บริจาคทั่วไป ไม่เกิน 10% เงินได้
  donationPolitical: number // บริจาคพรรคการเมือง ไม่เกิน 10,000
}

const defaultDeductions: Deductions = {
  self: 60000, spouse: false, children: 0, childrenPost62: 0,
  parents: 0, disabled: 0, prenatal: 0,
  socialSecurity: 9000, lifeInsurance: 0, healthInsurance: 0,
  parentHealthInsurance: 0, rmf: 0, ssf: 0, thaiEsg: 0,
  govPension: 0, providentFund: 0, nsf: 0,
  easyEReceipt: 0, homeLoan: 0, newHouse: 0, tourMain: 0, tourSecondary: 0,
  donationEducation: 0, donationGeneral: 0, donationPolitical: 0,
}

const SECTIONS = ['รายได้', 'ส่วนตัว', 'ประกัน/ลงทุน', 'กระตุ้นเศรษฐกิจ', 'บริจาค', 'ผลลัพธ์']

export default function ThaiTaxCalculator() {
  const [step, setStep] = useState(0)
  const [incomeType, setIncomeType] = useState<'40-1' | '40-2' | '40-8'>('40-1')
  const [income, setIncome] = useState(0)
  const [d, setD] = useState<Deductions>(defaultDeductions)

  const set = (key: keyof Deductions) => (v: number | boolean) =>
    setD(prev => ({ ...prev, [key]: v }))

  // คำนวณค่าใช้จ่าย
  const expense = useMemo(() => {
    if (incomeType === '40-1') return Math.min(income * 0.5, 100000)
    if (incomeType === '40-2') return Math.min(income * 0.5, 100000)
    return Math.min(income * 0.6, 600000)
  }, [income, incomeType])

  const incomeAfterExpense = Math.max(0, income - expense)

  // คำนวณค่าลดหย่อนทั้งหมด
  const deductionTotal = useMemo(() => {
    const cap = (v: number, max: number) => Math.min(v, max)
    const pct = (v: number, pct: number) => Math.min(v, income * pct)

    let total = 0
    // ส่วนตัวและครอบครัว
    total += 60000 // ส่วนตัว
    if (d.spouse) total += 60000
    total += d.children * 30000 + d.childrenPost62 * 30000 // บุตรคนที่ 2+ เพิ่ม 30,000
    total += cap(d.parents, 4) * 30000
    total += d.disabled * 60000
    total += cap(d.prenatal, 60000)

    // ประกันและลงทุน
    total += cap(d.socialSecurity, 9000)
    const lifeHealth = cap(d.lifeInsurance, 100000) + cap(d.healthInsurance, 25000)
    total += Math.min(lifeHealth, 100000 + 25000)
    total += cap(d.parentHealthInsurance, 15000)

    // กองทุนรวม — ต้องไม่เกิน 500,000 รวมกัน
    const rmfCap = Math.min(pct(d.rmf, 0.30), 500000)
    const ssfCap = Math.min(pct(d.ssf, 0.30), 200000)
    const thaiEsgCap = Math.min(pct(d.thaiEsg, 0.30), 300000)
    const fundTotal = rmfCap + ssfCap + thaiEsgCap
    total += Math.min(fundTotal, 500000)

    total += Math.min(pct(d.govPension, 0.30), 500000)
    total += Math.min(cap(d.providentFund, 500000), pct(d.providentFund, 0.15))
    total += cap(d.nsf, 30000)

    // กระตุ้นเศรษฐกิจ
    total += cap(d.easyEReceipt, 50000)
    total += cap(d.homeLoan, 100000)
    total += cap(d.newHouse, 100000)
    total += cap(d.tourMain, 20000)
    total += cap(d.tourSecondary, 20000)

    // บริจาค
    const afterDeduct = Math.max(0, incomeAfterExpense - total)
    total += Math.min(d.donationEducation * 2, afterDeduct * 0.10)
    total += Math.min(d.donationGeneral, afterDeduct * 0.10)
    total += cap(d.donationPolitical, 10000)

    return Math.round(total)
  }, [d, income, incomeAfterExpense])

  const netIncome = Math.max(0, incomeAfterExpense - deductionTotal)
  const tax = calcTax(netIncome)
  const effectiveRate = income > 0 ? (tax / income) * 100 : 0

  // ── UI helpers ────────────────────────────────────────────────
  const Row = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '0.5px solid #e8e6e0' }}>
      <div>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#1a1917' }}>{label}</span>
        {sub && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', marginLeft: 6 }}>{sub}</span>}
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917' }}>{value}</span>
    </div>
  )

  const Field = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917' }}>{label}</label>
        {sub && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>{sub}</span>}
      </div>
      {children}
    </div>
  )

  const navBtn = (label: string, target: number) => (
    <button onClick={() => setStep(target)} style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, padding: '8px 16px',
      background: target > step ? '#1a1917' : '#f8f7f4',
      color: target > step ? '#f8f7f4' : '#6b6960',
      border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer',
    }}>{label}</button>
  )

  return (
    <div className="space-y-4">
      {/* Step tabs */}
      <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 2 }}>
        {SECTIONS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 10px', whiteSpace: 'nowrap',
            background: step === i ? '#1a1917' : '#ffffff',
            color: step === i ? '#f8f7f4' : '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}>{i + 1}. {s}</button>
        ))}
      </div>

      {/* Step 0 — รายได้ */}
      {step === 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845', margin: 0 }}>ขั้นตอนที่ 1 — รายได้ต่อปี</p>
          </div>
          <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="ประเภทเงินได้">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { val: '40-1', label: 'มาตรา 40(1) — เงินเดือน ค่าจ้าง', sub: 'หักค่าใช้จ่าย 50% สูงสุด 100,000 บาท' },
                  { val: '40-2', label: 'มาตรา 40(2) — ฟรีแลนซ์ รับจ้าง', sub: 'หักค่าใช้จ่าย 50% สูงสุด 100,000 บาท' },
                  { val: '40-8', label: 'มาตรา 40(8) — ธุรกิจ พาณิชย์', sub: 'หักค่าใช้จ่ายได้ 60% สูงสุด 600,000 บาท' },
                ].map(o => (
                  <label key={o.val} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
                    <input type="radio" value={o.val} checked={incomeType === o.val}
                      onChange={() => setIncomeType(o.val as '40-1' | '40-2' | '40-8')}
                      style={{ marginTop: 2 }} />
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#1a1917', margin: 0 }}>{o.label}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '2px 0 0' }}>{o.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="รายได้รวมต่อปี (บาท)" sub="ก่อนหักค่าใช้จ่ายและลดหย่อน">
              {numInput(income, setIncome, 'เช่น 600000')}
            </Field>
            {income > 0 && (
              <div style={{ background: '#eeedfe', border: '0.5px solid #c8c6c0', borderRadius: 6, padding: '10px 14px' }}>
                <Row label="รายได้รวม" value={`${fmt(income)} บาท`} />
                <Row label="หักค่าใช้จ่าย" value={`${fmt(expense)} บาท`} sub={incomeType === '40-8' ? '60%' : '50%'} />
                <Row label="คงเหลือหลังหักค่าใช้จ่าย" value={`${fmt(incomeAfterExpense)} บาท`} />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {navBtn('ต่อไป → ค่าลดหย่อนส่วนตัว', 1)}
            </div>
          </div>
        </div>
      )}

      {/* Step 1 — ส่วนตัวและครอบครัว */}
      {step === 1 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845', margin: 0 }}>ขั้นตอนที่ 2 — ค่าลดหย่อนส่วนตัวและครอบครัว</p>
          </div>
          <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#e1f5ee', borderRadius: 6, padding: '10px 14px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#085041', margin: 0 }}>✓ ค่าลดหย่อนส่วนตัว 60,000 บาท — ได้อัตโนมัติทุกคน</p>
            </div>
            <Field label="คู่สมรส (ไม่มีรายได้)">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={d.spouse} onChange={e => setD(p => ({ ...p, spouse: e.target.checked }))} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#1a1917' }}>มีคู่สมรสที่ไม่มีรายได้ — ลดหย่อน 60,000 บาท</span>
              </label>
            </Field>
            <Field label="จำนวนบุตร (คนที่ 1)" sub="คนละ 30,000 บาท">
              {numInput(d.children, set('children'), '0', 20)}
            </Field>
            <Field label="บุตรคนที่ 2 ขึ้นไป เกิดตั้งแต่ปี 2561" sub="เพิ่มอีกคนละ 30,000 บาท">
              {numInput(d.childrenPost62, set('childrenPost62'), '0', 20)}
            </Field>
            <Field label="จำนวนบิดามารดา (อายุ 60+ รายได้ไม่เกิน 30,000/ปี)" sub="คนละ 30,000 บาท (สูงสุด 4 คน)">
              {numInput(d.parents, set('parents'), '0', 4)}
            </Field>
            <Field label="ผู้พิการ/ทุพพลภาพที่อุปการะ" sub="คนละ 60,000 บาท">
              {numInput(d.disabled, set('disabled'), '0', 10)}
            </Field>
            <Field label="ค่าฝากครรภ์และคลอดบุตร" sub="ตามจ่ายจริง ไม่เกิน 60,000 บาท/ครรภ์">
              {numInput(d.prenatal, set('prenatal'), '0', 60000)}
            </Field>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {navBtn('← กลับ', 0)}
              {navBtn('ต่อไป → ประกัน/ลงทุน', 2)}
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — ประกันและการลงทุน */}
      {step === 2 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845', margin: 0 }}>ขั้นตอนที่ 3 — ค่าลดหย่อนประกันและการลงทุน</p>
          </div>
          <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="เงินสมทบประกันสังคม" sub="ไม่เกิน 9,000 บาท">
              {numInput(d.socialSecurity, set('socialSecurity'), '9000', 9000)}
            </Field>
            <Field label="เบี้ยประกันชีวิต/สะสมทรัพย์" sub="ไม่เกิน 100,000 บาท">
              {numInput(d.lifeInsurance, set('lifeInsurance'), '0', 100000)}
            </Field>
            <Field label="เบี้ยประกันสุขภาพตนเอง" sub="ไม่เกิน 25,000 บาท (รวมกับประกันชีวิตไม่เกิน 100,000)">
              {numInput(d.healthInsurance, set('healthInsurance'), '0', 25000)}
            </Field>
            <Field label="เบี้ยประกันสุขภาพบิดามารดา" sub="ไม่เกิน 15,000 บาท">
              {numInput(d.parentHealthInsurance, set('parentHealthInsurance'), '0', 15000)}
            </Field>
            <Field label="กองทุน RMF" sub="ไม่เกิน 30% ของเงินได้ และไม่เกิน 500,000 บาท">
              {numInput(d.rmf, set('rmf'), '0')}
            </Field>
            <Field label="กองทุน SSF" sub="ไม่เกิน 30% ของเงินได้ และไม่เกิน 200,000 บาท">
              {numInput(d.ssf, set('ssf'), '0')}
            </Field>
            <Field label="กองทุน Thai ESG" sub="ไม่เกิน 30% ของเงินได้ และไม่เกิน 300,000 บาท (แยกจาก RMF/SSF)">
              {numInput(d.thaiEsg, set('thaiEsg'), '0')}
            </Field>
            <Field label="กบข. / กองทุนสงเคราะห์ครูเอกชน" sub="ไม่เกิน 30% ของเงินได้">
              {numInput(d.govPension, set('govPension'), '0')}
            </Field>
            <Field label="กองทุนสำรองเลี้ยงชีพ (PVD)" sub="ไม่เกิน 15% ของเงินได้ และไม่เกิน 500,000 บาท">
              {numInput(d.providentFund, set('providentFund'), '0')}
            </Field>
            <Field label="กองทุนการออมแห่งชาติ (กอช.)" sub="ไม่เกิน 30,000 บาท">
              {numInput(d.nsf, set('nsf'), '0', 30000)}
            </Field>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {navBtn('← กลับ', 1)}
              {navBtn('ต่อไป → กระตุ้นเศรษฐกิจ', 3)}
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — กระตุ้นเศรษฐกิจ */}
      {step === 3 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845', margin: 0 }}>ขั้นตอนที่ 4 — ค่าลดหย่อนกระตุ้นเศรษฐกิจ 2568</p>
          </div>
          <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Easy E-Receipt 2.0 (16 ม.ค. - 28 ก.พ. 2568)" sub="ไม่เกิน 50,000 บาท">
              {numInput(d.easyEReceipt, set('easyEReceipt'), '0', 50000)}
            </Field>
            <Field label="ดอกเบี้ยกู้ยืมเพื่อที่อยู่อาศัย" sub="ไม่เกิน 100,000 บาท">
              {numInput(d.homeLoan, set('homeLoan'), '0', 100000)}
            </Field>
            <Field label="ค่าสร้างบ้านใหม่ 2567-2568" sub="ทุก 1 ล้าน ลด 10,000 บาท สูงสุด 100,000 บาท">
              {numInput(d.newHouse, set('newHouse'), '0', 100000)}
            </Field>
            <Field label="เที่ยวเมืองหลัก (29 ต.ค. - 15 ธ.ค. 2568)" sub="ไม่เกิน 20,000 บาท">
              {numInput(d.tourMain, set('tourMain'), '0', 20000)}
            </Field>
            <Field label="เที่ยวเมืองรอง 55 จังหวัด (29 ต.ค. - 15 ธ.ค. 2568)" sub="ไม่เกิน 20,000 บาท">
              {numInput(d.tourSecondary, set('tourSecondary'), '0', 20000)}
            </Field>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {navBtn('← กลับ', 2)}
              {navBtn('ต่อไป → บริจาค', 4)}
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — เงินบริจาค */}
      {step === 4 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845', margin: 0 }}>ขั้นตอนที่ 5 — เงินบริจาค</p>
          </div>
          <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="บริจาคเพื่อการศึกษา/กีฬา/สาธารณประโยชน์" sub="ลด 2 เท่า ไม่เกิน 10% ของเงินได้หลังลดหย่อน">
              {numInput(d.donationEducation, set('donationEducation'), '0')}
            </Field>
            <Field label="บริจาคทั่วไป (วัด มูลนิธิ สาธารณกุศล)" sub="ไม่เกิน 10% ของเงินได้หลังลดหย่อน">
              {numInput(d.donationGeneral, set('donationGeneral'), '0')}
            </Field>
            <Field label="บริจาคพรรคการเมือง" sub="ไม่เกิน 10,000 บาท">
              {numInput(d.donationPolitical, set('donationPolitical'), '0', 10000)}
            </Field>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {navBtn('← กลับ', 3)}
              {navBtn('ดูผลลัพธ์ →', 5)}
            </div>
          </div>
        </div>
      )}

      {/* Step 5 — ผลลัพธ์ */}
      {step === 5 && (
        <div className="space-y-3">
          {/* Summary card */}
          <div style={{
            background: tax === 0 ? '#e1f5ee' : '#eeedfe',
            border: `1px solid ${tax === 0 ? '#1D9E75' : '#8b7fd4'}`,
            borderRadius: 10, padding: '16px',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 4px' }}>ภาษีที่ต้องชำระ (ปี 2568)</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: tax === 0 ? '#085041' : '#3c3489', margin: 0 }}>
              {fmt(tax)} <span style={{ fontSize: 16, fontWeight: 400 }}>บาท</span>
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', margin: '4px 0 0' }}>
              อัตราภาษีที่แท้จริง {effectiveRate.toFixed(2)}% ของรายได้รวม
            </p>
          </div>

          {/* Breakdown */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '14px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 10px' }}>รายละเอียดการคำนวณ</p>
            <Row label="รายได้รวมต่อปี" value={`${fmt(income)} บาท`} />
            <Row label="หักค่าใช้จ่าย" value={`${fmt(expense)} บาท`} />
            <Row label="คงเหลือหลังหักค่าใช้จ่าย" value={`${fmt(incomeAfterExpense)} บาท`} />
            <Row label="หักค่าลดหย่อนรวม" value={`${fmt(deductionTotal)} บาท`} />
            <div style={{ borderTop: '1.5px solid #1a1917', marginTop: 6, paddingTop: 6 }}>
              <Row label="เงินได้สุทธิ" value={`${fmt(netIncome)} บาท`} />
            </div>
          </div>

          {/* Tax brackets */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '14px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 10px' }}>ภาษีแต่ละขั้น</p>
            {TAX_BRACKETS.filter(b => b.rate > 0).map(b => {
              const taxable = Math.max(0, Math.min(netIncome, b.max) - b.min)
              const bracketTax = taxable * b.rate
              if (taxable === 0) return null
              return (
                <div key={b.min} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '0.5px solid #e8e6e0' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>
                    {fmt(b.min + 1)} – {b.max === Infinity ? 'ขึ้นไป' : fmt(b.max)} ({(b.rate * 100).toFixed(0)}%)
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917' }}>
                    {fmt(bracketTax)} บาท
                  </span>
                </div>
              )
            })}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1.5px solid #1a1917', marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: '#1a1917' }}>รวมภาษี</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: '#1a1917' }}>{fmt(tax)} บาท</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ background: '#faeeda', border: '0.5px solid #e8c97a', borderRadius: 6, padding: '10px 14px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#633806', margin: 0, lineHeight: 1.6 }}>
              ⚠️ ผลลัพธ์นี้เป็นการประมาณการเท่านั้น คำนวณตามหลักเกณฑ์กรมสรรพากรปีภาษี 2568 เพื่อความถูกต้องสมบูรณ์ควรปรึกษาผู้เชี่ยวชาญด้านภาษีหรือยื่นผ่าน efiling.rd.go.th
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {navBtn('← แก้ไขข้อมูล', 0)}
            <button onClick={() => { setIncome(0); setD(defaultDeductions); setStep(0) }} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '8px 16px',
              background: '#fcebeb', color: '#a32d2d',
              border: '0.5px solid #f09595', borderRadius: 6, cursor: 'pointer',
            }}>เริ่มใหม่</button>
          </div>
        </div>
      )}
    </div>
  )
}