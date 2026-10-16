import { useRef, useState, useEffect } from 'react';
import {
  Utensils, Mountain, Clock, Calendar, ArrowUpRight,
  Users, Compass, MapPin, Heart, ChevronDown,
  Wind, Sun, CloudRain, CloudSnow, Cloud, Info, CheckCircle, X, Send, BookOpen
} from 'lucide-react';
import Layout from '@/components/Layout';

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS — shared with Hero.tsx and the ABC trek page
   Night-indigo, cool snow white, saffron actions, prayer-flag red accent.
   (All hex so the `COLOR + '1f'` alpha tricks below keep working.)
══════════════════════════════════════════════════════ */
const INK   = '#0c1626';
const SNOW  = '#f3f6f9';
const SAFF  = '#f5a81c';
const RED   = '#d63a32';

const W   = '#FFFFFF';
const BG  = SNOW;       // page background
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
  trekType:'Standard 21-Day Trek', message:'',
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
          trek:        'Round Annapurna Trek — 21 Days',
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
          <p style={{ fontSize:15, color:'rgba(243,246,249,0.75)', margin:0, fontFamily:BODY_FONT }}>Round Annapurna, 21 days, from USD 1,690 per person</p>

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
                'Standard 21-Day Trek',
                'Private Group (custom dates)',
                'Photography Special (extra nights at Manang & Ghorepani)',
                'Shorter 16-Day (jeep-assisted lower sections)',
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
                  ['Trek',        'Round Annapurna Trek — 21 Days'],
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
                A Heritage Journey Nepal guide will email <strong>{form.email}</strong> within 24 hours to confirm availability and arrange next steps.
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
    brief:'A Heritage Journey Nepal representative meets you at Tribhuvan International Airport (TIA) and transfers you to your hotel in Thamel — Kathmandu\'s vibrant tourist hub. The rest of the day is yours to explore.',
    tip:'Tip: Change some cash to Nepali Rupees at the airport. USD is also accepted in most tourist areas.',
    overview:'Use the afternoon to acclimatise to Kathmandu\'s buzz. Visit Swayambhunath Stupa (the "Monkey Temple") on its hilltop above the city, or the sprawling riverside cremation ghats of Pashupatinath. In the evening we host a welcome dinner where your guide walks you through every detail of the 21 days ahead.',
  },
  {
    day:2, title:'Drive Kathmandu → Besishahar', time:'6–7 hrs drive', alt:'760m', diff:'Easy', type:'drive',
    what:'A long, scenic drive west out of the Kathmandu Valley into Lamjung District.',
    brief:'Leave Kathmandu early and drive along the Prithvi Highway, following the Trishuli and Marsyangdi rivers west. The road climbs and drops through terraced rice paddies, roadside villages, and river gorges before reaching Besishahar, the official starting point of the Annapurna Circuit.',
    tip:'Tip: The road can be bumpy in places — motion sickness tablets are worth packing if you\'re prone to travel sickness.',
    overview:'Besishahar (760m) sits low and warm compared to what\'s ahead — it\'s worth appreciating the humidity and greenery here, because within a week you\'ll be walking through alpine terrain at four times the altitude. This is also the last point with easy road access before the trail proper begins.',
  },
  {
    day:3, title:'Trek to Bahundanda', time:'5–6 hrs', alt:'1,310m', diff:'Moderate', type:'trek',
    what:'First steps on the trail — terraced fields and your first big mountain views.',
    brief:'The trek begins in earnest, following the Marsyangdi River upstream through a string of small villages and terraced farmland. The trail climbs steadily to Bahundanda, a Brahmin hilltop village with sweeping views back down the valley.',
    tip:'Tip: The final climb into Bahundanda is steep — take it slowly, this is day one of twenty-one.',
    overview:'Bahundanda (1,310m) means "hill of the Brahmins," and the village keeps that tradition alive with a school, a small monastery, and terraced fields cascading down the hillside. On a clear day you get your first distant glimpse of the Annapurna and Manaslu ranges from the ridge above the village.',
  },
  {
    day:4, title:'Trek to Chamje', time:'5–6 hrs', alt:'1,410m', diff:'Moderate', type:'trek',
    what:'Through Gurung and Tamang villages and riverside forest.',
    brief:'Descend from Bahundanda to the river, crossing several suspension bridges as the trail weaves between Gurung and Tamang settlements. The path narrows into a steep-sided gorge, with the Marsyangdi crashing through the valley floor below.',
    tip:'Tip: Look out for waterfalls tumbling straight into the river gorge — this section is one of the most dramatic of the lower trek.',
    overview:'Chamje (1,410m) is a small riverside village wedged into the gorge, with the sound of the Marsyangdi audible from every teahouse. The forest here is lush and subtropical — a world away from the high alpine terrain still nearly a week ahead.',
  },
  {
    day:5, title:'Trek to Bagarchhap', time:'6 hrs', alt:'2,160m', diff:'Moderate', type:'trek',
    what:'Into pine and oak forest, at the foot of Lamjung Himal.',
    brief:'Climb out of the gorge through pine and oak forest, passing the village of Tal — the first proper Manang-style settlement, with flat stone-paved streets and Tibetan-influenced architecture. Continue to Bagarchhap, a traditional village with strong Tibetan Buddhist character.',
    tip:'Tip: The architecture noticeably changes here — flat roofs replace the sloped roofs of the lower villages, built for the drier, harsher climate ahead.',
    overview:'Bagarchhap (2,160m) sits beneath the towering wall of Lamjung Himal (6,986m). The village\'s stone houses, prayer wheels, and chörtens mark the transition into the culturally Tibetan upper Manang region — a completely different world from the Kathmandu Valley you left three days ago.',
  },
  {
    day:6, title:'Trek to Chame', time:'5–6 hrs', alt:'2,710m', diff:'Moderate', type:'trek',
    what:'To the administrative heart of Manang district.',
    brief:'Continue up the valley through more Gurung and Tibetan villages, with the trail alternating between forest and open riverside sections. Chame is the district headquarters of Manang and has the last real "town" amenities before the high country — a bank, a health post, and hot springs.',
    tip:'Tip: Chame has natural hot springs beside the river — a perfect way to ease trail-weary legs before the terrain gets harder.',
    overview:'Chame (2,710m) marks a shift in the landscape: apple orchards begin to appear, the air is noticeably drier, and towering rock walls close in on both sides of the valley. This is also where the imposing granite slab of Paungda Danda first comes into view — a curved rock face said to be sacred to the dead.',
  },
  {
    day:7, title:'Trek to Pisang', time:'5–6 hrs', alt:'3,300m', diff:'Moderate', type:'trek',
    what:'Dramatic views of Annapurna II and Pisang Peak as the valley opens up.',
    brief:'Cross beneath the giant curved rock face of Paungda Danda and continue up the valley as pine forest gradually gives way to more open, arid terrain. The trail forks at Pisang into a lower and upper route — most groups take the more scenic upper trail with better mountain views.',
    tip:'Tip: If your legs are feeling strong, ask your guide about the upper Pisang trail — it adds views of Annapurna II (7,937m) without significantly increasing walking time.',
    overview:'Pisang (3,300m) is the first proper Tibetan-style village of the upper Manang valley, with flat-roofed stone houses, a monastery on the hillside, and long mani walls lining the trail. Annapurna II now dominates the skyline, and the character of the trek has shifted decisively toward high-altitude Himalaya.',
  },
  {
    day:8, title:'Trek to Manang', time:'6–7 hrs', alt:'3,540m', diff:'Moderate', type:'trek',
    what:'Into the wide, dramatic Manang valley — your acclimatisation base.',
    brief:'Trek along the widening Manang valley, with the option to take the higher, more scenic route via Ghyaru and Ngawal — dramatic hillside villages with some of the best mountain panoramas of the entire trek. Descend into Manang, the largest settlement on the circuit and the key acclimatisation stop before the pass.',
    tip:'Tip: The high route via Ghyaru adds around 400m of extra ascent but is widely considered worth it for the views of Annapurna III, Gangapurna, and Tilicho Peak.',
    overview:'Manang (3,540m) is a proper Himalayan town: bakeries, gear shops, a cinema showing mountaineering documentaries, and dozens of teahouses serving trekkers preparing for Thorong La. It sits beneath the hanging glacier of Gangapurna, with turquoise Gangapurna Lake visible just below the village.',
  },
  {
    day:9, title:'Acclimatisation Day in Manang', time:'3–5 hrs hike', alt:'3,540m–4,000m', diff:'Easy', type:'trek',
    what:'The golden rule of altitude: climb high, sleep low. Today you do both.',
    brief:'A rest day is not a lazy day at altitude — it is a survival strategy. Hike up to the Gangapurna viewpoint or further to Ice Lake / Milarepa\'s Cave (around 4,000–4,600m) for expansive views over Manang and the surrounding peaks, then return to sleep at 3,540m. This "climb high, sleep low" pattern is the single most important factor in a safe crossing of Thorong La.',
    tip:'Tip: The Himalayan Rescue Association runs a free daily altitude talk in Manang during trekking season — attending is genuinely useful, not just a formality.',
    overview:'The hike above Manang reveals the true scale of the valley: Annapurna III, Gangapurna, and Tilicho Peak rise directly across from the village, while glaciers calve visibly into Gangapurna Lake below. Back in Manang, browse the gear shops, eat well, and rest — the days ahead climb over 1,800m to the highest point of the trek.',
  },
  {
    day:10, title:'Trek to Yak Kharka', time:'4–5 hrs', alt:'4,020m', diff:'Moderate', type:'trek',
    what:'Above the treeline into open alpine pasture.',
    brief:'Leave Manang and climb steadily above the treeline into high alpine terrain. The trail follows the Jargeng Khola through dwarf juniper scrub and open meadows grazed by yaks and blue sheep, arriving at the small settlement of Yak Kharka.',
    tip:'Tip: Walk slowly and deliberately from here on — you are now firmly in altitude-sickness territory, and pace matters more than speed.',
    overview:'Yak Kharka (4,020m) means "yak pasture," and the name is accurate — herds graze the surrounding slopes right up to the teahouse doors. The landscape is stark and beautiful: bare rock, sparse grass, and enormous open sky. This is where the trek starts to feel genuinely high-altitude.',
  },
  {
    day:11, title:'Trek to Thorong Phedi', time:'4–5 hrs', alt:'4,540m', diff:'Moderate', type:'trek',
    what:'To the base of Thorong La — tomorrow\'s big day starts here.',
    brief:'A relatively short but high day, climbing steadily to Thorong Phedi ("foot of the pass") at the base of the Thorong La climb. Some trekkers push on an extra hour to High Camp (4,850m) to shorten the summit day, though Phedi remains the more common overnight stop.',
    tip:'Tip: Pack your bag the night before and lay out every layer you\'ll need — tomorrow starts in the dark, often below −15°C.',
    overview:'Thorong Phedi (4,540m) is a cluster of teahouses pressed against a steep scree slope, with the pass itself hidden from view above. The atmosphere is tense and excited in equal measure — every trekker in the teahouse is here for the same reason, and conversation over dinner inevitably turns to tomorrow\'s pre-dawn start.',
  },
  {
    day:12, title:'Cross Thorong La Pass to Muktinath', time:'8–10 hrs', alt:'5,416m', diff:'Challenging', type:'summit',
    what:'THE day. The highest point of the entire trek — and one of the highest trekking passes on Earth.',
    brief:'Wake at 3–4am and begin the long, steep climb by headtorch. The ascent to Thorong La (5,416m) takes 5–6 hours through cold, thin air and often snow underfoot. At the top, prayer flags mark the highest point of the journey, with panoramic views over the Mustang and Annapurna ranges. Then begins a long, knee-jarring 1,600m descent to the sacred town of Muktinath.',
    tip:'Tip: This is the longest and highest day of the trek. Start early, keep a steady pace, and do not linger long at the top — the descent is where knees and energy really get tested.',
    overview:'Standing at Thorong La (5,416m) — higher than Everest Base Camp — with prayer flags snapping in the wind and the arid Mustang plateau spreading out below, is the emotional peak of the Annapurna Circuit. The descent into Muktinath (3,760m) drops you into a completely different landscape: dry, wind-carved, and Tibetan in character. Muktinath itself is one of the holiest pilgrimage sites in Nepal, sacred to both Hindus and Buddhists.',
  },
  {
    day:13, title:'Trek to Marpha', time:'4–5 hrs', alt:'2,670m', diff:'Moderate', type:'trek',
    what:'Down into the Kali Gandaki valley — apple country.',
    brief:'Descend from Muktinath through Jomsom, the administrative centre of the Mustang region and a major airstrip town, then continue down the windy Kali Gandaki valley — the world\'s deepest gorge — to Marpha, famous across Nepal for its apple orchards and distilleries.',
    tip:'Tip: The Kali Gandaki valley is notoriously windy from late morning onward — start early to walk in calmer conditions.',
    overview:'Marpha (2,670m) is one of the prettiest villages on the circuit: whitewashed stone houses, narrow cobbled lanes, and the smell of apple brandy distilling in small local operations. After the stark high pass, the orchards and gentler pace of Marpha feel like a genuine reward.',
  },
  {
    day:14, title:'Trek to Kalopani', time:'6–7 hrs', alt:'2,530m', diff:'Moderate', type:'trek',
    what:'Along the banks of the Kali Gandaki, beneath Dhaulagiri and Annapurna.',
    brief:'Continue down the wide, windswept Kali Gandaki valley, walking on riverbed trails and quiet forest paths between the Dhaulagiri massif on one side and the Annapurna range on the other — arguably the deepest river gorge in the world.',
    tip:'Tip: On clear mornings, Dhaulagiri (8,167m) looms enormously close from the valley floor — have your camera ready before the afternoon cloud builds.',
    overview:'Kalopani (2,530m) sits directly beneath Dhaulagiri\'s massive south face, with Annapurna I visible on the opposite side of the gorge. Very few places on Earth let you stand between two 8,000m peaks at once — this is one of them.',
  },
  {
    day:15, title:'Trek to Tatopani', time:'6–7 hrs', alt:'1,190m', diff:'Moderate', type:'trek',
    what:'Descending into warmth — and natural hot springs.',
    brief:'A long descent through changing vegetation zones as the trail drops back into subtropical terrain, passing waterfalls and terraced farmland. Tatopani — literally "hot water" in Nepali — is famous for its natural hot spring pools beside the river.',
    tip:'Tip: Save your aching legs for the hot springs — they are genuinely one of the best parts of the whole trek after twelve days of walking.',
    overview:'Tatopani (1,190m) feels like a different country from Thorong La just three days earlier — banana trees, citrus orchards, and warm evening air replace the alpine cold. The natural hot spring pools right beside the Kali Gandaki are the perfect place to soak out two weeks of trail fatigue.',
  },
  {
    day:16, title:'Trek to Ghorepani', time:'6–7 hrs', alt:'2,860m', diff:'Moderate', type:'trek',
    what:'A long, steep climb back into the clouds — but the reward is close.',
    brief:'Climb steadily out of the Kali Gandaki valley through dense rhododendron and oak forest, gaining nearly 1,700m over the day. Ghorepani sits on a high ridge and is the staging point for the famous Poon Hill sunrise the following morning.',
    tip:'Tip: This is one of the toughest climbing days of the whole trek — pace yourself, and know that the rhododendron forest is spectacular if you\'re trekking in March–April.',
    overview:'Ghorepani (2,860m) is a purpose-built trekking village, busy and welcoming, with excellent bakeries and lodges. Everyone here has the same plan for tomorrow morning: a 4:30am headtorch climb to Poon Hill for one of the most famous sunrises in the world.',
  },
  {
    day:17, title:'Poon Hill Sunrise → Trek to Tadapani', time:'6–7 hrs total', alt:'3,210m high point', diff:'Moderate', type:'sunrise',
    what:'THE iconic moment — sunrise over Dhaulagiri and Annapurna from Poon Hill.',
    brief:'Wake at 4:30am and climb by headtorch to the Poon Hill viewpoint (3,210m). Watch the sun rise over an extraordinary panorama: Dhaulagiri, Annapurna South, Annapurna I, Machhapuchhre (Fishtail), and Nilgiri all catch the first light in sequence. Return to Ghorepani for breakfast, then trek onward through rhododendron forest to Tadapani.',
    tip:'Tip: Poon Hill gets busy in peak season — arrive a little early to find a good spot before the ridge fills up with fellow trekkers.',
    overview:'Poon Hill is one of the most photographed viewpoints in the Himalaya, and for good reason: an unbroken 180-degree wall of 7,000m and 8,000m peaks lit gold in sequence as the sun rises. The walk onward to Tadapani, through some of the densest rhododendron forest on the circuit, is a quieter, greener contrast to the drama of the morning.',
  },
  {
    day:18, title:'Trek to Ghandruk', time:'5–6 hrs', alt:'1,940m', diff:'Easy', type:'trek',
    what:'Into one of the most picturesque Gurung villages in Nepal.',
    brief:'Descend through forest and terraced farmland to Ghandruk, a large traditional Gurung village built from stone with slate roofs, arranged in tiers up the hillside with Annapurna South and Machhapuchhre framing the view.',
    tip:'Tip: Visit the Gurung Museum in Ghandruk — a small but fascinating collection covering Gurkha military history and traditional Gurung culture.',
    overview:'Ghandruk (1,940m) is often cited as the prettiest village on the entire circuit: neat stone houses, prayer flags, and terraced fields stacked beneath a jaw-dropping Annapurna backdrop. It\'s also a major centre of Gurkha heritage — many households have generations of British and Indian Army service.',
  },
  {
    day:19, title:'Trek to Nayapul → Drive to Pokhara', time:'4–5 hrs walk', alt:'827m', diff:'Easy', type:'trek',
    what:'The final walking day, then a well-earned lakeside rest in Pokhara.',
    brief:'Descend through the last of the terraced hillside villages to Nayapul, the trailhead where the road begins. From here it\'s a scenic drive to Pokhara, Nepal\'s laid-back lakeside city, where a comfortable hotel, good coffee, and Phewa Lake await.',
    tip:'Tip: Book an extra rest day in Pokhara if your schedule allows — it\'s one of the most relaxing places in Nepal to recover before flying home.',
    overview:'Arriving in Pokhara (827m) after nineteen days on the trail feels like a genuine reward: warm air, real coffee, and a view of the entire Annapurna range reflected in Phewa Lake. Explore the lakeside strip, take a boat out to the island temple, or simply do nothing for an afternoon.',
  },
  {
    day:20, title:'Drive Pokhara → Kathmandu', time:'6–7 hrs drive', alt:'1,400m', diff:'Easy', type:'drive',
    what:'Back to the capital for a farewell celebration.',
    brief:'Drive back to Kathmandu along the same scenic highway, retracing the route from three weeks earlier — though everything about how you see it now has changed. Transfer to your hotel in Thamel, with the evening free before a Heritage Journey Nepal farewell dinner.',
    tip:'Tip: The farewell dinner is where you get your trek certificate and hear stories from your guide about seasons past. Don\'t skip it.',
    overview:'The drive back into the Kathmandu Valley closes the loop on a genuine circuit — you\'ve walked in a complete arc around the Annapurna massif, from subtropical valley to 5,416m pass and back down to lakeside Pokhara. The farewell dinner brings the whole group together to mark what you\'ve shared.',
  },
  {
    day:21, title:'Departure from Kathmandu', time:'—', alt:'—', diff:'Easy', type:'city',
    what:'Time to fly home — carrying the Himalaya with you.',
    brief:'Depending on your flight time, the morning is free for last-minute shopping in Thamel or a final visit to Boudhanath or Pashupatinath. Your guide transfers you to Tribhuvan International Airport (TIA) with plenty of time before departure.',
    tip:'Tip: Allow at least 3 hours before your international departure — TIA check-in queues can be very long in peak season.',
    overview:'You leave Nepal having completed one of the great classic circuits of the Himalaya: crossing Thorong La at 5,416m, walking through Gurung, Manangi, and Thakali villages, soaking in hot springs, and watching the sun rise over Dhaulagiri from Poon Hill. Over 200km and three weeks — this is the kind of journey people spend the rest of their lives telling stories about.',
  },
];

const gallery = [
  { src:'/images/trekking/circuit/thorangla-1.jpg', alt:'Thorong La Pass',        caption:'Prayer flags at Thorong La Pass — 5,416m, the highest point of the circuit' },
  { src:'/images/trekking/circuit/thorangla-2.jpg', alt:'Mountain panorama',      caption:'Annapurna and Dhaulagiri seen from the high Manang valley' },
  { src:'/images/trekking/circuit/thorangla-3.jpg', alt:'Himalayan landscapes',   caption:'The trail winding through the arid upper Kali Gandaki valley' },
  { src:'/images/trekking/circuit/thorangla-4.jpg', alt:'Traditional villages',   caption:'Stone-built Gurung and Manangi villages along the route' },
  { src:'/images/trekking/circuit/thorangla-5.jpg', alt:'Local culture',          caption:'Sunrise over the Annapurna range from Poon Hill' },
];

const weatherData = [
  { m:'Jan', lo:-10, hi:5,  cond:'snow',  ok:false },
  { m:'Feb', lo:-8,  hi:8,  cond:'snow',  ok:false },
  { m:'Mar', lo:-5,  hi:12, cond:'mixed', ok:true  },
  { m:'Apr', lo:0,   hi:15, cond:'cloud', ok:true  },
  { m:'May', lo:5,   hi:18, cond:'cloud', ok:true  },
  { m:'Jun', lo:10,  hi:20, cond:'rain',  ok:false },
  { m:'Jul', lo:12,  hi:20, cond:'rain',  ok:false },
  { m:'Aug', lo:12,  hi:20, cond:'rain',  ok:false },
  { m:'Sep', lo:8,   hi:18, cond:'mixed', ok:true  },
  { m:'Oct', lo:3,   hi:15, cond:'sun',   ok:true  },
  { m:'Nov', lo:-2,  hi:12, cond:'sun',   ok:true  },
  { m:'Dec', lo:-8,  hi:8,  cond:'snow',  ok:false },
];

const includes = [
  'Airport transfers and all ground transportation',
  '2 nights hotel in Kathmandu (3-star, twin share)',
  'Private ground transport: Kathmandu–Besishahar & Pokhara–Kathmandu',
  'All teahouse accommodation during the trek (18 nights)',
  'All meals during the trek (breakfast, lunch, dinner)',
  'Licensed English-speaking trekking guide',
  'Porter (1 per 2 trekkers, max 15kg per porter)',
  'Annapurna Conservation Area Permit (ACAP) and TIMS card',
  'First-aid kit and emergency evacuation plan',
  'Farewell dinner and trek certificate in Kathmandu',
];

const excludes = [
  'International flights to/from Nepal',
  'Nepal visa on arrival (~USD 50)',
  'Travel and health insurance (mandatory)',
  'Personal trekking gear and equipment',
  'Hot showers and device charging fees on trail',
  'Tips for guide and porter (customary)',
  'Personal expenses and souvenirs',
  'Any costs due to road closures or weather delays',
];

/* ── WAYPOINTS FOR MAP ──────────────────────────────── */
type Waypoint = {
  x: number; y: number; label: string; day: string | number;
  start?: boolean; city?: boolean; peak?: boolean; special?: boolean;
};

const waypoints: Waypoint[] = [
  { x:250, y:650, label:'Kathmandu',        day:'1, 20–21', start:true },
  { x:205, y:600, label:'Besishahar',       day:2, city:true  },
  { x:190, y:545, label:'Bahundanda',       day:3 },
  { x:178, y:495, label:'Chamje',           day:4 },
  { x:168, y:440, label:'Bagarchhap',       day:5 },
  { x:158, y:385, label:'Chame',            day:6 },
  { x:150, y:330, label:'Pisang',           day:7 },
  { x:148, y:278, label:'Manang',           day:'8, 9', city:true },
  { x:168, y:232, label:'Yak Kharka',       day:10 },
  { x:190, y:192, label:'Thorong Phedi',    day:11 },
  { x:224, y:150, label:'Thorong La ▲ 5,416m', day:12, peak:true },
  { x:260, y:180, label:'Muktinath',        day:12 },
  { x:282, y:225, label:'Marpha',           day:13 },
  { x:292, y:272, label:'Kalopani',         day:14 },
  { x:298, y:328, label:'Tatopani',         day:15 },
  { x:292, y:382, label:'Ghorepani',        day:16 },
  { x:266, y:362, label:'Poon Hill ★',      day:17, special:true },
  { x:302, y:428, label:'Tadapani',         day:17 },
  { x:312, y:478, label:'Ghandruk',         day:18 },
  { x:322, y:538, label:'Pokhara',          day:19, city:true },
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
            onMouseEnter={e => (e.currentTarget.style.transform='scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'40px 18px 16px', background:'linear-gradient(transparent,rgba(12,22,38,0.7))' }}>
            <p style={{ color:W, fontSize:15, fontFamily:BODY_FONT, margin:0 }}>{gallery[0].caption}</p>
          </div>
        </div>
        {gallery.slice(1).map((img,i) => (
          <div key={i} onClick={() => setLb(i+1)} style={{ borderRadius:10, overflow:'hidden', cursor:'zoom-in', position:'relative', background:BD }}>
            <img src={img.src} alt={img.alt} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.4s' }}
              onMouseEnter={e => (e.currentTarget.style.transform='scale(1.06)')}
              onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}/>
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
  const returnPts = [{x:322,y:538},{x:400,y:590},{x:250,y:650}];
  return (
    <div style={{ background:'#eaf0f5', borderRadius:10, overflow:'hidden', border:'1px solid '+BD }}>
      <svg width="100%" viewBox="0 0 500 700" style={{ display:'block' }} role="img" aria-label="Route map of the Round Annapurna circuit">
        <defs>
          <pattern id="tp" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
            <ellipse cx="35" cy="35" rx="33" ry="24" fill="none" stroke={BD} strokeWidth="0.5" opacity="0.7"/>
            <ellipse cx="35" cy="35" rx="20" ry="14" fill="none" stroke={BD} strokeWidth="0.4" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="500" height="700" fill="#eaf0f5"/>
        <rect width="500" height="700" fill="url(#tp)"/>
        <polygon points="168,80 220,158 116,158" fill={W} opacity="0.95"/>
        <polygon points="220,68 270,158 170,158" fill={W} opacity="0.9"/>
        <polygon points="125,96 162,158 88,158" fill={W} opacity="0.75"/>
        <polygon points="262,82 302,158 222,158" fill={W} opacity="0.85"/>
        <polygon points="168,80 220,158 116,158" fill={INK} opacity="0.06"/>
        <text x="196" y="60" textAnchor="middle" fontSize="10" fill={TX} opacity="0.8">Annapurna Himalaya</text>
        <path d={buildPath(returnPts)} fill="none" stroke={INK} strokeWidth="2" strokeDasharray="5 4" opacity="0.35"/>
        <path d={buildPath(waypoints)} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
        {waypoints.map((pt,i) => {
          const r = pt.peak?12:pt.start?10:pt.city?9:pt.special?8:6;
          const fill = (pt.peak||pt.special)?SAFF:(pt.start||pt.city)?INK:TX;
          const side = pt.x < 320 ? 'right' : 'left';
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
        <rect x="12" y="12" width="168" height="102" rx="8" fill={W} opacity="0.95"/>
        <text x="24" y="30" fontSize="10" fontWeight="700" fill={INK}>Legend</text>
        <line x1="24" y1="43" x2="56" y2="43" stroke={INK} strokeWidth="4.5" strokeLinecap="round"/>
        <text x="62" y="46" fontSize="9" fill={TX}>Trek circuit route</text>
        <line x1="24" y1="57" x2="56" y2="57" stroke={INK} strokeWidth="2" strokeDasharray="5 4" opacity="0.5"/>
        <text x="62" y="60" fontSize="9" fill={TX}>Road transfer</text>
        <circle cx="30" cy="75" r="6" fill={SAFF} stroke={W} strokeWidth="2"/>
        <text x="42" y="75" dominantBaseline="central" fontSize="9" fill={TX}>Thorong La Pass</text>
        <circle cx="30" cy="90" r="6" fill={INK} stroke={W} strokeWidth="2"/>
        <text x="42" y="90" dominantBaseline="central" fontSize="9" fill={TX}>Kathmandu (start/end)</text>
        <circle cx="30" cy="105" r="6" fill={INK} stroke={W} strokeWidth="2"/>
        <text x="42" y="105" dominantBaseline="central" fontSize="9" fill={TX}>Manang / Pokhara</text>
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
  const alts=[1400,760,1310,1410,2160,2710,3300,3540,3540,4020,4540,5416,2670,2530,1190,2860,3210,1940,827,1400,1400];
  const MIN=500,MAX=6000,VW=680,VH=140,pL=44,pR=12,pT=12,pB=32;
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
      <p style={{ fontSize:18, color:INK, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', margin:'0 0 10px '+pL+'px' }}>Elevation profile, days 1–21</p>
      <svg width="100%" viewBox={'0 0 '+VW+' '+VH} role="img" aria-label="Elevation profile peaking at 5,416 metres on day 12">
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={INK} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={INK} stopOpacity="0.03"/>
          </linearGradient>
        </defs>
        {[1000,2000,3000,4000,5000].map(a=>(
          <g key={a}>
            <line x1={pL} y1={yF(a)} x2={VW-pR} y2={yF(a)} stroke={BD} strokeWidth="0.6" strokeDasharray="3 3"/>
            <text x={pL-5} y={yF(a)} textAnchor="end" dominantBaseline="central" fontSize="8" fill={MUT}>{a/1000}k</text>
          </g>
        ))}
        <path d={fd} fill="url(#eg)"/>
        <path d={d} fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round"/>
        <circle cx={pL+11*xS} cy={yF(5416)} r="5" fill={SAFF} stroke={INK} strokeWidth="2"/>
        <text x={pL+11*xS} y={yF(5416)-11} textAnchor="middle" fontSize="9" fill={INK} fontWeight="700">Thorong La 5,416m</text>
        <circle cx={pL+16*xS} cy={yF(3210)} r="4" fill={W} stroke={INK} strokeWidth="1.5"/>
        <text x={pL+16*xS+4} y={yF(3210)-9} textAnchor="start" fontSize="8" fill={INK} fontWeight="700">Poon Hill 3,210m</text>
        {alts.map((_,i)=><text key={i} x={pL+i*xS} y={VH-5} textAnchor="middle" fontSize="7" fill={MUT}>{i+1}</text>)}
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
        <span style={{ fontSize:19, fontWeight:600, color: INK, fontFamily: HEADING_FONT, lineHeight:1.3, letterSpacing:'-0.01em' }}>{q}</span>
        <ChevronDown size={20} color={INK} style={{ flexShrink:0, transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.25s' }}/>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow:'hidden', transition:'max-height 0.4s ease' }}>
        <p style={{ fontSize:16, color:TX, lineHeight:1.78, paddingBottom:20, margin:0 }}>{a}</p>
      </div>
    </div>
  );
};

/* ── MAIN PAGE ──────────────────────────────────────── */
const RoundAnnapurnaTrek = () => {
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
          <div style={{ position:'absolute', inset:0, backgroundImage:'url(/images/trekking/circuit/thorangla-1.jpg)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.95) contrast(1.06) saturate(0.95)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(12,22,38,0.5), rgba(12,22,38,0.8))' }}/>

          <div style={{ position:'relative', zIndex:2, textAlign:'center', padding: isMobile ? '110px 20px 70px' : '150px 32px 100px', maxWidth:900 }}>
            <p style={{ fontSize:16, fontWeight:500, color:'rgba(243,246,249,0.85)', margin:'0 0 16px' }}>
              Trekking in the Annapurna region
            </p>
            <h1 style={{ fontSize:'clamp(3rem,9vw,6.2rem)', fontWeight:600, lineHeight:1.02, color:SNOW, margin:'0 0 22px', textShadow:'0 2px 24px rgba(12,22,38,0.5)', letterSpacing:'-0.03em', fontFamily: HEADING_FONT }}>
              Round<br/>Annapurna Trek
            </h1>
            <p style={{ fontSize:'clamp(1.05rem,2.4vw,1.3rem)', color:'rgba(243,246,249,0.9)', lineHeight:1.7, maxWidth:600, margin: isMobile ? '0 auto 28px' : '0 auto 36px' }}>
              Journey Through the Heart of the Himalayas<br/>
              <span style={{ fontSize:'0.88em', color:'rgba(243,246,249,0.75)' }}>
                21 days, a complete circuit around the Annapurna massif
              </span>
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap: isMobile ? 8 : 12, justifyContent:'center', marginBottom: isMobile ? 32 : 44 }}>
              {[{icon:<Clock size={16}/>,label:'21 days'},{icon:<Mountain size={16}/>,label:'5,416m max'},{icon:<Compass size={16}/>,label:'Moderate–Challenging'},{icon:<Calendar size={16}/>,label:'Mar–May, Sep–Nov'}].map((s,i)=>(
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
            {[{label:'Duration',val:'21 days'},{label:'Max altitude',val:'5,416m'},{label:'Daily walking',val:'5–7 hrs'},{label:'Trek distance',val:'~200 km'},{label:'Group size',val:'2–12'},{label:'Start / end',val:'Kathmandu'}].map((f,i,arr)=>(
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
                <SectionTitle mb={22} size="clamp(2rem,5vw,3.1rem)">A complete circuit around the Annapurna massif</SectionTitle>

                {/* Plain-language explainer boxes */}
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : '28px 44px', marginBottom:32 }}>
  {[
    { title:'What is this trek?', text:'A 21-day guided walking circuit around the Annapurna massif, crossing Thorong La Pass at 5,416m and finishing with the classic Poon Hill sunrise. No climbing equipment or mountaineering experience needed.' },
    { title:'How fit do I need to be?', text:'You should be able to walk 5–7 hours a day at altitude on varied terrain, for many days in a row. No technical climbing is required, but good cardiovascular fitness and a structured preparation programme are essential, especially for pass-crossing day.' },
    { title:'Where do you sleep?', text:'In teahouses: family-run guesthouses with simple rooms and warm communal dining halls. Rooms get more basic (and colder) near Thorong La, then warmer and more comfortable again on the Ghorepani to Pokhara side.' },
    { title:'Where does it go?', text:'From Kathmandu you drive to Besishahar and trek north through the Manang valley to Thorong La Pass, descend to Muktinath and the Kali Gandaki gorge, then loop back over Poon Hill through Ghandruk to Pokhara and Kathmandu.' },
  ].map((box, i) => (
    <div key={i} style={{ borderTop:'3px solid '+INK, paddingTop:14 }}>
      <h3 style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', lineHeight:1.25, margin:'0 0 8px' }}>{box.title}</h3>
      <p style={{ fontSize:15.5, color:TX, lineHeight:1.7, margin:0 }}>{box.text}</p>
    </div>
  ))}
</div>

                <p style={{ ...bodyText, marginBottom:16 }}>
                  The Round Annapurna Trek is one of the most culturally diverse and complete long-distance treks on Earth — a 21-day circuit that begins in subtropical farmland, climbs through pine forest and Tibetan-influenced villages, crosses the 5,416m Thorong La Pass, drops into the arid Mustang region, and loops back over the famous Poon Hill viewpoint before descending to lakeside Pokhara.
                </p>
                <p style={bodyText}>
                  The emotional peak is Thorong La itself — one of the highest trekking passes in the world — but the journey is remarkable throughout: the hot springs of Tatopani, the apple orchards of Marpha, the sunrise panorama from Poon Hill, and the stone-built Gurung villages of Ghandruk. Few treks anywhere pack in this much landscape, culture, and altitude change in a single continuous route.
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
      'Crossing Thorong La Pass (5,416m), one of the highest trekking passes in the world',
      'Sunrise from Poon Hill over Dhaulagiri, Annapurna and Machhapuchhre',
      'Walking beneath the sacred cliff of Paungda Danda near Chame',
      'Soaking in the natural hot springs at Tatopani after two weeks on the trail',
      'Visiting Muktinath, a sacred pilgrimage site for both Hindus and Buddhists',
      'Strolling through the apple orchards and distilleries of Marpha',
      'Walking between two 8,000m giants in the Kali Gandaki, the world\'s deepest gorge',
      'Gurung, Manangi and Thakali culture across four distinct regions',
    ].map((h, i) => (
      <p key={i} style={{ margin:0, padding:'15px 0', borderTop:'1px solid '+BD, fontSize:16.5, lineHeight:1.55, color:INK }}>
        {h}
      </p>
    ))}
  </div>
</section>

              {/* Permits */}
             <section style={{ marginBottom: isMobile ? 44 : 60 }}>
  <SectionTitle>What paperwork do you need?</SectionTitle>
  <p style={{ ...bodyText, marginBottom:28 }}>
    Two permits are required for the Round Annapurna Trek. Heritage Journey Nepal arranges both on your behalf and includes them in the trip price. You simply carry the documents and show them at checkpoints along the route.
  </p>
  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 40 }}>
    {[
      { title:'ACAP: Annapurna Conservation Area Permit', cost:'NPR 3,000 (about USD 22)', detail:'Required for entry into the Annapurna Conservation Area, Nepal\'s largest protected area, which covers the entire circuit. It is checked at several points along the route, including Besishahar and again near Ghorepani. Your guide carries all permits, you just need to be there for the checkpoint.' },
      { title:'TIMS: Trekkers\' Information Management System', cost:'NPR 2,000 (about USD 15)', detail:'A national registration card required for all trekkers in Nepal. Your name, nationality and emergency contact details are logged so search and rescue can be coordinated if needed. Carry it with your passport at all times on the trail.' },
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
    Thorong La Pass sits at 5,416m, higher than Everest Base Camp, and is crossed in a single long day. At these elevations altitude sickness (Acute Mountain Sickness, or AMS) is a real and serious concern. The itinerary includes a dedicated acclimatisation day in Manang to reduce the risk before the pass.
  </p>
 
  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 28 : 36, marginBottom:28 }}>
    {[
      { heading:'Mild symptoms', serious:false, items:['Headache, especially after arriving at altitude','Tiredness beyond normal trekking fatigue','Loss of appetite or nausea','Dizziness or light-headedness','Difficulty sleeping'] },
      { heading:'Serious symptoms: descend immediately', serious:true, items:['Severe headache that paracetamol does not ease','Vomiting, unable to keep fluids down','Loss of coordination or stumbling','Confusion or unusual drowsiness','Cough or breathlessness even at rest'] },
      { heading:'Prevention', serious:false, items:['Walk slowly. "Bistari bistari" means slowly slowly','Drink 4–5 litres of water a day above 3,500m','Avoid alcohol entirely above 3,000m','Eat well, with plenty of carbohydrates like dal bhat','Never cross Thorong La with unresolved AMS symptoms'] },
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
    <strong>Our guides are trained in wilderness first aid and altitude medicine.</strong> If you show serious AMS symptoms, your guide will make the call straight away to descend or delay the pass crossing. That is not up for debate, because going down is the most effective treatment there is. We carry supplemental oxygen and a Gamow bag above Manang, and keep 24-hour helicopter evacuation capability.
  </p>
</section>

              {/* Fitness Guide */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
  <SectionTitle>How to prepare your body for 21 days on the trail</SectionTitle>
  <p style={{ ...bodyText, marginBottom:28 }}>
    This trek is demanding not because any single day is extreme, but because of its length: three weeks of consecutive walking that end with a very long, high pass-crossing day. Start a dedicated training programme at least 10–12 weeks before departure.
  </p>
 
  <div style={{ borderBottom:'1px solid '+BD }}>
    {[
      { title:'10–12 weeks before', items:['Walk or hike 4–5 times a week, building up to 2+ hours a session','Include real elevation gain in every outdoor session','Start stair climbing with a loaded pack (begin with 6kg)','Run, cycle or swim 3 times a week for a cardio base','Read up on altitude sickness and talk to your doctor about Diamox'] },
      { title:'6–8 weeks before', items:['Do two 6–8 hour hikes on consecutive days with a full pack','Build your pack weight up to 8–10kg for training hikes','Practise descents, because the Thorong La and Ghorepani descents are hard on the knees','Get used to drinking 4+ litres of water a day','Book your travel health appointment and check your vaccinations'] },
      { title:'2–4 weeks before', items:['Keep the frequency but ease off the intensity','Make sure your boots are fully broken in, with no new footwear on the trail','Do a full kit check, including in cold conditions','Confirm your insurance covers high-altitude trekking to at least 6,000m','Read up on Gurung, Manangi and Thakali culture along the route'] },
      { title:'On the trek', items:['Walk at the pace of the slowest person, which matters most at altitude','Use the acclimatisation day in Manang properly: hike high, sleep low','Eat every meal, even if you have no appetite','Tell your guide honestly how you feel every morning','The mountains will always be there, and your safety comes first'] },
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
                  Full route: <strong>Kathmandu → Besishahar → Manang → Thorong La Pass → Muktinath → Marpha → Ghorepani → Poon Hill → Ghandruk → Pokhara → Kathmandu</strong>. {!isMobile && 'Hover any point to see which day you pass through.'}
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
                        { season:'Spring (Mar–May)', text:'The most popular season. Rhododendrons bloom around Ghorepani and Tadapani, skies are generally clear, and the trail is busy with trekkers heading for Thorong La. The best photography light is in March and April.' },
                        { season:'Autumn (Sep–Nov)', text:'Crystal-clear skies post-monsoon, sharp mountain views, and the driest trail conditions. October is widely considered the perfect month for the circuit — stable weather, good visibility, and ideal temperatures for the pass crossing.' },
                        { season:'Winter (Dec–Feb)', text:'Extreme cold at Thorong La, with heavy snowfall that can close the pass entirely for days at a time. Technically possible in the shoulder weeks but risky; many teahouses in Manang close. Not recommended for first-timers.' },
                        { season:'Monsoon (Jun–Aug)', text:'Heavy rain, leeches on the lower forested sections, cloud cover obscuring views, and landslide risk. The Mustang side beyond Muktinath stays relatively dry (rain shadow), but the approach and Poon Hill sections are not recommended.' },
                      ].map((s,i)=>(
                        <div key={i} style={{ background:W, border:'1px solid '+BD, borderRadius:10, padding:'16px 18px' }}>
                          <div style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', marginBottom:8 }}>{s.season}</div>
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
                  USD 1,690
                  <span style={{ fontSize:16, fontWeight:400, color:'rgba(243,246,249,0.6)', marginLeft:8, letterSpacing:0, fontFamily:BODY_FONT }}>per person</span>
                </div>
                <div style={{ fontSize:14, color:'rgba(243,246,249,0.6)', marginBottom:24 }}>Based on 2+ trekkers, all inclusive</div>
                {[
                  {icon:<Clock size={15}/>,    label:'Duration',     val:'21 days'              },
                  {icon:<Mountain size={15}/>, label:'Max altitude', val:'5,416m (Thorong La)'  },
                  {icon:<Compass size={15}/>,  label:'Difficulty',   val:'Moderate–Challenging' },
                  {icon:<Users size={15}/>,    label:'Group size',   val:'2–12 people'          },
                  {icon:<MapPin size={15}/>,   label:'Start / end',  val:'Kathmandu'            },
                ].map((s,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.12)', fontSize:15.5 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(243,246,249,0.65)' }}>{s.icon} {s.label}</span>
                    <span style={{ color:SNOW, fontWeight:600, textAlign:'right', maxWidth:'55%' }}>{s.val}</span>
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
                {['Down jacket rated to at least −15°C','Layered base, mid, and waterproof outer','Sturdy waterproof hiking boots — fully broken in','Sleeping bag rated to −15°C','Trekking poles — essential for the Thorong La descent','Headlamp with spare batteries (dark pre-dawn starts)','Sunscreen SPF 50+ and sunglasses/glacier goggles','Water purification tablets or filter bottle','Hand warmers for the pass-crossing night'].map((item,i)=>(
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
                { icon:<Users size={28}/>, title:'Gurung & Manangi Villages', desc:'The circuit passes through four distinct cultural zones: Gurung farming villages in the lower hills, Tibetan-influenced Manangi settlements in the high valley, the Thakali communities of the Kali Gandaki, and the Gurung heartland again around Ghandruk. Flat-roofed stone houses, prayer wheels, and mani walls mark the shift into high-altitude Buddhist culture as you climb toward Manang.' },
                { icon:<Heart size={28}/>, title:'Muktinath Temple', desc:'One of the holiest pilgrimage sites in Nepal, sacred to both Hindus and Buddhists, Muktinath sits at 3,760m just below Thorong La. Hindu pilgrims come to bathe beneath its 108 sacred water spouts, while Buddhists revere it as one of the 24 Tantric places. Arriving here directly after crossing the pass gives the site an added layer of meaning for trekkers.' },
                { icon:<Utensils size={28}/>, title:'Dal Bhat, Apples & Teahouse Life', desc:'Teahouse culture is what makes the Annapurna Circuit so different from a wilderness camping expedition. Every teahouse is family-run, every meal is cooked from scratch, and dal bhat is eaten twice a day by every porter, guide, and trekker on the route. In Marpha, apple pie, cider, and local brandy add a distinctly Thakali twist to the trail food.' },
                { icon:<BookOpen size={28}/>, title:'A Trekker\'s Classic', desc:'The Annapurna Circuit has been one of the world\'s great long-distance treks since it opened to foreigners in 1977, and every generation of trekker has walked some version of this route. The recent extension of jeep roads on the lower sections has changed the trail, but the heart of the journey — Manang, Thorong La, Muktinath, and Poon Hill — remains as compelling as ever.' },
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
              { q:'Do I need previous trekking experience?', a:'You do not need technical mountaineering experience, but some previous multi-day hiking is strongly recommended, since this is a three-week trek. You should be comfortable walking 6+ hours on varied terrain for consecutive days. The altitude — reaching 5,416m at Thorong La — is the main challenge, not technical difficulty. Our guided, paced approach manages altitude risk effectively for first-timers.' },
              { q:'What is crossing Thorong La Pass really like?', a:'It is the longest and highest day of the trek: an 8–10 hour day starting well before dawn, climbing roughly 1,000m to the 5,416m summit, then descending nearly 1,600m to Muktinath. Temperatures can be well below −15°C at the start. It is physically demanding but not technical — no ropes or crampons are needed in normal conditions. Most trekkers describe it as the hardest and most rewarding day of the whole journey.' },
              { q:'Can I skip sections of the trek using jeep roads?', a:'Yes. Rough jeep roads now reach several points on the circuit, particularly the lower Manang valley and sections near Muktinath and Jomsom. Some trekkers use these to shorten the itinerary to around 16 days. We keep our standard route on foot wherever possible, as it preserves the trail experience, but shorter jeep-assisted itineraries can be arranged on request.' },
              { q:'What is the accommodation like on the trail?', a:'Teahouses range from basic to genuinely comfortable depending on location. In Manang and Pokhara you\'ll find proper guesthouses with attached bathrooms and WiFi. At Thorong Phedi, rooms are simple, cold, and share basic facilities, but are clean and include thick blankets. Bring a good sleeping bag rated to at least −15°C for the high sections around the pass.' },
              { q:'Can I get WiFi and mobile signal on the trail?', a:'Mobile signal (Ncell or NTC SIM) is available in most lower and mid-altitude villages and intermittently higher. WiFi is available at most teahouses but becomes slower and less reliable above Manang. Above Thorong Phedi, assume you are disconnected for the pass-crossing day. This is one of the greatest gifts the trail offers: a full day where your inbox genuinely cannot reach you.' },
              { q:'What is the biggest physical challenge on the trek?', a:'The biggest physical challenge is not any single day but the cumulative effect of three weeks of walking, culminating in the very long, high pass-crossing day. Day 12 (Thorong Phedi to Thorong La to Muktinath) is the longest and highest day at 8–10 hours, starting in sub-zero darkness. Adequate preparation, the acclimatisation day in Manang, and honest communication with your guide are the three keys to success.' },
              { q:'Can solo travellers join a group departure?', a:'Yes. We run scheduled group departures in both peak seasons (March–May and October–November) that solo trekkers can join at the per-person price. You will share teahouse rooms with same-gender group members. Private departures for solo travellers, couples, and families are available year-round with a modest single supplement.' },
              { q:'What travel insurance do I need?', a:'Insurance specifically covering high-altitude trekking to at least 6,000m and including emergency helicopter evacuation is mandatory — non-negotiable. A helicopter evacuation from the Manang or Mustang region costs USD 3,000–8,000 without coverage. Recommended providers: World Nomads, True Traveller, and Battleface. Your guide will check your insurance details before departure from Kathmandu.' },
              { q:'How cold does it get at Thorong La Pass?', a:'At Thorong La (5,416m) in spring and autumn, pre-dawn temperatures typically range from −10°C to −20°C, with strong winds adding significant chill. By the time you descend to Muktinath (3,760m) a few hours later, conditions are far milder. Every layer you own is necessary for the summit push. A proper down jacket (not a fashion puffer — a genuine mountaineering down jacket) is essential.' },
            ].map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <div style={{ background:INK, padding: isMobile ? '56px 20px' : '84px 32px', textAlign:'center', color:SNOW }}>
          <h2 style={{ fontSize:'clamp(2rem,6vw,3.4rem)', fontWeight:600, lineHeight:1.08, letterSpacing:'-0.03em', margin:'0 0 18px', fontFamily: HEADING_FONT }}>
            Ready to trek the<br/>Round Annapurna Circuit?
          </h2>
          <p style={{ fontSize: isMobile ? 17 : 19, color:'rgba(243,246,249,0.82)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
            Our expert guides are ready to take you over Thorong La and around the Annapurna massif — safely, memorably, and at your pace.
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
              <div style={{ fontSize:20, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.02em', color:INK, lineHeight:1.2 }}>USD 1,690</div>
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

export default RoundAnnapurnaTrek;