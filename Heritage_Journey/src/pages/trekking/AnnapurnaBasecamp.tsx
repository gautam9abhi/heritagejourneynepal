import { useRef, useState, useEffect } from 'react';
import {
  Utensils, Mountain, Clock, Calendar, ArrowUpRight,
  Users, Compass, MapPin, Heart, ChevronDown,
  Wind, Sun, CloudRain, CloudSnow, Cloud, Info, CheckCircle, X, Send
} from 'lucide-react';
import Layout from '@/components/Layout';

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS — shared with Hero.tsx
   Night-indigo, cool snow white, saffron actions, prayer-flag red accent.
   (All hex so the `COLOR + '1f'` alpha tricks below keep working.)
══════════════════════════════════════════════════════ */
const INK   = '#0c1626';
const SNOW  = '#f3f6f9';
const SAFF  = '#f5a81c';
const RED   = '#d63a32';

const AC  = RED;        // accent (icons, active states)
const RO  = SAFF;       // primary action colour
const W   = '#FFFFFF';
const BG  = SNOW;       // page background
const H   = INK;        // headings
const TX  = '#3a4659';  // body text
const BD  = '#d5dbe3';  // borders
const MUT = '#6b788c';  // muted text

/* Outfit for headings, Hind for body — same pairing as the home hero */
const HEADING_FONT = "'Outfit', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT    = "'Hind', system-ui, -apple-system, 'Segoe UI', sans-serif";

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════════════════
   RESPONSIVE HOOK — since this file uses inline styles,
   we detect viewport width to switch grid layouts, padding,
   and font sizes instead of relying on CSS media queries.
══════════════════════════════════════════════════════ */
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
};

/* Shared section heading */
const SectionTitle = ({
  children, mb = 18, size = 'clamp(1.6rem,3.6vw,2.2rem)', center = false,
}: { children: React.ReactNode; mb?: number; size?: string; center?: boolean }) => (
  <h2 style={{
    fontFamily: HEADING_FONT, fontSize: size, fontWeight: 600, color: INK,
    lineHeight: 1.12, letterSpacing: '-0.025em', margin: `0 0 ${mb}px`,
    textAlign: center ? 'center' : 'left',
  }}>
    {children}
  </h2>
);

/* ══════════════════════════════════════════════════════
   BOOKING MODAL
══════════════════════════════════════════════════════ */
interface BookingForm {
  name:        string;
  email:       string;
  phone:       string;
  nationality: string;
  groupSize:   string;
  month:       string;
  year:        string;
  trekType:    string;
  message:     string;
}

interface BookingErrors {
  name?:  string;
  email?: string;
  month?: string;
}

interface BookingModalProps {
  isOpen:  boolean;
  onClose: () => void;
}

const emptyForm: BookingForm = {
  name:'', email:'', phone:'', nationality:'',
  groupSize:'2', month:'', year:'2026',
  trekType:'Standard 14-Day Trek', message:'',
};

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const isMobile = useIsMobile();
  const [step,    setStep]    = useState<number>(1);
  const [form,    setForm]    = useState<BookingForm>(emptyForm);
  const [errors,  setErrors]  = useState<BookingErrors>({});
  const [sending, setSending] = useState<boolean>(false);

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const years  = ['2026','2027'];

  const validate = () => {
    const e: BookingErrors = {};
    if (!form.name.trim())    e.name    = 'Please enter your full name';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.month)          e.month   = 'Please select a preferred month';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStep(2); };

  const handleSubmit = async () => {
    setSending(true);
    try {
      const res = await fetch('https://formspree.io/f/mrevzybb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          trek:        'Annapurna Base Camp — 14 Days',
          name:        form.name,
          email:       form.email,
          phone:       form.phone,
          nationality: form.nationality,
          group_size:  form.groupSize,
          month:       form.month + ' ' + form.year,
          package:     form.trekType,
          message:     form.message,
        }),
      });
      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        alert('Submission failed: ' + (data?.errors?.[0]?.message || 'Please try again.'));
      }
    } catch {
      alert('Network error — please check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setForm(emptyForm);
    setErrors({});
    onClose();
  };

  const labelStyle: React.CSSProperties = { display:'block', fontSize:14, fontWeight:600, color:INK, fontFamily:BODY_FONT, marginBottom:6 };
  const inputBase = (hasError: boolean): React.CSSProperties => ({
    width:'100%', padding:'11px 14px', border:'1.5px solid ' + (hasError ? RED : BD),
    borderRadius:8, fontSize:15, color:INK, background:W,
    fontFamily:BODY_FONT, outline:'none', boxSizing:'border-box',
    transition:'border-color 0.2s',
  });

  const field = (label: string, key: keyof BookingForm, type = 'text', placeholder = '') => (
    <div style={{ marginBottom:18 }}>
      <label style={labelStyle}>
        {label} {['name','email','month'].includes(key) && <span style={{ color:INK }}>*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => { setForm(p => ({...p, [key]:e.target.value})); setErrors(p => { const n={...p}; delete n[key as keyof BookingErrors]; return n; }); }}
        style={inputBase(!!errors[key as keyof BookingErrors])}
        onFocus={e => e.target.style.borderColor=INK}
        onBlur={e  => e.target.style.borderColor = errors[key as keyof BookingErrors] ? RED : BD}
      />
      {errors[key as keyof BookingErrors] && <p style={{ fontSize:13, color:RED, margin:'4px 0 0', fontFamily:BODY_FONT }}>{errors[key as keyof BookingErrors]}</p>}
    </div>
  );

  const select = (label: string, key: keyof BookingForm, options: any[], required = false) => (
    <div style={{ marginBottom:18 }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color:INK }}>*</span>}
      </label>
      <select
        value={form[key]}
        onChange={e => { setForm(p => ({...p, [key]:e.target.value})); setErrors(p => { const n={...p}; delete n[key as keyof BookingErrors]; return n; }); }}
        style={{ ...inputBase(!!errors[key as keyof BookingErrors]), cursor:'pointer' }}
      >
        {options.map((o: any) => <option key={o.val||o} value={o.val||o}>{o.label||o}</option>)}
      </select>
      {errors[key as keyof BookingErrors] && <p style={{ fontSize:13, color:RED, margin:'4px 0 0', fontFamily:BODY_FONT }}>{errors[key as keyof BookingErrors]}</p>}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div onClick={handleClose} role="dialog" aria-modal="true" aria-label="Book your trek"
      style={{ position:'fixed', inset:0, background:'rgba(12,22,38,0.78)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding: isMobile ? 12 : 20 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:SNOW, borderRadius:12, width:'100%', maxWidth:560, maxHeight:'92vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(0,0,0,0.4)', position:'relative', fontFamily:BODY_FONT }}>

        {/* Header */}
        <div style={{ background:INK, borderRadius:'12px 12px 0 0', padding: isMobile ? '24px 20px 20px' : '28px 32px 24px', color:SNOW }}>
          <button onClick={handleClose} aria-label="Close"
            style={{ position:'absolute', top:18, right:20, background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%', width:34, height:34, cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={18}/>
          </button>
          <p style={{ fontSize:14, color:'rgba(243,246,249,0.65)', fontFamily:BODY_FONT, margin:'0 0 6px' }}>Heritage Journey Nepal</p>
          <h2 style={{ fontSize: isMobile ? 26 : 30, fontWeight:600, margin:'0 0 4px', color:SNOW, fontFamily: HEADING_FONT, letterSpacing:'-0.02em' }}>Book your trek</h2>
          <p style={{ fontSize:15, color:'rgba(243,246,249,0.75)', margin:0, fontFamily:BODY_FONT }}>Annapurna Base Camp, 14 days, from USD 1,290 per person</p>

          {/* Step indicators */}
          {step < 3 && (
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:20, flexWrap:'wrap' }}>
              {[1,2].map(s => (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{
                    width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    background: step >= s ? SAFF : 'rgba(255,255,255,0.15)',
                    color: step >= s ? INK : 'white', fontSize:14, fontWeight:700, fontFamily:BODY_FONT,
                    transition:'all 0.3s',
                  }}>{s}</div>
                  <span style={{ fontSize:14, color: step >= s ? SNOW : 'rgba(255,255,255,0.5)', fontFamily:BODY_FONT }}>
                    {s===1 ? 'Your details' : 'Confirm'}
                  </span>
                  {s < 2 && <div style={{ width:24, height:2, background:'rgba(255,255,255,0.2)', borderRadius:2 }}/>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: isMobile ? '22px 20px 24px' : '28px 32px 32px' }}>

          {/* ── STEP 1: Details ── */}
          {step === 1 && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 0 : '0 16px' }}>
                {field('Full name',    'name',    'text',  'e.g. John Smith')}
                {field('Email address','email',   'email', 'e.g. john@email.com')}
                {field('Phone / WhatsApp','phone','tel',   'e.g. +1 555 0123')}
                {field('Nationality',  'nationality','text','e.g. British')}
              </div>

              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 0 : '0 16px' }}>
                {select('Group size', 'groupSize', Array.from({length:11},(_,i)=>({val:String(i+2),label:`${i+2} ${i===0?'person':'people'}`})))}
                {select('Preferred month', 'month', [{val:'',label:'Select month…'},...months], true)}
                {select('Year', 'year', years)}
              </div>

              {select('Trek package', 'trekType', [
                'Standard 14-Day Trek',
                'Private Group (custom dates)',
                'Photography Special (extra nights at ABC)',
                'Family-Friendly (slower pace, 16 days)',
              ])}

              <div style={{ marginBottom:18 }}>
                <label style={labelStyle}>Special requests or questions</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({...p, message:e.target.value}))}
                  placeholder="Dietary requirements, fitness concerns, questions about the route..."
                  rows={3}
                  style={{ ...inputBase(false), resize:'vertical' }}
                  onFocus={e => e.target.style.borderColor=INK}
                  onBlur={e  => e.target.style.borderColor=BD}
                />
              </div>

              <button onClick={handleNext}
                style={{ width:'100%', background:SAFF, color:INK, border:'none', borderRadius:8, height:54, fontSize:16, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                Review booking <ArrowUpRight size={18}/>
              </button>
            </div>
          )}

          {/* ── STEP 2: Confirm ── */}
          {step === 2 && (
            <div>
              <div style={{ background:W, border:'1px solid '+BD, borderRadius:10, padding: isMobile ? 16 : 22, marginBottom:24 }}>
                <h3 style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.02em', margin:'0 0 12px' }}>Booking summary</h3>
                {[
                  ['Trek',        'Annapurna Base Camp — 14 Days'],
                  ['Name',        form.name],
                  ['Email',       form.email],
                  ['Phone',       form.phone || '—'],
                  ['Nationality', form.nationality || '—'],
                  ['Group size',  form.groupSize + ' people'],
                  ['Preferred',   form.month + ' ' + form.year],
                  ['Package',     form.trekType],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid '+BD, fontSize:15, fontFamily:BODY_FONT, gap:12 }}>
                    <span style={{ color:MUT }}>{k}</span>
                    <span style={{ color:INK, fontWeight:600, textAlign:'right', maxWidth:'60%' }}>{v}</span>
                  </div>
                ))}
                {form.message && (
                  <div style={{ marginTop:12, padding:'10px 0', fontSize:15, color:TX, fontFamily:BODY_FONT }}>
                    <span style={{ fontWeight:600, color:MUT }}>Message: </span>{form.message}
                  </div>
                )}
              </div>

              <div style={{ background:SAFF+'1f', border:'1px solid '+SAFF+'66', borderRadius:8, padding:'14px 16px', marginBottom:22, display:'flex', gap:10 }}>
                <Info size={18} color={INK} style={{ flexShrink:0, marginTop:2 }}/>
                <p style={{ fontSize:14, color:INK, margin:0, lineHeight:1.65, fontFamily:BODY_FONT }}>
                  This is an <strong>enquiry / booking request</strong>, not a payment. Our team will contact you within 24 hours to confirm availability and arrange payment.
                </p>
              </div>

              <div style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:12 }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: isMobile ? 'none' : 1, background:'transparent', color:INK, border:'1.5px solid '+BD, borderRadius:8, height:52, fontSize:15, fontFamily:BODY_FONT, fontWeight:500, cursor:'pointer' }}>
                  ← Edit details
                </button>
                <button onClick={handleSubmit} disabled={sending}
                  style={{ flex: isMobile ? 'none' : 2, background: sending ? '#9ca3af' : SAFF, color:INK, border:'none', borderRadius:8, height:52, fontSize:15, fontFamily:BODY_FONT, fontWeight:600, cursor: sending ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {sending ? 'Sending…' : <><Send size={16}/> Confirm booking request</>}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Done ── */}
          {step === 3 && (
            <div style={{ textAlign:'center', padding:'12px 0 8px' }}>
              <div style={{ width:72, height:72, background:SAFF+'33', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <CheckCircle size={38} color={INK}/>
              </div>
              <h3 style={{ fontSize: isMobile ? 26 : 30, fontWeight:600, color:INK, margin:'0 0 10px', fontFamily: HEADING_FONT, letterSpacing:'-0.02em' }}>Booking request sent</h3>
              <p style={{ fontSize:16, color:TX, lineHeight:1.75, margin:'0 0 8px', fontFamily:BODY_FONT }}>
                Thank you, <strong>{form.name}</strong>! We've received your request for <strong>{form.month} {form.year}</strong>.
              </p>
              <p style={{ fontSize:15, color:MUT, lineHeight:1.75, margin:'0 0 28px', fontFamily:BODY_FONT }}>
                A Heritage Journey Nepal guide will email <strong>{form.email}</strong> within 24 hours to confirm availability, answer your questions, and arrange next steps.
              </p>
              <div style={{ background:W, border:'1px solid '+BD, borderRadius:10, padding:'16px 20px', marginBottom:24, textAlign:'left' }}>
                <p style={{ fontSize:16, fontWeight:600, color:INK, fontFamily:HEADING_FONT, margin:'0 0 10px' }}>What happens next</p>
                {['We confirm availability for your dates','We send a detailed trip proposal & quote','You pay a 20% deposit to secure your spot','Full balance due 6 weeks before departure'].map((s,i)=>(
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:6, fontSize:15, color:TX, fontFamily:BODY_FONT }}>
                    <CheckCircle size={16} color={INK} style={{ flexShrink:0, marginTop:3 }}/> {s}
                  </div>
                ))}
              </div>
              <button onClick={handleClose}
                style={{ width:'100%', background:INK, color:SNOW, border:'none', borderRadius:8, height:52, fontSize:16, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer' }}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── ITINERARY DATA ─────────────────────────────────── */
const itinerary = [
  {
    day:1, title:'Arrival in Kathmandu', time:'—', alt:'1,400m', diff:'Easy', type:'city',
    what:'You arrive. We take care of everything.',
    brief:'A Heritage Journey Nepal representative meets you at Tribhuvan International Airport (TIA) and drives you to your hotel in Thamel — Kathmandu\'s lively tourist hub. You have the rest of the day free.',
    tip:'Tip: Change some cash to Nepali Rupees at the airport. USD is also accepted in most tourist areas.',
    overview:'Use the afternoon to shake off jet lag. Boudhanath Stupa (a 15-min walk from Thamel) is the perfect first taste of Nepal — a giant white dome circled by monks, pilgrims, and prayer flags. In the evening we host a welcome dinner where your guide walks you through every detail of the trek: what to expect, what to pack, what to eat.',
  },
  {
    day:2, title:'Drive Kathmandu → Pokhara', time:'6–7 hrs', alt:'822m', diff:'Easy', type:'drive',
    what:'A scenic bus or car ride through the Nepali hills.',
    brief:'After breakfast we drive west along the Prithvi Highway, following the turquoise Trishuli River through terraced rice fields and riverside villages. Pokhara is Nepal\'s adventure capital and sits at the edge of a calm lake with direct views of the Annapurna peaks.',
    tip:'Tip: Sit on the left side of the vehicle for the best river views.',
    overview:'Arrive in Pokhara mid-afternoon. If the sky is clear, you can already see Machhapuchhre (Fishtail Mountain) from your hotel window — the very peak you\'ll be standing beneath on Day 9. Spend the evening at Lakeside, Pokhara\'s waterfront strip of restaurants and cafés.',
  },
  {
    day:3, title:'Drive to Nayapul → Trek to Tikhedhunga', time:'4–5 hrs walk', alt:'1,540m', diff:'Easy', type:'trek',
    what:'Your first steps on the trail — flat and forested.',
    brief:'A 1.5 hr jeep ride to Nayapul (the trailhead) where the trekking officially begins. You walk through Birethanti village — your passport and permits are checked here at the ACAP checkpoint — then follow the Modi Khola (Modi River) upstream through subtropical forest to Tikhedhunga.',
    tip:'Tip: Today is easy. Use it to find your walking rhythm and break in your boots. Drink plenty of water.',
    overview:'The trail is wide and well-maintained, passing through banana trees, giant ferns, and small roadside villages selling fresh fruit. Tikhedhunga is a cluster of stone teahouses perched above a waterfall — a perfect introduction to the simple but comfortable world of Himalayan teahouse trekking.',
  },
  {
    day:4, title:'Tikhedhunga → Ghorepani', time:'6–7 hrs', alt:'2,850m', diff:'Moderate', type:'trek',
    what:'The big climb — 3,000 stone steps up through rhododendron forest.',
    brief:'This is the hardest day so far. From Tikhedhunga the trail climbs sharply via Ulleri (a village famous for its brutal stone staircase) and continues up through dense forest to Ghorepani ridge. By the time you arrive you\'ll have gained over 1,300 metres of altitude.',
    tip:'Tip: Take it slow. "Bistari bistari" (slowly slowly) is the Nepali trekking mantra. There is no prize for arriving first.',
    overview:'The effort is 100% worth it. In spring (March–April) the entire hillside blazes red and pink with rhododendron blooms — Nepal\'s national flower. Ghorepani (2,850m) sits on a ridge with unobstructed views of Dhaulagiri (8,167m), the world\'s seventh highest peak, glowing orange at sunset.',
  },
  {
    day:5, title:'Poon Hill Sunrise → Trek to Tadapani', time:'6–7 hrs total', alt:'2,630m', diff:'Moderate', type:'sunrise',
    what:'THE iconic moment — Himalayan sunrise from Poon Hill.',
    brief:'Wake at 4:30am. Hike 45 minutes by headtorch to Poon Hill (3,210m). Watch the sun rise over Annapurna I (8,091m), Machhapuchhre, Dhaulagiri and a dozen other peaks. Return to Ghorepani for breakfast, then trek on through forest to Tadapani.',
    tip:'Tip: Bring every warm layer you have for the pre-dawn hike. It can be below freezing on the hilltop even in spring.',
    overview:'Poon Hill is the single most photographed viewpoint in Nepal. As darkness lifts, silhouettes of massive peaks appear one by one, then turn gold as the first sunlight hits the snow. Even experienced trekkers get emotional. After such an early start, the forested walk to Tadapani feels leisurely by comparison.',
  },
  {
    day:6, title:'Tadapani → Chhomrong', time:'5–6 hrs', alt:'2,170m', diff:'Moderate', type:'trek',
    what:'Descend to the last big village before the Sanctuary.',
    brief:'Trek down through beautiful rhododendron and oak forest, cross the Modi Khola river on a suspension bridge, then climb steeply to Chhomrong — the last large permanent village before you enter the restricted Annapurna Sanctuary area. The views of Annapurna South from here are spectacular.',
    tip:'Tip: Stock up on snacks and personal supplies in Chhomrong. Prices and availability get limited higher up.',
    overview:'Chhomrong is a thriving Gurung village — the Gurung people are one of Nepal\'s most celebrated ethnic groups, famed as Gurkha soldiers. The village staircase descends steeply through cardamom plantations (the whole valley smells amazing) with teahouses at every level. Your guide will sort your Sanctuary permits here.',
  },
  {
    day:7, title:'Chhomrong → Dovan', time:'6–7 hrs', alt:'2,600m', diff:'Moderate', type:'trek',
    what:'Enter the gorge — walls of the Sanctuary close in around you.',
    brief:'Descend the famous Chhomrong staircase (1,000+ steps down) then enter the narrow Modi Khola gorge. The trail passes through Sinuwa and Bamboo — named for the thick bamboo groves lining the path — as the canyon walls rise dramatically on either side. You are now inside the Annapurna Sanctuary zone.',
    tip:'Tip: This is UNESCO-protected forest. You may see Himalayan tahr (wild mountain goat), langur monkeys, and if very lucky, a snow leopard.',
    overview:'The gorge feels like another world. The river roars below; moss-covered cliffs rise above; and rhododendron trees arch over the trail to form tunnels of green. The teahouse at Dovan is basic but welcoming, sitting in a narrow valley clearing with the sound of the river all night.',
  },
  {
    day:8, title:'Dovan → Deurali', time:'4–5 hrs', alt:'3,200m', diff:'Moderate', type:'trek',
    what:'Cross the avalanche zone — the mountains grow enormous.',
    brief:'A shorter walking day but dramatic. The trail crosses an open section above Himalayan Camp that is exposed to avalanche runoff in winter. Trees disappear. The canyon opens. And Machhapuchhre (6,993m) — the sacred unclimbed Fishtail Mountain — suddenly fills the entire sky in front of you.',
    tip:'Tip: Machhapuchhre is forbidden to climb by the Nepal government out of religious respect. It is one of the only peaks in the world that no human has ever stood on top of.',
    overview:'Deurali (3,200m) is a collection of teahouses at the top of the gorge, right at the entrance to the open Sanctuary. From here on clear days you can see the upper Sanctuary walls glowing ahead. The temperature drops noticeably — tonight will be cold. Acclimatise well, eat a big dinner.',
  },
  {
    day:9, title:'Deurali → Annapurna Base Camp', time:'5–6 hrs', alt:'4,130m', diff:'Challenging', type:'summit',
    what:'THE day. You reach Annapurna Base Camp at 4,130m.',
    brief:'Pass through Machhapuchhre Base Camp (3,700m) — a teahouse cluster with extraordinary views — then make the final climb into the Annapurna Sanctuary. As you crest the ridge, you enter a glacial bowl completely ringed by mountains: Annapurna I (8,091m), Annapurna South, Annapurna III, Machhapuchhre, Hiunchuli, and Gangapurna all visible at once.',
    tip:'Tip: Altitude sickness is real at 4,130m. Walk slowly, breathe deeply, drink 3–4 litres of water. Tell your guide immediately if you have a severe headache, vomiting, or confusion.',
    overview:'This is one of the most extraordinary places a non-mountaineer can reach on foot. The Sanctuary is a natural glacier amphitheatre — mountains in every direction, no valley escape, just ice and rock and sky. Spend the afternoon exploring base camp, photographing the peaks, and watching the light change at sunset. Tonight you sleep surrounded by the Himalayas.',
  },
  {
    day:10, title:'ABC → Bamboo (Descent begins)', time:'7–8 hrs', alt:'2,310m', diff:'Moderate', type:'trek',
    what:'Long descent after one final sunrise inside the Sanctuary.',
    brief:'Wake at 5am for the last sunrise at ABC — Annapurna I turns deep orange as the sun crests Hiunchuli. After breakfast, begin the long descent back through Deurali, Himalayan Camp, and the gorge to Bamboo. Seven to eight hours of walking — easier on the lungs at lower altitude but harder on the knees.',
    tip:'Tip: Trekking poles are invaluable on the descent. Take your time on the steep sections.',
    overview:'The same trail looks completely different in the other direction — views you missed on the way up appear. The forest returns as you descend, the air gets warmer and thicker, and by Bamboo the birds are singing again. It feels like returning from another world.',
  },
  {
    day:11, title:'Bamboo → Jhinu Danda Hot Springs', time:'5–6 hrs', alt:'1,780m', diff:'Moderate', type:'trek',
    what:'Natural hot springs beside the river — the trekker\'s reward.',
    brief:'Continue the descent through Sinuwa and Chhomrong then branch off on the lower trail to Jhinu Danda (1,780m). At the end of the day, descend 15 minutes to the Modi Khola riverside where natural thermal springs bubble up at the water\'s edge. Soak your legs in warm mineral water beside a glacial river.',
    tip:'Tip: Bring flip-flops for the hot springs. There\'s a small entry fee (around NPR 200). Go at sunset for the best atmosphere.',
    overview:'After 10 days of hard trekking, the hot springs of Jhinu Danda are one of the great pleasures of the Annapurna circuit. The contrast of cold mountain air and warm thermal water, with the sound of the river and the mountains above, is something you\'ll remember for years.',
  },
  {
    day:12, title:'Jhinu Danda → Nayapul → Pokhara', time:'3–4 hrs walk + drive', alt:'822m', diff:'Easy', type:'drive',
    what:'Last morning on the trail — then back to Pokhara to celebrate.',
    brief:'A gentle 3–4 hour walk back through familiar forest to Birethanti and Nayapul, where a jeep picks you up for the 1.5 hour drive to Pokhara. Arrive for a celebratory lunch at a lakeside restaurant.',
    tip:'Tip: You\'ve just completed one of the world\'s great treks. Celebrate properly.',
    overview:'The walk back to Nayapul is easy and pleasant — you know the trail now, and the subtropical landscape that seemed so new on Day 3 feels like an old friend. Pokhara rewards you with a hot shower, a real bed, cold beer, and a view of the very mountains you just trekked through.',
  },
  {
    day:13, title:'Pokhara → Drive back to Kathmandu', time:'6–7 hrs', alt:'1,400m', diff:'Easy', type:'drive',
    what:'The long drive home along the Prithvi Highway.',
    brief:'One last look at the Annapurna range from the Pokhara lakefront at breakfast, then the return drive to Kathmandu. Arrive mid-afternoon for souvenir shopping in Thamel and a farewell dinner hosted by Heritage Journey Nepal.',
    tip:'Tip: Boudhanath Stupa is open until 9pm — a beautiful place for a final evening in Nepal.',
    overview:'The drive feels reflective — the mountains are visible behind you all the way to the Trishuli valley. Back in the chaos and colour of Kathmandu, the silence of the Sanctuary already seems impossibly far away.',
  },
  {
    day:14, title:'Departure from Kathmandu', time:'—', alt:'—', diff:'Easy', type:'city',
    what:'Time to fly home — carrying the mountains with you.',
    brief:'Depending on your flight time, the morning is free for last-minute shopping or a final stupa visit. Your guide transfers you to Tribhuvan International Airport (TIA) with plenty of time before departure.',
    tip:'Tip: Allow extra time at TIA — international check-in queues can be long. We recommend arriving 3 hours before departure.',
    overview:'You leave Nepal having stood inside a glacial amphitheatre at 4,130m, surrounded by ten Himalayan giants. You watched the sun rise over Annapurna from Poon Hill. You soaked in hot springs beside a glacial river. These are the things you\'ll be telling people about for the rest of your life.',
  },
];

const gallery = [
  { src:'/images/trekking/abc/annapurna-base-camp.jpg', alt:'Annapurna Base Camp', caption:'Annapurna Base Camp at 4,130m — the glacial amphitheatre' },
  { src:'/images/trekking/abc/abc-2.jpg',               alt:'Mountain views',       caption:'Views of the Annapurna range from the trail' },
  { src:'/images/trekking/abc/abc-3.jpg',               alt:'Landscapes',           caption:'Himalayan landscapes along the Modi Khola valley' },
  { src:'/images/trekking/abc/abc-4.jpg',               alt:'Villages',             caption:'Traditional Gurung village teahouses' },
  { src:'/images/trekking/abc/abc-5.jpg',               alt:'Local culture',        caption:'Local culture and monastery trails' },
];

const weatherData = [
  { m:'Jan', lo:-5, hi:10,  cond:'snow',  ok:false },
  { m:'Feb', lo:-3, hi:12,  cond:'snow',  ok:false },
  { m:'Mar', lo:0,  hi:15,  cond:'mixed', ok:true  },
  { m:'Apr', lo:5,  hi:17,  cond:'cloud', ok:true  },
  { m:'May', lo:7,  hi:20,  cond:'cloud', ok:true  },
  { m:'Jun', lo:10, hi:22,  cond:'rain',  ok:false },
  { m:'Jul', lo:12, hi:22,  cond:'rain',  ok:false },
  { m:'Aug', lo:12, hi:22,  cond:'rain',  ok:false },
  { m:'Sep', lo:10, hi:20,  cond:'mixed', ok:true  },
  { m:'Oct', lo:5,  hi:18,  cond:'sun',   ok:true  },
  { m:'Nov', lo:0,  hi:15,  cond:'sun',   ok:true  },
  { m:'Dec', lo:-3, hi:12,  cond:'snow',  ok:false },
];

const includes = [
  'Airport transfers and all ground transportation',
  '6 nights hotel in Kathmandu and Pokhara (3-star)',
  'All teahouse accommodation during the trek',
  'All meals during trek (breakfast, lunch, dinner)',
  'Licensed English-speaking trekking guide',
  'Porter (1 per 2 trekkers, max 15kg per porter)',
  'ACAP permit and TIMS trekking card',
  'First-aid kit and emergency evacuation plan',
  'Farewell dinner in Kathmandu',
];
const excludes = [
  'International flights to/from Nepal',
  'Nepal visa on arrival (~USD 50)',
  'Travel and health insurance (mandatory)',
  'Personal trekking gear and equipment',
  'Hot showers and device charging fees on trail',
  'Tips for guide and porter (customary)',
  'Personal expenses and souvenirs',
];

/* ── Waypoints ─────────────────────────────────────── */
const waypoints = [
  { x:400, y:625, label:'Kathmandu',           day:'1, 13–14', start:true },
  { x:220, y:495, label:'Pokhara',             day:'2, 12–13', city:true  },
  { x:165, y:445, label:'Nayapul',             day:3 },
  { x:148, y:404, label:'Tikhedhunga',         day:3 },
  { x:130, y:334, label:'Ghorepani',           day:4 },
  { x:152, y:290, label:'Poon Hill ★',         day:5, special:true },
  { x:172, y:267, label:'Tadapani',            day:5 },
  { x:202, y:232, label:'Chhomrong',           day:6 },
  { x:216, y:197, label:'Dovan',               day:7 },
  { x:229, y:163, label:'Deurali',             day:8 },
  { x:241, y:120, label:'Annapurna Base Camp', day:9, peak:true },
];

/* ── HELPERS ────────────────────────────────────────── */
const WeatherIcon = ({ cond, size=20 }: { cond: string; size?: number }) => {
  const p = { size, strokeWidth:1.5, color:TX };
  if (cond==='sun')   return <Sun       {...p} />;
  if (cond==='rain')  return <CloudRain {...p} />;
  if (cond==='snow')  return <CloudSnow {...p} />;
  if (cond==='cloud') return <Cloud     {...p} />;
  return <Wind {...p} />;
};

/* ── GALLERY ─────────────────────────────────────────── */
const Gallery = () => {
  const isMobile = useIsMobile();
  const [lb, setLb] = useState<number | null>(null);
  return (
    <>
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.55fr 1fr',
        gridTemplateRows: isMobile ? 'repeat(5, 200px)' : '240px 240px',
        gap:10,
      }}>
        <div onClick={() => setLb(0)} style={{ gridRow: isMobile ? 'auto' : '1 / 3', borderRadius:10, overflow:'hidden', cursor:'zoom-in', position:'relative', background:BD }}>
          <img src={gallery[0].src} alt={gallery[0].alt} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.4s' }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'40px 18px 16px', background:'linear-gradient(transparent,rgba(12,22,38,0.7))' }}>
            <p style={{ color:W, fontSize:15, fontFamily:BODY_FONT, margin:0 }}>{gallery[0].caption}</p>
          </div>
        </div>
        {gallery.slice(1).map((img,i) => (
          <div key={i} onClick={() => setLb(i+1)} style={{ borderRadius:10, overflow:'hidden', cursor:'zoom-in', position:'relative', background:BD }}>
            <img src={img.src} alt={img.alt} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.4s' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}/>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'24px 12px 10px', background:'linear-gradient(transparent,rgba(12,22,38,0.65))' }}>
              <p style={{ color:W, fontSize:13, fontFamily:BODY_FONT, margin:0 }}>{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
      {lb !== null && (
        <div onClick={() => setLb(null)} style={{ position:'fixed', inset:0, background:'rgba(8,14,26,0.92)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding: isMobile ? 16 : 24 }}>
          <div style={{ position:'relative', maxWidth:900, width:'100%' }} onClick={e => e.stopPropagation()}>
            <img src={gallery[lb].src} alt={gallery[lb].alt} style={{ width:'100%', borderRadius:10, display:'block', maxHeight:'80vh', objectFit:'contain' }}/>
            <p style={{ color:'rgba(255,255,255,0.85)', textAlign:'center', fontFamily:BODY_FONT, fontSize:16, marginTop:12 }}>{gallery[lb].caption}</p>
            {!isMobile && (
              <>
                <button aria-label="Previous photo" onClick={() => setLb((lb-1+gallery.length)%gallery.length)} style={{ position:'absolute', left:-52, top:'45%', background:'none', border:'none', color:W, fontSize:36, cursor:'pointer' }}>‹</button>
                <button aria-label="Next photo" onClick={() => setLb((lb+1)%gallery.length)} style={{ position:'absolute', right:-52, top:'45%', background:'none', border:'none', color:W, fontSize:36, cursor:'pointer' }}>›</button>
              </>
            )}
            {isMobile && (
              <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:14 }}>
                <button aria-label="Previous photo" onClick={() => setLb((lb-1+gallery.length)%gallery.length)} style={{ background:'rgba(255,255,255,0.12)', border:'none', color:W, fontSize:22, cursor:'pointer', borderRadius:'50%', width:40, height:40 }}>‹</button>
                <button aria-label="Next photo" onClick={() => setLb((lb+1)%gallery.length)} style={{ background:'rgba(255,255,255,0.12)', border:'none', color:W, fontSize:22, cursor:'pointer', borderRadius:'50%', width:40, height:40 }}>›</button>
              </div>
            )}
            <button aria-label="Close" onClick={() => setLb(null)} style={{ position:'absolute', top:-40, right:0, background:'none', border:'none', color:'rgba(255,255,255,0.75)', fontSize:28, cursor:'pointer' }}>✕</button>
          </div>
        </div>
      )}
    </>
  );
};

/* ── ITINERARY ── simple accordion: one list, one open day, no colour coding */
const ItineraryTimeline = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<number | null>(null);
  const indent = isMobile ? 18 : 20 + 56 + 16; // aligns details under the title

  return (
    <div style={{ background:W, border:'1px solid '+BD, borderRadius:10, overflow:'hidden' }}>
      {itinerary.map((d, i) => {
        const isOpen = open === d.day;
        const meta = [d.time !== '—' && d.time, d.alt !== '—' && d.alt, d.diff]
          .filter(Boolean).join('  ·  ');

        return (
          <div
            key={d.day}
            style={{
              borderTop: i ? '1px solid '+BD : 'none',
              background: isOpen ? SNOW : W,
              boxShadow: isOpen ? `inset 3px 0 0 ${SAFF}` : 'none',
              transition:'background 0.2s',
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : d.day)}
              aria-expanded={isOpen}
              style={{ width:'100%', display:'flex', alignItems:'flex-start', gap:16, padding: isMobile ? '16px 18px' : '18px 20px', background:'none', border:'none', textAlign:'left', cursor:'pointer', fontFamily:BODY_FONT, color:INK }}
            >
              {!isMobile && (
                <span style={{ width:56, flexShrink:0, fontFamily:HEADING_FONT, fontSize:16, fontWeight:600, color:MUT, paddingTop:3 }}>
                  Day {d.day}
                </span>
              )}
              <span style={{ flex:1, minWidth:0 }}>
                {isMobile && (
                  <span style={{ display:'block', fontFamily:HEADING_FONT, fontSize:14, fontWeight:600, color:MUT, marginBottom:2 }}>Day {d.day}</span>
                )}
                <span style={{ display:'block', fontFamily:HEADING_FONT, fontSize: isMobile ? 18 : 21, fontWeight:600, letterSpacing:'-0.015em', lineHeight:1.2, marginBottom:4 }}>
                  {d.title}
                </span>
                <span style={{ display:'block', fontSize: isMobile ? 15 : 16, color:TX, lineHeight:1.5, marginBottom:6 }}>{d.what}</span>
                <span style={{ display:'block', fontSize:14, color:MUT }}>{meta}</span>
              </span>
              <ChevronDown
                className="hj-expand"
                size={20}
                color={INK}
                style={{ flexShrink:0, marginTop:4, transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.25s ease' }}
              />
            </button>

            <div
              className="hj-expand"
              style={{ display:'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition:'grid-template-rows 0.25s ease' }}
            >
              <div style={{ overflow:'hidden' }}>
                <div style={{ padding: `0 ${isMobile ? 18 : 20}px 22px ${indent}px` }}>
                  <p style={{ fontSize: isMobile ? 15.5 : 16.5, lineHeight:1.75, color:INK, margin:'0 0 12px' }}>{d.brief}</p>
                  <p style={{ fontSize: isMobile ? 15 : 16, lineHeight:1.75, color:TX, margin:'0 0 12px' }}>{d.overview}</p>
                  <p style={{ fontSize:15, lineHeight:1.65, color:INK, margin:0 }}>
                    <strong>Tip:</strong> {d.tip.replace(/^Tip:\s*/, '')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── TREK MAP ───────────────────────────────────────── */
type Pt = { x: number; y: number };

const TrekMap = () => {
  const [hov, setHov] = useState<number | null>(null);
  const buildPath = (pts: Pt[]) => {
    let d = 'M '+pts[0].x+' '+pts[0].y;
    for(let i=1;i<pts.length;i++){
      const a=pts[i-1],b=pts[i];
      d+=' C '+(a.x+(b.x-a.x)*0.35)+' '+(a.y+(b.y-a.y)*0.35)+
         ', '+(b.x-(b.x-a.x)*0.35)+' '+(b.y-(b.y-a.y)*0.35)+
         ', '+b.x+' '+b.y;
    }
    return d;
  };
  const returnPts = [{x:241,y:120},{x:229,y:163},{x:216,y:197},{x:202,y:232},{x:172,y:267},{x:152,y:290},{x:148,y:404},{x:165,y:445},{x:228,y:502},{x:407,y:632}];
  return (
    <div style={{ background:'#eaf0f5', borderRadius:10, overflow:'hidden', border:'1px solid '+BD }}>
      <svg width="100%" viewBox="0 0 500 700" style={{ display:'block' }} role="img" aria-label="Route map from Kathmandu via Pokhara to Annapurna Base Camp">
        <defs>
          <pattern id="tp" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
            <ellipse cx="35" cy="35" rx="33" ry="24" fill="none" stroke={BD} strokeWidth="0.5" opacity="0.7"/>
            <ellipse cx="35" cy="35" rx="20" ry="14" fill="none" stroke={BD} strokeWidth="0.4" opacity="0.5"/>
          </pattern>
          
        </defs>
        <rect width="500" height="700" fill="#eaf0f5"/>
        <rect width="500" height="700" fill="url(#tp)"/>
        <polygon points="200,42 242,108 158,108" fill={W} opacity="0.95"/>
        <polygon points="247,32 292,108 202,108" fill={W} opacity="0.9"/>
        <polygon points="156,54 190,108 122,108" fill={W} opacity="0.75"/>
        <polygon points="292,40 330,108 254,108" fill={W} opacity="0.85"/>
        <polygon points="200,42 242,108 158,108" fill={INK} opacity="0.06"/>
        <text x="242" y="22" textAnchor="middle" fontSize="10" fill={TX} opacity="0.8">Annapurna Himalaya</text>
        <path d="M 400 625 C 360 585, 310 555, 280 525 C 262 509, 244 499, 220 495" fill="none" stroke={MUT} strokeWidth="3" strokeDasharray="9 5" opacity="0.5"/>
        <text x="325" y="575" fontSize="8.5" fill={TX} opacity="0.7" transform="rotate(-32,325,575)">Prithvi Hwy, ~200km</text>
        <path d={buildPath(returnPts)} fill="none" stroke={INK} strokeWidth="2" strokeDasharray="5 4" opacity="0.35"/>
        <path d={buildPath(waypoints)} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
        {waypoints.map((pt,i) => {
          const r = pt.peak?12:pt.start?10:pt.city?9:pt.special?8:6;
          const fill = (pt.peak||pt.special)?SAFF:(pt.start||pt.city)?INK:TX;
          const side = pt.x<260?'right':'left';
          const lx = side==='right'?pt.x+16:pt.x-16;
          const anch = side==='right'?'start':'end';
          return (
            <g key={i} style={{cursor:'pointer'}} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              {(pt.peak||pt.start||pt.city)&&<circle cx={pt.x} cy={pt.y} r={r+9} fill={fill} opacity="0.12"/>}
              <circle cx={pt.x} cy={pt.y} r={hov===i?r+3:r} fill={fill} stroke={W} strokeWidth="2.5" style={{transition:'r 0.15s'}}/>
              {pt.peak&&<text x={pt.x} y={pt.y+1} textAnchor="middle" dominantBaseline="central" fontSize="9" fill={INK} fontWeight="700">▲</text>}
              {pt.start&&<text x={pt.x} y={pt.y+1} textAnchor="middle" dominantBaseline="central" fontSize="9" fill={W} fontWeight="700">✈</text>}
              <text x={lx} y={pt.y} textAnchor={anch} dominantBaseline="central" fontSize={pt.peak||pt.start?11:pt.city?10.5:9} fontWeight={pt.peak||pt.start||pt.city||pt.special?700:500} fill={INK}>
                {pt.label}
              </text>
              {hov===i&&<text x={lx} y={pt.y+14} textAnchor={anch} fontSize="9" fill={TX}>Day {pt.day}</text>}
            </g>
          );
        })}
        <rect x="12" y="12" width="158" height="102" rx="8" fill={W} opacity="0.95"/>
        <text x="24" y="30" fontSize="10" fontWeight="700" fill={INK}>Legend</text>
        <line x1="24" y1="43" x2="56" y2="43" stroke={INK} strokeWidth="4.5" strokeLinecap="round"/>
        <text x="62" y="46" fontSize="9" fill={TX}>Trek route (outbound)</text>
        <line x1="24" y1="57" x2="56" y2="57" stroke={INK} strokeWidth="2" strokeDasharray="5 4" opacity="0.5"/>
        <text x="62" y="60" fontSize="9" fill={TX}>Return route</text>
        <line x1="24" y1="71" x2="56" y2="71" stroke={MUT} strokeWidth="3" strokeDasharray="8 4" opacity="0.6"/>
        <text x="62" y="74" fontSize="9" fill={TX}>Highway</text>
        <circle cx="30" cy="87" r="6" fill={SAFF} stroke={W} strokeWidth="2"/>
        <text x="42" y="87" dominantBaseline="central" fontSize="9" fill={TX}>Annapurna Base Camp</text>
        <circle cx="30" cy="102" r="6" fill={INK} stroke={W} strokeWidth="2"/>
        <text x="42" y="102" dominantBaseline="central" fontSize="9" fill={TX}>Kathmandu (start/end)</text>
        <g transform="translate(468,42)">
          <circle r="22" fill={W} opacity="0.95"/>
          <text textAnchor="middle" y="-7" fontSize="10" fontWeight="700" fill={INK}>N</text>
          <line x1="0" y1="-17" x2="0" y2="17" stroke={BD} strokeWidth="1.2"/>
          <line x1="-17" y1="0" x2="17" y2="0" stroke={BD} strokeWidth="1.2"/>
          <polygon points="0,-17 -5,-6 0,0" fill={INK}/>
          <polygon points="0,-17 5,-6 0,0" fill={BD}/>
        </g>
      </svg>
    </div>
  );
};

/* ── ELEVATION PROFILE ──────────────────────────────── */
const ElevationProfile = () => {
  const alts=[1400,822,1540,2850,2610,2170,2600,3200,4130,2310,1780,822,1400,1400];
  const MIN=500,MAX=4500,VW=580,VH=140,pL=44,pR=12,pT=12,pB=32;
  const iW=VW-pL-pR,iH=VH-pT-pB,xS=iW/(alts.length-1);
  const yF=(a:number)=>pT+iH-((a-MIN)/(MAX-MIN))*iH;
  let d='M '+pL+' '+yF(alts[0]);
  for(let i=1;i<alts.length;i++){
    const x0=pL+(i-1)*xS,x1=pL+i*xS,y0=yF(alts[i-1]),y1=yF(alts[i]);
    d+=' C '+(x0+xS*0.5)+' '+y0+', '+(x1-xS*0.5)+' '+y1+', '+x1+' '+y1;
  }
  const fd=d+' L '+(pL+(alts.length-1)*xS)+' '+(VH-pB)+' L '+pL+' '+(VH-pB)+' Z';
  return (
    <div style={{ background:W, borderRadius:10, padding:'18px 14px 14px', border:'1px solid '+BD }}>
      <p style={{ fontSize:18, color:INK, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', margin:'0 0 10px '+pL+'px' }}>Elevation profile, days 1–14</p>
      <svg width="100%" viewBox={'0 0 '+VW+' '+VH} role="img" aria-label="Elevation profile peaking at 4,130 metres on day 9">
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={INK} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={INK} stopOpacity="0.03"/>
          </linearGradient>
        </defs>
        {[1000,2000,3000,4000].map(a=>(
          <g key={a}>
            <line x1={pL} y1={yF(a)} x2={VW-pR} y2={yF(a)} stroke={BD} strokeWidth="0.6" strokeDasharray="3 3"/>
            <text x={pL-5} y={yF(a)} textAnchor="end" dominantBaseline="central" fontSize="8" fill={MUT}>{a/1000}k</text>
          </g>
        ))}
        <path d={fd} fill="url(#eg)"/>
        <path d={d} fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round"/>
        <circle cx={pL+8*xS} cy={yF(4130)} r="6" fill={SAFF} stroke={INK} strokeWidth="2"/>
        <text x={pL+8*xS} y={yF(4130)-12} textAnchor="middle" fontSize="9" fill={INK} fontWeight="700">ABC 4,130m</text>
        {alts.map((_,i)=><text key={i} x={pL+i*xS} y={VH-5} textAnchor="middle" fontSize="7.5" fill={MUT}>{i+1}</text>)}
      </svg>
    </div>
  );
};

/* ── FAQ ACCORDION ──────────────────────────────────── */
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:'1px solid '+BD }}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}
        style={{ width:'100%', background:'none', border:'none', cursor:'pointer', padding:'18px 0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, textAlign:'left' }}>
        <span style={{ fontSize:19, fontWeight:600, color: INK, fontFamily: HEADING_FONT, lineHeight:1.3, letterSpacing:'-0.01em', transition:'color 0.2s' }}>{q}</span>
        <ChevronDown size={20} color={INK} style={{ flexShrink:0, transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.25s' }}/>
      </button>
      <div style={{ maxHeight: open ? 360 : 0, overflow:'hidden', transition:'max-height 0.4s ease' }}>
        <p style={{ fontSize:16, color:TX, lineHeight:1.78, paddingBottom:20, margin:0 }}>{a}</p>
      </div>
    </div>
  );
};

/* ── MAIN PAGE ──────────────────────────────────────── */
const AnnapurnaBaseCamp = () => {
  const isMobile = useIsMobile();
  const [tab,         setTab]         = useState<string>('itinerary');
  const [showBooking, setShowBooking] = useState<boolean>(false);
  const overviewRef  = useRef<HTMLDivElement | null>(null);
  useEffect(() => { window.scrollTo(0,0); }, []);

  const tabs = [
    { id:'itinerary', label:'Itinerary' },
    { id:'includes',  label:'What\'s included' },
    { id:'weather',   label:'Weather' },
  ];

  const bodyText: React.CSSProperties = { fontSize: isMobile ? 16 : 17.5, lineHeight:1.8, color:TX };

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Hind:wght@400;500;600&display=swap');
        @keyframes hjBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(9px)} }
        @media (prefers-reduced-motion: reduce) {
          .hj-bounce { animation: none !important; }
          .hj-expand { transition: none !important; }
        }
      `}</style>

      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)}/>
      <div style={{ fontFamily:BODY_FONT, background:BG, color:INK, minHeight:'100vh', paddingBottom: isMobile ? 76 : 0 }}>

        {/* ── HERO ──────────────────────────────────── */}
        <div style={{ position:'relative', minHeight: isMobile ? '80vh' : '92vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:INK }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'url(/images/trekking/abc/annapurna-base-camp.jpg)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.95) contrast(1.06) saturate(0.95)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(12,22,38,0.5), rgba(12,22,38,0.8))' }}/>

          <div style={{ position:'relative', zIndex:2, textAlign:'center', padding: isMobile ? '110px 20px 70px' : '150px 32px 100px', maxWidth:900 }}>
            <p style={{ fontSize:16, fontWeight:500, color:'rgba(243,246,249,0.85)', margin:'0 0 16px' }}>
              Trekking in the Annapurna region
            </p>
            <h1 style={{ fontSize:'clamp(3rem,9vw,6.2rem)', fontWeight:600, lineHeight:1.02, color:SNOW, margin:'0 0 22px', textShadow:'0 2px 24px rgba(12,22,38,0.5)', letterSpacing:'-0.03em', fontFamily: HEADING_FONT }}>
              Annapurna<br/>Base Camp Trek
            </h1>
            <p style={{ fontSize:'clamp(1.05rem,2.4vw,1.3rem)', color:'rgba(243,246,249,0.9)', lineHeight:1.7, maxWidth:600, margin: isMobile ? '0 auto 28px' : '0 auto 36px' }}>
              Into the Shadow of Giants<br/>
              <span style={{ fontSize:'0.88em', color:'rgba(243,246,249,0.75)' }}>
                14 days from Kathmandu to the Annapurna Sanctuary and back
              </span>
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap: isMobile ? 8 : 12, justifyContent:'center', marginBottom: isMobile ? 32 : 44 }}>
              {[{icon:<Clock size={16}/>,label:'14 days'},{icon:<Mountain size={16}/>,label:'4,130m max'},{icon:<Compass size={16}/>,label:'Moderate'},{icon:<Calendar size={16}/>,label:'Mar–May, Sep–Nov'}].map((s,i)=>(
                <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8, border:'1.5px solid rgba(255,255,255,0.4)', color:SNOW, padding: isMobile ? '8px 14px' : '10px 18px', borderRadius:8, fontSize: isMobile ? 14 : 15.5 }}>
                  {s.icon} {s.label}
                </span>
              ))}
            </div>
            <button onClick={() => overviewRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
              style={{ background:SAFF, color:INK, border:'none', height:56, padding: isMobile ? '0 28px' : '0 36px', borderRadius:8, cursor:'pointer', fontSize: isMobile ? 16 : 17, fontFamily:BODY_FONT, fontWeight:600, display:'inline-flex', alignItems:'center', gap:10 }}>
              Start your journey <ArrowUpRight size={20}/>
            </button>
          </div>
          <div className="hj-bounce" style={{ position:'absolute', bottom: isMobile ? 24 : 36, left:'50%', transform:'translateX(-50%)', color:'rgba(255,255,255,0.55)', animation:'hjBounce 2s infinite', zIndex:2 }}>
            <ChevronDown size={28}/>
          </div>
        </div>

        {/* ── FACTS BAND ────────────────────────────── */}
        <div style={{ background:INK, color:SNOW, padding: isMobile ? '18px 0' : '22px 0', borderTop:'1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding: isMobile ? '0 12px' : '0 32px', display:'flex', flexWrap:'wrap', justifyContent:'center', gap: isMobile ? 4 : 10 }}>
            {[{label:'Duration',val:'14 days'},{label:'Max altitude',val:'4,130m'},{label:'Daily walking',val:'4–8 hrs'},{label:'Trek distance',val:'~115 km'},{label:'Group size',val:'2–12'},{label:'Start / end',val:'Kathmandu'}].map((f,i,arr)=>(
              <div key={i} style={{ textAlign:'center', padding: isMobile ? '8px 12px' : '8px 22px', minWidth: isMobile ? '30%' : 'auto', borderRight: (!isMobile && i<arr.length-1) ? '1px solid rgba(255,255,255,0.18)':'none' }}>
                <div style={{ fontSize: isMobile ? 13 : 14, color:'rgba(243,246,249,0.65)', marginBottom:4 }}>{f.label}</div>
                <div style={{ fontSize: isMobile ? 19 : 24, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.01em' }}>{f.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────── */}
        <div ref={overviewRef} style={{ maxWidth:1240, margin:'0 auto', padding: isMobile ? '48px 18px 56px' : '72px 32px 88px' }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr min(360px,34%)', gap: isMobile ? 40 : 52, alignItems:'start' }}>

            <div>
              {/* Overview */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <SectionTitle mb={22} size="clamp(2rem,5vw,3.1rem)">A journey into the Annapurna Sanctuary</SectionTitle>

                {/* Plain-language explainer boxes */}
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : '28px 44px', marginBottom:32 }}>
  {[
    { title:'What is this trek?', text:'A 14-day guided walking holiday through the hills and mountains of the Annapurna region in Nepal. No climbing equipment needed, just boots, fitness and a sense of adventure.' },
    { title:'How fit do I need to be?', text:'You should be able to walk 5–8 hours a day on uneven terrain. You do not need to be an athlete, but regular walking or hiking beforehand is strongly recommended.' },
    { title:'Where do you sleep?', text:'In "teahouses": family-run mountain guesthouses with simple rooms, hot meals and warm hospitality. Think comfortable camping, not luxury hotel.' },
    { title:'Where does it go?', text:'From Kathmandu you drive to Pokhara, then trek through Gurung villages and rhododendron forests into a glacial bowl at 4,130m, completely surrounded by Himalayan peaks.' },
  ].map((box, i) => (
    <div key={i} style={{ borderTop:'3px solid '+INK, paddingTop:14 }}>
      <h3 style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', lineHeight:1.25, margin:'0 0 8px' }}>{box.title}</h3>
      <p style={{ fontSize:15.5, color:TX, lineHeight:1.7, margin:0 }}>{box.text}</p>
    </div>
  ))}
</div>

                <p style={{ ...bodyText, marginBottom:16 }}>
                  The Annapurna Base Camp Trek (often called "ABC") is one of Nepal's most beloved trekking routes, and for good reason. Unlike Mount Everest Base Camp — which requires longer walks across high altitude — ABC is genuinely accessible to fit, motivated first-timers. The route climbs from subtropical jungle at 800m all the way to a glacial amphitheatre at 4,130m, with the scenery changing completely every day.
                </p>
                <p style={bodyText}>
                  The goal is Annapurna Base Camp itself — a natural bowl surrounded on every side by some of the highest peaks on Earth, including Annapurna I (8,091m), the 10th highest mountain in the world. But the journey is just as extraordinary as the destination: Poon Hill sunrise, hot springs, ancient Gurung villages, and two weeks of the cleanest air and most dramatic landscapes you will ever experience.
                </p>
              </section>

              {/* Gallery */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <SectionTitle>Photo gallery</SectionTitle>
                <Gallery />
                <p style={{ fontSize:14, color:MUT, marginTop:10 }}>Click any photo to enlarge, and use ‹ › to browse all images.</p>
              </section>

              {/* Highlights */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
  <SectionTitle>Trek highlights</SectionTitle>
  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', columnGap:44, borderBottom:'1px solid '+BD }}>
    {[
      'Sunrise from Poon Hill (3,210m), one of the world\'s great viewpoints',
      'Standing inside the Annapurna Sanctuary, a full ring of Himalayan giants',
      'Annapurna I at 8,091m, the world\'s 10th highest peak, right above you',
      'Gurung and Magar village culture, warm and genuine',
      'Rhododendron forests in full bloom (March–April)',
      'Natural hot springs at Jhinu Danda, the perfect post-trek soak',
      'Machhapuchhre (Fishtail), Nepal\'s sacred unclimbed peak up close',
      'Tropical jungle to alpine snowfields in 14 days',
    ].map((h, i) => (
      <p key={i} style={{ margin:0, padding:'15px 0', borderTop:'1px solid '+BD, fontSize:16.5, lineHeight:1.55, color:INK }}>
        {h}
      </p>
    ))}
  </div>
</section>

              {/* Permits & Costs */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
  <SectionTitle>What paperwork do you need?</SectionTitle>
  <p style={{ ...bodyText, marginBottom:28 }}>
    Two permits are required for the Annapurna Base Camp Trek. Heritage Journey Nepal arranges both on your behalf and includes them in the trip price, so you do not need to queue at government offices.
  </p>
  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 40 }}>
    {[
      { title:'ACAP: Annapurna Conservation Area Permit', cost:'NPR 3,000 (about USD 22)', detail:'Required for all trekkers entering the Annapurna Conservation Area. The fee goes directly to protecting wildlife, maintaining trails and supporting local communities. You must carry it at all times. It is checked at several points along the route, including Birethanti (Day 3) and Chhomrong (Day 6).' },
      { title:'TIMS: Trekkers\' Information Management System', cost:'NPR 2,000 (about USD 15)', detail:'A national registration card required by the Nepal Tourism Board for all trekkers. Your name, nationality, emergency contact and insurance details are logged so search and rescue can be coordinated if anything goes wrong. Keep it with your passport.' },
    ].map((p, i) => (
      <div key={i} style={{ borderTop:'3px solid '+INK, paddingTop:14 }}>
        <p style={{ fontSize:14, color:MUT, margin:'0 0 6px' }}>Included in price</p>
        <h4 style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', lineHeight:1.25, margin:'0 0 4px' }}>{p.title}</h4>
        <p style={{ fontSize:16, color:INK, fontWeight:600, margin:'0 0 12px' }}>{p.cost}</p>
        <p style={{ fontSize:15.5, color:TX, lineHeight:1.7, margin:0 }}>{p.detail}</p>
      </div>
    ))}
  </div>
</section>

              {/* Altitude & Health */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
  <SectionTitle>Understanding altitude sickness</SectionTitle>
  <p style={{ ...bodyText, marginBottom:28 }}>
    Annapurna Base Camp sits at 4,130m, high enough that altitude sickness (Acute Mountain Sickness, or AMS) is a genuine concern for some trekkers. Knowing the symptoms, prevention and treatment before you go makes a real difference.
  </p>
 
  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 28 : 36, marginBottom:28 }}>
    {[
      { heading:'Mild symptoms', serious:false, items:['Headache, especially after arriving at altitude','Tiredness beyond normal trekking fatigue','Loss of appetite or nausea','Dizziness when standing quickly','Difficulty sleeping'] },
      { heading:'Serious symptoms: descend immediately', serious:true, items:['Severe headache that paracetamol does not ease','Vomiting, unable to keep fluids down','Loss of coordination or stumbling','Confusion or unusual drowsiness','Breathlessness or dry cough even at rest'] },
      { heading:'Prevention', serious:false, items:['Walk slowly. The Nepali rule is "bistari bistari"','Drink 3–4 litres of water a day','Avoid alcohol on the trail, especially above 3,000m','Eat plenty of carbohydrates (dal bhat)','Sleep lower than your highest point of the day'] },
    ].map((col, i) => (
      <div key={i} style={{ borderTop:'3px solid '+(col.serious ? RED : INK), paddingTop:14 }}>
        <h4 style={{ fontSize:19, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', lineHeight:1.25, margin:'0 0 12px' }}>
          {col.heading}
        </h4>
        <ul style={{ margin:0, paddingLeft:18, color:TX, fontSize:15.5, lineHeight:1.6 }}>
          {col.items.map((item, j) => (
            <li key={j} style={{ marginBottom:8, paddingLeft:2 }}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
 
  <p style={{ margin:0, paddingLeft:18, borderLeft:'3px solid '+SAFF, fontSize: isMobile ? 15.5 : 16.5, color:INK, lineHeight:1.75 }}>
    <strong>Our guides are trained in wilderness first aid and altitude medicine.</strong> If you show serious AMS symptoms, your guide will make the call to descend straight away. That is not up for debate, and it is always the right decision, because going down is the most effective treatment. We carry basic medication including Diamox, plus supplemental oxygen on all treks above 3,500m.
  </p>
</section>

              {/* Fitness Guide */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
  <SectionTitle>How to prepare your body for the trek</SectionTitle>
  <p style={{ ...bodyText, marginBottom:28 }}>
    You do not need to be an athlete, but you do need to prepare. The trek involves 6–8 hours of walking a day on uneven mountain terrain, often at altitude. We recommend starting a simple training routine at least 8 weeks before departure.
  </p>
 
  <div style={{ borderBottom:'1px solid '+BD }}>
    {[
      { title:'8 weeks before', items:['Walk 3–4 times a week, 60–90 minutes each time','Include hills and uneven ground wherever you can','Start climbing stairs (office buildings, hill walks)','Build up to 3-hour continuous walks by week 4','Wear your trekking boots on every training walk'] },
      { title:'4 weeks before', items:['Do at least two 5–6 hour day hikes with a loaded pack','Practise carrying 8–10kg (your daypack on trek will weigh 6–8kg)','Focus on descents, because your knees take the most strain going down','Get used to drinking 3+ litres of water a day','Ask your doctor about Diamox (altitude medication) if you are concerned'] },
      { title:'2 weeks before', items:['Ease off the intensity but keep walking, short 60-minute walks are fine','Finish packing and do one full test walk with your gear','Make sure your boots are fully broken in','Book a travel health consultation and check your vaccinations','Confirm your insurance covers high-altitude trekking to 5,000m'] },
      { title:'On the trek', items:['Walk at the pace of the slowest person','Take regular short breaks instead of one long stop','Eat even when you have no appetite, altitude suppresses hunger','Rest properly on rest days and do not push through fatigue','Tell your guide how you feel every morning'] },
    ].map((block, i) => (
      <div
        key={i}
        style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : '190px 1fr',
          gap: isMobile ? 10 : 32,
          padding:'22px 0',
          borderTop:'1px solid '+BD,
        }}
      >
        <h4 style={{ fontSize:21, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', lineHeight:1.2, margin:0 }}>
          {block.title}
        </h4>
        <ul style={{ margin:0, paddingLeft:18, color:TX, fontSize:15.5, lineHeight:1.6 }}>
          {block.items.map((item, j) => (
            <li key={j} style={{ marginBottom:8, paddingLeft:2 }}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</section>
              {/* Map */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <SectionTitle mb={10}>Route map</SectionTitle>
                <p style={{ fontSize: isMobile ? 15 : 16, color:TX, marginBottom:16, lineHeight:1.7 }}>
                  Full route: <strong>Kathmandu → Pokhara → Nayapul → Annapurna Base Camp</strong> and back. {!isMobile && 'Hover any point to see which day you pass through.'}
                </p>
                <TrekMap />
                <div style={{ marginTop:16 }}><ElevationProfile /></div>
              </section>

              {/* Tabs */}
              <section>
                <div role="tablist" style={{ display:'flex', borderBottom:'2px solid '+BD, marginBottom:32, overflowX: isMobile ? 'auto' : 'visible' }}>
                  {tabs.map(t=>(
                    <button key={t.id} role="tab" aria-selected={tab===t.id} onClick={()=>setTab(t.id)}
                      style={{ background:'none', border:'none', cursor:'pointer', padding: isMobile ? '12px 18px' : '13px 26px', fontFamily:HEADING_FONT, fontSize:18, letterSpacing:'-0.01em', color:tab===t.id?INK:MUT, borderBottom:tab===t.id?'3px solid '+SAFF:'3px solid transparent', marginBottom:-2, fontWeight:600, transition:'color 0.2s', whiteSpace:'nowrap' }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {tab==='itinerary' && (
                  <div>
                    <p style={{ fontSize:16, color:TX, margin:'0 0 18px', lineHeight:1.65 }}>
                      Tap a day to read the full description and practical tips. Each day shows walking time, altitude and difficulty.
                    </p>
                    <ItineraryTimeline />
                  </div>
                )}

                {tab==='includes' && (
                  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:28 }}>
                    <div>
                      <h4 style={{ fontSize:22, fontFamily:HEADING_FONT, fontWeight:600, color:INK, letterSpacing:'-0.015em', margin:'0 0 18px' }}>What's included</h4>
                      {includes.map((item,i)=>(
                        <div key={i} style={{ display:'flex', gap:12, marginBottom:14, fontSize:16, color:TX, lineHeight:1.6 }}>
                          <CheckCircle size={18} color={INK} style={{ flexShrink:0, marginTop:3 }}/> {item}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 style={{ fontSize:22, fontFamily:HEADING_FONT, fontWeight:600, color:INK, letterSpacing:'-0.015em', margin:'0 0 18px' }}>Not included</h4>
                      {excludes.map((item,i)=>(
                        <div key={i} style={{ display:'flex', gap:12, marginBottom:14, fontSize:16, color:TX, lineHeight:1.6 }}>
                          <X size={18} color={MUT} style={{ flexShrink:0, marginTop:3 }}/> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab==='weather' && (
                  <div>
                    <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:16, marginBottom:28 }}>
                      {[
                        { season:'Spring (Mar–May)', color:INK, text:'The most popular season. Rhododendrons in full bloom, warm days, cool nights. Some cloud build-up in May but generally clear. Best for photography.' },
                        { season:'Autumn (Sep–Nov)', color:INK, text:'Crystal-clear skies and the sharpest mountain views. Post-monsoon freshness. Busy season with many trekkers. October is peak perfection.' },
                        { season:'Winter (Dec–Feb)', color:INK, text:'Cold but possible at lower altitudes. ABC and high sections will have snow. Very few trekkers. Not recommended without experience.' },
                        { season:'Monsoon (Jun–Aug)', color:INK, text:'Heavy rain, leeches, landslides, and poor visibility. Not recommended for this trek. Trails can be dangerous.' },
                      ].map((s,i)=>(
                        <div key={i} style={{ background:W, border:'1px solid '+BD, borderRadius:10, padding:'16px 18px' }}>
                          <div style={{ fontSize:20, fontWeight:600, color:s.color, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', marginBottom:8 }}>{s.season}</div>
                          <p style={{ fontSize:15.5, color:TX, margin:0, lineHeight:1.7 }}>{s.text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(6,1fr)', gap:10 }}>
                      {weatherData.map((m,i)=>(
                        <div key={i} style={{ background:m.ok?SAFF+'1f':W, border:'1px solid '+(m.ok?SAFF+'88':BD), borderRadius:10, padding: isMobile ? '10px 6px' : '14px 8px', textAlign:'center', opacity:m.ok?1:0.6 }}>
                          <div style={{ fontSize:16, fontFamily:HEADING_FONT, fontWeight:600, color:INK, marginBottom:7 }}>{m.m}</div>
                          <div style={{ marginBottom:7, display:'flex', justifyContent:'center' }}><WeatherIcon cond={m.cond}/></div>
                          <div style={{ fontSize:14, color:INK, fontWeight:600 }}>{m.hi}°</div>
                          <div style={{ fontSize:14, color:MUT }}>{m.lo}°</div>
                          {m.ok&&<div style={{ fontSize:13, color:INK, fontWeight:600, marginTop:5 }}>Best</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* SIDEBAR */}
            <div style={{ position: isMobile ? 'static' : 'sticky', top: isMobile ? 'auto' : 24 }}>
              <div style={{ background:INK, color:SNOW, borderRadius:12, padding: isMobile ? '24px 22px' : '30px 26px', marginBottom:18 }}>
                <div style={{ fontSize:15, color:'rgba(243,246,249,0.65)', marginBottom:6 }}>Starting from</div>
                <div style={{ fontSize: isMobile ? 36 : 42, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.03em', marginBottom:5 }}>
                  USD 1,290
                  <span style={{ fontSize:16, fontWeight:400, color:'rgba(243,246,249,0.6)', marginLeft:8, letterSpacing:0, fontFamily:BODY_FONT }}>per person</span>
                </div>
                <div style={{ fontSize:14, color:'rgba(243,246,249,0.6)', marginBottom:24 }}>Based on 2+ trekkers, all inclusive</div>
                {[
                  {icon:<Clock size={15}/>,    label:'Duration',     val:'14 days'    },
                  {icon:<Mountain size={15}/>, label:'Max altitude', val:'4,130m'     },
                  {icon:<Compass size={15}/>,  label:'Difficulty',   val:'Moderate'   },
                  {icon:<Users size={15}/>,    label:'Group size',   val:'2–12 people'},
                  {icon:<MapPin size={15}/>,   label:'Start / end',  val:'Kathmandu'  },
                ].map((s,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.12)', fontSize:15.5 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(243,246,249,0.65)' }}>{s.icon} {s.label}</span>
                    <span style={{ color:SNOW, fontWeight:600 }}>{s.val}</span>
                  </div>
                ))}
                <button onClick={()=>setShowBooking(true)}
                  style={{ width:'100%', background:SAFF, color:INK, border:'none', borderRadius:8, height:54, marginTop:22, fontSize:16, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer' }}>
                  Book this trek
                </button>
                <button onClick={()=>setShowBooking(true)}
                  style={{ width:'100%', background:'transparent', color:SNOW, border:'1.5px solid rgba(255,255,255,0.4)', borderRadius:8, height:50, marginTop:12, fontSize:15, fontFamily:BODY_FONT, fontWeight:500, cursor:'pointer' }}>
                  Enquire or ask a question
                </button>
              </div>

              <div style={{ background:W, borderRadius:10, padding: isMobile ? '18px' : '22px', border:'1px solid '+BD }}>
                <h4 style={{ fontSize:21, fontFamily:HEADING_FONT, fontWeight:600, color:INK, letterSpacing:'-0.015em', margin:'0 0 16px' }}>What to pack</h4>
                {['Layered clothing (base, mid, waterproof outer)','Waterproof jacket and pants','Sturdy hiking boots — well broken in before the trip','Sleeping bag rated for 0°C','Trekking poles — essential for descents','Headlamp and spare batteries','Sunscreen SPF 50+ and good sunglasses','Water purification tablets or filter bottle'].map((item,i)=>(
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:10, fontSize:15.5, color:TX, lineHeight:1.5 }}>
                    <CheckCircle size={16} color={INK} style={{ flexShrink:0, marginTop:3 }}/>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CULTURAL ──────────────────────────────── */}
        <div style={{ background:W, padding: isMobile ? '48px 18px' : '72px 32px', borderTop:'1px solid '+BD }}>
          <div style={{ maxWidth:1160, margin:'0 auto' }}>
            <SectionTitle center mb={isMobile ? 36 : 52} size="clamp(1.8rem,5vw,2.7rem)">People, places and traditions</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:22 }}>
              {[
                { icon:<Users size={28}/>, title:'Gurung & Magar Villages', desc:'The Annapurna foothills are the ancestral homeland of the Gurung and Magar peoples — brave hill communities whose men form the legendary Gurkha regiments. Trek through ancient stone villages like Ghandruk and Chhomrong where slate-roofed houses, communal water taps, and terraced maize fields have remained largely unchanged for centuries. The warmth of teahouse families — who feed and shelter trekkers through every season — is one of the defining experiences of this route.' },
                { icon:<Heart size={28}/>, title:'Buddhist Monasteries', desc:'The Annapurna region sits at the meeting point of Hindu and Buddhist cultures. Prayer flags string the ridgelines; mani walls of carved stone line the trails; small gompa (monasteries) sit above villages at Ghandruk, Tadapani, and Chhomrong. Locals spin prayer wheels in the early morning. The mountains themselves — especially the sacred, unclimbed Machhapuchhre — are worshipped as homes of the gods.' },
                { icon:<Utensils size={28}/>, title:'Dal Bhat & Teahouse Food', desc:'Dal bhat (lentil soup with rice, vegetables, and pickles) is the backbone of Nepali mountain cooking. Every porter and guide eats it twice a day — it gives the energy needed at altitude. Along the trail you\'ll also enjoy fresh momos (dumplings), Tibetan bread, thukpa noodle soup, and sweet buffalo-milk chai. Teahouses are family-run and meals are cooked from scratch. Eating together at communal tables in the evenings is where friendships form.' },
                { icon:<MapPin size={28}/>, title:'Poon Hill Sunrise Ritual', desc:'Every morning between September and May, dozens of trekkers make the pre-dawn climb to Poon Hill (3,210m) by headtorch. The ritual is the same: reach the platform in darkness, find a spot, and wait. As the sky lightens, the outline of Annapurna I, Machhapuchhre, Hiunchuli, and Dhaulagiri materialises — and then the first sunlight hits the high snow, turning the peaks from grey to deep orange to brilliant white. It never gets old.' },
              ].map((c,i)=>(
                <div key={i} style={{ background:SNOW, borderRadius:10, padding:'26px', border:'1px solid '+BD }}>
                  <div style={{ color:INK, marginBottom:16 }}>{c.icon}</div>
                  <h3 style={{ fontSize:22, color:INK, margin:'0 0 12px', fontWeight:600, fontFamily: HEADING_FONT, letterSpacing:'-0.02em', lineHeight:1.2 }}>{c.title}</h3>
                  <p style={{ fontSize:15.5, color:TX, lineHeight:1.78, margin:0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────── */}
        <div style={{ background:BG, padding: isMobile ? '48px 18px' : '72px 32px', borderTop:'1px solid '+BD }}>
          <div style={{ maxWidth:860, margin:'0 auto' }}>
            <SectionTitle center mb={isMobile ? 32 : 48} size="clamp(1.8rem,5vw,2.6rem)">Everything you need to know before booking</SectionTitle>
            {[
              { q:'Do I need previous trekking experience?', a:'Not necessarily, but you should be physically active. If you can comfortably walk for 5–6 hours on hilly terrain, you can do this trek. Previous trekking experience is helpful but not required. Our guides set a pace appropriate for every group.' },
              { q:'What is the food like on the trail?', a:'Teahouses serve a standard trekking menu: dal bhat (the national dish of rice, lentil soup, and vegetables), noodle soup, pasta, omelettes, fried rice, momo dumplings, pancakes, and porridge. Meals are simple but nutritious. Vegetarian options are always available. Meat is possible at lower altitudes but quality and freshness becomes unreliable above Chhomrong, so we recommend avoiding it above Day 6.' },
              { q:'What kind of accommodation should I expect?', a:'Teahouses are family-run guesthouses with simple twin or double rooms, usually with a wooden bed, blankets or pillow (bring your own sleeping bag), and shared squat or Western toilet facilities. Hot showers are available for a small fee (typically NPR 200–400). Higher up (above Dovan), rooms are more basic and may be cold — this is normal and expected.' },
              { q:'Is there WiFi and mobile signal on the trail?', a:'Mobile signal (Ncell or NTC Nepal SIM) exists at most teahouses up to Chhomrong and intermittently higher up. WiFi is available at most teahouses for a small fee, though it is slow and unreliable above 3,000m. Plan to disconnect — it is one of the best parts of the experience.' },
              { q:'What is the best way to avoid altitude sickness?', a:'Walk slowly, drink 3–4 litres of water daily, avoid alcohol entirely above 2,500m, eat carbohydrate-heavy meals, and tell your guide immediately if you feel unwell. The itinerary is paced to allow proper acclimatisation — do not be tempted to rush ahead. Our guides monitor trekkers daily.' },
              { q:'Can solo travellers join a group departure?', a:'Yes. We run scheduled group departures in peak seasons (March–May and October–November) that solo trekkers can join. You will share accommodation with same-gender trekkers from your group. Private departures for solo travellers, couples, or families are available year-round at a modest supplement.' },
              { q:'What travel insurance do I need?', a:'Travel insurance that specifically covers high-altitude trekking to at least 5,000m and includes emergency helicopter evacuation is mandatory for all Heritage Journey Nepal trekkers. This is non-negotiable. Helicopter evacuations from the Annapurna region cost USD 3,000–8,000 without insurance. Recommended providers: World Nomads, True Traveller, Battleface.' },
              { q:'Can the trek be done in fewer than 14 days?', a:'The classic ABC trek can be done in 10–12 days by fit, experienced trekkers who skip the Poon Hill detour. However, we strongly recommend 14 days — the Poon Hill sunrise is one of Nepal\'s great experiences, and extra days allow for proper acclimatisation and a more relaxed pace. Rushing at altitude is unsafe and reduces enjoyment.' },
            ].map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <div style={{ background:INK, padding: isMobile ? '56px 20px' : '84px 32px', textAlign:'center', color:SNOW }}>
          <h2 style={{ fontSize:'clamp(2rem,6vw,3.4rem)', fontWeight:600, lineHeight:1.08, letterSpacing:'-0.03em', margin:'0 0 18px', fontFamily: HEADING_FONT }}>
            Ready to trek the<br/>Annapurna Sanctuary?
          </h2>
          <p style={{ fontSize: isMobile ? 17 : 19, color:'rgba(243,246,249,0.82)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
            Our expert guides are ready to customise this trek for your group — private departures available year-round.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={()=>setShowBooking(true)}
              style={{ background:SAFF, color:INK, border:'none', height:56, padding: isMobile ? '0 30px' : '0 38px', borderRadius:8, fontSize:17, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer' }}>
              Book now
            </button>
            <button onClick={()=>setShowBooking(true)}
              style={{ background:'transparent', color:SNOW, border:'2px solid rgba(255,255,255,0.55)', height:56, padding: isMobile ? '0 30px' : '0 38px', borderRadius:8, fontSize:17, fontFamily:BODY_FONT, fontWeight:500, cursor:'pointer' }}>
              Request a custom quote
            </button>
          </div>
        </div>

        {/* Mobile: keep the price and booking button always within reach */}
        {isMobile && (
          <div style={{ position:'fixed', left:0, right:0, bottom:0, zIndex:50, background:W, borderTop:'1px solid '+BD, padding:'10px 16px calc(10px + env(safe-area-inset-bottom, 0px))', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div>
              <div style={{ fontSize:13, color:MUT, lineHeight:1.2 }}>From</div>
              <div style={{ fontSize:20, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.02em', color:INK, lineHeight:1.2 }}>USD 1,290</div>
            </div>
            <button onClick={()=>setShowBooking(true)}
              style={{ background:SAFF, color:INK, border:'none', borderRadius:8, height:48, padding:'0 26px', fontSize:16, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer' }}>
              Book this trek
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnnapurnaBaseCamp;