import { useRef, useState, useEffect } from 'react';
import {
  Utensils, Mountain, Clock, Calendar, ArrowUpRight,
  Users, Compass, MapPin, Heart, ChevronDown,
  Wind, Sun, CloudRain, CloudSnow, Cloud, Info, CheckCircle, X, Send, BookOpen
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
          trek:        'Everest Base Camp — 14 Days',
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
          <p style={{ fontSize:15, color:'rgba(243,246,249,0.75)', margin:0, fontFamily:BODY_FONT }}>Everest Base Camp, 14 days, from USD 1,590 per person</p>

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
                'Photography Special (extra nights at EBC)',
                'Extended 16-Day (via Gokyo Lakes)',
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
                  ['Trek',        'Everest Base Camp — 14 Days'],
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
    brief:'A Heritage Journey Nepal representative meets you at Tribhuvan International Airport (TIA) and transfers you to your hotel in Thamel — Kathmandu\'s vibrant tourist hub. The rest of the day is yours to explore.',
    tip:'Tip: Change some cash to Nepali Rupees at the airport. USD is also accepted in most tourist areas.',
    overview:'Use the afternoon to acclimatise to Kathmandu\'s buzz. Boudhanath Stupa — one of the largest in the world — is a 15-minute walk from Thamel and offers a perfect first taste of Nepal: monks circling the great white dome, prayer flags snapping in the breeze, butter lamps burning at every shrine. In the evening we host a welcome dinner where your guide walks you through every detail of the trek ahead.',
  },
  {
    day:2, title:'Fly Kathmandu → Lukla | Trek to Phakding', time:'3–4 hrs walk', alt:'2,610m', diff:'Easy', type:'trek',
    what:'A thrilling mountain flight, then your first steps on the Everest trail.',
    brief:'Board a small twin-propeller aircraft for the 30-minute flight to Lukla\'s Tenzing-Hillary Airport — consistently rated one of the world\'s most dramatic runways, carved into a Himalayan hillside at 2,840m. From Lukla, trek down through pine and rhododendron forest, crossing suspension bridges over the Dudh Koshi River, to the village of Phakding.',
    tip:'Tip: Mountain flights are weather-dependent. Lukla delays are common — build in a buffer day if your international connection is tight.',
    overview:'The Lukla flight is an experience in itself: you are suddenly at 2,840m, surrounded by peaks, breathing mountain air for the first time. The walk to Phakding is gentle and spectacular — the roaring river below, prayer flags overhead, and your first views of distant white summits. Phakding is a warm, welcoming village with excellent teahouses and a real sense that the adventure has begun.',
  },
  {
    day:3, title:'Phakding → Namche Bazaar', time:'5–6 hrs', alt:'3,440m', diff:'Moderate', type:'trek',
    what:'The gateway to the Khumbu — a classic, strenuous climb to the Sherpa capital.',
    brief:'Trek from Phakding through Monjo (where your Sagarmatha National Park permits are checked), cross the famous Hillary Suspension Bridge over a dramatic gorge, and make the long, steep ascent to Namche Bazaar. This climb — roughly 600m of relentless uphill — is the most tiring single push of the trek. The reward at the top is extraordinary.',
    tip:'Tip: The Hillary Bridge crossing is one of the iconic moments of the trek. Stop in the middle for photos — and try not to look down if you\'re nervous about heights.',
    overview:'Namche Bazaar (3,440m) is the beating heart of the Khumbu region: a horseshoe-shaped town of colourful lodges, bakeries, gear shops, and Sherpa teahouses built into a steep hillside. On a clear day you get your first glimpse of Everest from the ridge above town. Namche has excellent food, hot showers, and a buzz that comes from being the meeting point of every Everest expedition. It feels like the edge of the world.',
  },
  {
    day:4, title:'Acclimatisation Day in Namche Bazaar', time:'3–4 hrs hike', alt:'3,440m–3,880m', diff:'Easy', type:'trek',
    what:'The golden rule of altitude: climb high, sleep low. Today you do both.',
    brief:'A rest day is not a lazy day at altitude — it is a survival strategy. Today you hike up to the Everest View Hotel ridge (3,880m) for your first clear views of Everest, Lhotse, and Ama Dablam, then descend back to Namche to sleep. This "climb high, sleep low" acclimatisation is the single most important factor in preventing altitude sickness higher on the trail.',
    tip:'Tip: Visit the Sherpa Culture Museum in Namche — it gives fascinating context on Sherpa history, climbing culture, and the ecology of the Khumbu region.',
    overview:'The hike to the Hotel Everest View ridge reveals the full scale of what you are walking toward: Everest\'s black pyramid, Lhotse\'s sweeping south face, and the perfect triangle of Ama Dablam — arguably the most beautiful mountain in the world — all visible at once. Back in Namche, explore the Saturday market, pick up any missing gear at the expedition stores, and eat well. Tomorrow the trail gets serious.',
  },
  {
    day:5, title:'Trek to Tengboche', time:'5–6 hrs', alt:'3,860m', diff:'Moderate', type:'trek',
    what:'Through forests of rhododendron and juniper to the most sacred monastery in the Khumbu.',
    brief:'Trek from Namche through beautiful high-altitude forest — rhododendron, juniper, and silver fir — with continuous mountain views. Cross the suspension bridge at the Dudh Koshi confluence and climb steadily to Tengboche, home of the largest and most important monastery in the Khumbu region.',
    tip:'Tip: If you arrive in time for the evening puja ceremony at Tengboche Monastery (usually 3pm), attend. The chanting, drums, and trumpet blasts echoing off the surrounding peaks are unforgettable.',
    overview:'Tengboche (3,860m) sits on a dramatic ridgeline with a 270-degree view of Himalayan giants: Everest, Lhotse, Nuptse, Ama Dablam, Kangtega, and Thamserku all visible from the monastery courtyard. The monastery itself — rebuilt after a fire in 1989 — is the spiritual centre of Sherpa life. Monks in burgundy robes move between the prayer hall and the kitchen; expedition flags flutter on the approach path; and at dusk the mountains glow deep orange in the alpenglow.',
  },
  {
    day:6, title:'Tengboche → Dingboche', time:'5–6 hrs', alt:'4,410m', diff:'Moderate', type:'trek',
    what:'Above the treeline. The landscape opens into high alpine tundra.',
    brief:'Descend from Tengboche through the last patches of forest, passing through Pangboche — the oldest village in the Khumbu, with a small monastery said to hold a yeti scalp — then climb into the open valley above the treeline. Dingboche sits in a wide, walled valley with sweeping views of Island Peak and Lhotse\'s south face.',
    tip:'Tip: The stone walls around Dingboche are yak pasture boundaries, not defensive fortifications — they\'re hundreds of years old. The whole valley has been cultivated at this altitude for generations.',
    overview:'Above 4,000m the landscape transforms completely. Trees disappear; the air is thinner and drier; the light is different — sharper, colder, more alpine. Dingboche (4,410m) is a quiet cluster of teahouses surrounded by enormous peaks. It feels genuinely remote. The silence here — broken only by wind, distant yak bells, and the occasional rotor of a rescue helicopter — is one of the great sensory experiences of the trek.',
  },
  {
    day:7, title:'Acclimatisation Day in Dingboche', time:'3–4 hrs hike', alt:'5,100m high point', diff:'Easy', type:'trek',
    what:'Second acclimatisation day — hike high to a ridge with five 8,000m peaks visible.',
    brief:'Take a daylong acclimatisation hike to the ridge above Dingboche (approximately 5,100m), from where you can see five of the world\'s fourteen 8,000m peaks: Everest, Lhotse, Makalu, Cho Oyu, and in some conditions Kangchenjunga. Return to Dingboche to sleep. Altitude sickness risk rises sharply above 4,000m — this day is essential preparation for the final push.',
    tip:'Tip: Headaches at this altitude are common and usually normal. Paracetamol and extra water help. If you have a severe headache that does not respond to paracetamol, or any confusion or vomiting, tell your guide immediately.',
    overview:'Standing on the ridge above Dingboche with five 8,000m giants in view, you understand for the first time the true scale of the Himalaya. These are not just large mountains — they are a different category of geographic feature entirely. The descent back to teahouse warmth and dal bhat feels earned and earned well.',
  },
  {
    day:8, title:'Dingboche → Lobuche', time:'5–6 hrs', alt:'4,940m', diff:'Moderate', type:'trek',
    what:'The memorial stones of Thokla Pass — and your first view of the Khumbu Glacier.',
    brief:'Trek from Dingboche up to Thokla Pass (4,830m) — a steep, lung-burning climb that marks the emotional centre of the journey. At the top you reach a plateau of stone memorial cairns built in memory of climbers who died on Everest and the surrounding peaks. From here, the trail follows the lateral moraine of the Khumbu Glacier to Lobuche.',
    tip:'Tip: Take time at the Thokla memorial cairns. Reading the names — many of them Sherpa high-altitude workers who died in avalanches or on summit bids — brings Everest\'s real human cost into sharp focus.',
    overview:'Lobuche (4,940m) is a collection of teahouses perched on the edge of the Khumbu Glacier moraine, with direct views of Pumori, Nuptse, and the Khumbu Icefall. It is remote, cold, and dramatic. Sleep early and eat well — tomorrow is the biggest day of the trek.',
  },
  {
    day:9, title:'Trek to Gorak Shep and Everest Base Camp', time:'7–8 hrs', alt:'5,364m', diff:'Challenging', type:'summit',
    what:'THE day. You reach Everest Base Camp at 5,364m.',
    brief:'Trek from Lobuche along the rubble-covered surface of the Khumbu Glacier moraine to Gorak Shep (5,140m) — the last teahouse settlement on the route. Drop your packs, eat lunch, then continue along the glacier\'s edge for 2–3 hours to Everest Base Camp itself. You stand at the foot of the world\'s highest mountain, surrounded by the Khumbu Icefall and the tents of current expeditions.',
    tip:'Tip: Altitude sickness is at its most dangerous here. Walk extremely slowly, breathe deeply, and drink constantly. If you feel confused, lose coordination, or develop a severe headache with vomiting — tell your guide and descend immediately.',
    overview:'Everest Base Camp (5,364m) is not a scenic overlook — Everest itself is not fully visible from the base camp due to the surrounding ridgelines. What you see instead is the raw chaos of a high-altitude glacier: towering seracs of blue-green ice, the constant creak and groan of the Khumbu Icefall, the colourful expedition tents of whoever is attempting the summit this season, and the Himalayan sky. It is one of the most extraordinary places accessible to non-mountaineers on foot. Return to Gorak Shep for the night.',
  },
  {
    day:10, title:'Kala Patthar Sunrise → Trek to Pheriche', time:'6–7 hrs total', alt:'5,545m high point', diff:'Moderate', type:'sunrise',
    what:'THE iconic moment — sunrise from Kala Patthar with Everest rising directly above.',
    brief:'Wake at 4am. Hike by headtorch to the summit of Kala Patthar (5,545m) — a rocky peak directly opposite Everest. Watch the sun rise over the world\'s highest mountain. This is the view that appears on every Everest documentary, every travel magazine, every Himalayan photograph: the black pyramid of Everest catching the first light of morning while everything below remains in shadow. Return to Gorak Shep for breakfast, then descend to Pheriche.',
    tip:'Tip: Every layer you own goes on for the Kala Patthar pre-dawn hike. At 5,545m before sunrise, temperatures can reach −20°C with wind chill. The suffering is temporary; the view is permanent.',
    overview:'Kala Patthar is the highest point most trekkers reach in the Everest region, and the view from its summit is the definitive image of the trek. Everest fills the sky directly ahead, with Nuptse\'s ridge to the right, Pumori behind you, and the entire Khumbu valley below. The descent to Pheriche — losing 1,600m of altitude — feels like returning from another world. Breathing gets easier with every step.',
  },
  {
    day:11, title:'Pheriche → Namche Bazaar', time:'6–7 hrs', alt:'3,440m', diff:'Moderate', type:'trek',
    what:'Long descent retracing the route — familiar ground, but with new eyes.',
    brief:'Trek from Pheriche back through Tengboche and down to Namche Bazaar. The route is the same as the ascent, but altitude is no longer an enemy — and the views that were obscured by weather or nerves on the way up are now clear. You move faster, breathe easier, and see everything differently.',
    tip:'Tip: The descent is hard on the knees. Trekking poles are invaluable, especially on the steep sections below Tengboche. Take your time going down.',
    overview:'Descending through the rhododendron forest below Tengboche, back into thicker air, the body notices the oxygen difference immediately. Colours seem more vivid; food tastes better; sleep comes easier. Namche Bazaar welcomes you back with bakeries, coffee shops, and the irresistible smell of freshly baked cinnamon rolls at the famous Namche Bakery. Celebrate with a hot shower and a real meal.',
  },
  {
    day:12, title:'Namche Bazaar → Lukla', time:'6–7 hrs', alt:'2,840m', diff:'Moderate', type:'trek',
    what:'The last full day on the trail — a long descent to the trailhead.',
    brief:'Trek from Namche Bazaar back down through the pine forests and suspension bridges to Phakding, then continue the final push to Lukla. This is a long, knee-testing descent with over 1,600m of altitude drop. But the trail is familiar now, the air is rich, and the sense of achievement carries you.',
    tip:'Tip: Celebrate tonight in Lukla — the teahouses have Everest beer and the guides will teach you the Sherpa songs. This is the last night on the mountain.',
    overview:'Arriving back in Lukla feels surreal. Fourteen days ago this was the starting point, full of nervous anticipation. Now you know every bridge, every teahouse, every prayer wheel along the way. The trail has become yours. Tonight in Lukla, over Everest beer and yak stew, your guide will tell you what you\'ve actually done: you walked to the base of the world\'s highest mountain and back. Not many people can say that.',
  },
  {
    day:13, title:'Fly Lukla → Kathmandu', time:'30 min flight', alt:'1,400m', diff:'Easy', type:'city',
    what:'Back to the city — hot showers, real beds, and a full lung of warm air.',
    brief:'Early morning flight from Lukla to Kathmandu (weather permitting — same caveats as Day 2). Transfer to your hotel in Thamel. The afternoon is free: massage, shopping, Boudhanath Stupa, or simply lying on your hotel bed doing nothing. Heritage Journey Nepal hosts a farewell dinner in the evening.',
    tip:'Tip: The farewell dinner is where you get your trek certificate and hear stories from your guide about seasons past. Don\'t skip it.',
    overview:'The contrast is immediate: warm air, oxygen at full strength, the noise and colour and chaos of Kathmandu. Your legs ache pleasantly. The mountains are behind you now, though you\'ll see them every time you close your eyes for months. The farewell dinner brings the whole group together to mark what you\'ve shared — and to start planning the next one.',
  },
  {
    day:14, title:'Departure from Kathmandu', time:'—', alt:'—', diff:'Easy', type:'city',
    what:'Time to fly home — carrying the Himalaya with you.',
    brief:'Depending on your flight time, the morning is free for last-minute shopping in Thamel or a final visit to Boudhanath or Pashupatinath. Your guide transfers you to Tribhuvan International Airport (TIA) with plenty of time before departure.',
    tip:'Tip: Allow at least 3 hours before your international departure — TIA check-in queues can be very long in peak season.',
    overview:'You leave Nepal having stood at 5,364m at the foot of the world\'s highest mountain, watched the sun rise over Everest from Kala Patthar, and walked over 130km through some of the most dramatic landscapes on Earth. You\'ve met Sherpa families in their high mountain homes, crossed glaciers, eaten dal bhat in teahouses at 5,000m. These are the things you will be telling people about for the rest of your life.',
  },
];

const gallery = [
  { src:'/images/trekking/ebc/everest-3.jpg',  alt:'Everest Base Camp',       caption:'Everest Base Camp at 5,364m — foot of the world\'s highest mountain' },
  { src:'/images/trekking/ebc/everest-1.jpg',  alt:'Mountain panorama',       caption:'Everest, Lhotse, and Nuptse from Kala Patthar at sunrise' },
  { src:'/images/trekking/ebc/everest-2.jpg',  alt:'Trail scenes',            caption:'Trail through the Khumbu valley toward Namche Bazaar' },
  { src:'/images/trekking/ebc/everest-4.jpg',  alt:'Traditional villages',    caption:'Traditional Sherpa villages along the Dudh Koshi valley' },
  { src:'/images/trekking/ebc/everest-5.jpg',  alt:'Cultural highlights',     caption:'Tengboche Monastery — the spiritual heart of the Khumbu' },
];

const weatherData = [
  { m:'Jan', lo:-17, hi:-2,  cond:'snow',  ok:false },
  { m:'Feb', lo:-14, hi:0,   cond:'snow',  ok:false },
  { m:'Mar', lo:-10, hi:5,   cond:'mixed', ok:true  },
  { m:'Apr', lo:-5,  hi:10,  cond:'cloud', ok:true  },
  { m:'May', lo:0,   hi:13,  cond:'cloud', ok:true  },
  { m:'Jun', lo:2,   hi:15,  cond:'rain',  ok:false },
  { m:'Jul', lo:3,   hi:16,  cond:'rain',  ok:false },
  { m:'Aug', lo:3,   hi:15,  cond:'rain',  ok:false },
  { m:'Sep', lo:0,   hi:12,  cond:'mixed', ok:true  },
  { m:'Oct', lo:-5,  hi:9,   cond:'sun',   ok:true  },
  { m:'Nov', lo:-10, hi:5,   cond:'sun',   ok:true  },
  { m:'Dec', lo:-15, hi:-1,  cond:'snow',  ok:false },
];

const includes = [
  'Airport transfers and all ground transportation',
  '2 nights hotel in Kathmandu (3-star, twin share)',
  'Domestic flights: Kathmandu–Lukla–Kathmandu',
  'All teahouse accommodation during the trek (11 nights)',
  'All meals during the trek (breakfast, lunch, dinner)',
  'Licensed English-speaking trekking guide',
  'Porter (1 per 2 trekkers, max 15kg per porter)',
  'Sagarmatha National Park permit and TIMS card',
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
  'Any costs due to flight delays or weather holds',
];

/* ── Waypoints ─────────────────────────────────────── */
const waypoints = [
  { x:310, y:620, label:'Kathmandu',           day:'1, 13–14', start:true },
  { x:290, y:520, label:'Lukla',               day:'2, 12–13', city:true  },
  { x:278, y:480, label:'Phakding',            day:2 },
  { x:264, y:428, label:'Namche Bazaar',       day:'3, 4, 11', city:true  },
  { x:254, y:380, label:'Tengboche',           day:5 },
  { x:246, y:334, label:'Dingboche',           day:'6, 7' },
  { x:234, y:284, label:'Lobuche',             day:8 },
  { x:222, y:234, label:'Gorak Shep',          day:9 },
  { x:204, y:188, label:'Everest Base Camp',   day:9, peak:true },
  { x:226, y:210, label:'Kala Patthar ★',      day:10, special:true },
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
  const returnPts = [{x:204,y:188},{x:222,y:234},{x:234,y:284},{x:246,y:334},{x:264,y:428},{x:278,y:480},{x:290,y:520},{x:310,y:620}];
  return (
    <div style={{ background:'#eaf0f5', borderRadius:10, overflow:'hidden', border:'1px solid '+BD }}>
      <svg width="100%" viewBox="0 0 500 700" style={{ display:'block' }} role="img" aria-label="Route map from Kathmandu via Lukla and Namche Bazaar to Everest Base Camp">
        <defs>
          <pattern id="tp" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
            <ellipse cx="35" cy="35" rx="33" ry="24" fill="none" stroke={BD} strokeWidth="0.5" opacity="0.7"/>
            <ellipse cx="35" cy="35" rx="20" ry="14" fill="none" stroke={BD} strokeWidth="0.4" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="500" height="700" fill="#eaf0f5"/>
        <rect width="500" height="700" fill="url(#tp)"/>
        <polygon points="168,42 220,120 116,120" fill={W} opacity="0.95"/>
        <polygon points="220,30 270,120 170,120" fill={W} opacity="0.9"/>
        <polygon points="125,58 162,120 88,120" fill={W} opacity="0.75"/>
        <polygon points="262,44 302,120 222,120" fill={W} opacity="0.85"/>
        <polygon points="168,42 220,120 116,120" fill={INK} opacity="0.06"/>
        <text x="196" y="22" textAnchor="middle" fontSize="10" fill={TX} opacity="0.8">Khumbu Himalaya</text>
        <path d={buildPath(returnPts)} fill="none" stroke={INK} strokeWidth="2" strokeDasharray="5 4" opacity="0.35"/>
        <path d={buildPath(waypoints)} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
        {waypoints.map((pt,i) => {
          const r = pt.peak?12:pt.start?10:pt.city?9:pt.special?8:6;
          const fill = (pt.peak||pt.special)?SAFF:(pt.start||pt.city)?INK:TX;
          const side = pt.x<320?'right':'left';
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
        <rect x="12" y="12" width="158" height="88" rx="8" fill={W} opacity="0.95"/>
        <text x="24" y="30" fontSize="10" fontWeight="700" fill={INK}>Legend</text>
        <line x1="24" y1="43" x2="56" y2="43" stroke={INK} strokeWidth="4.5" strokeLinecap="round"/>
        <text x="62" y="46" fontSize="9" fill={TX}>Trek route (outbound)</text>
        <line x1="24" y1="57" x2="56" y2="57" stroke={INK} strokeWidth="2" strokeDasharray="5 4" opacity="0.5"/>
        <text x="62" y="60" fontSize="9" fill={TX}>Return route</text>
        <circle cx="30" cy="73" r="6" fill={SAFF} stroke={W} strokeWidth="2"/>
        <text x="42" y="73" dominantBaseline="central" fontSize="9" fill={TX}>Everest Base Camp</text>
        <circle cx="30" cy="88" r="6" fill={INK} stroke={W} strokeWidth="2"/>
        <text x="42" y="88" dominantBaseline="central" fontSize="9" fill={TX}>Kathmandu (start/end)</text>
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
  const alts=[1400,2610,3440,3440,3860,4410,4410,4940,5364,5545,3440,2840,1400,1400];
  const MIN=500,MAX=6000,VW=580,VH=140,pL=44,pR=12,pT=12,pB=32;
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
      <svg width="100%" viewBox={'0 0 '+VW+' '+VH} role="img" aria-label="Elevation profile peaking at 5,545 metres on day 10">
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
        <circle cx={pL+8*xS} cy={yF(5364)} r="5" fill={SAFF} stroke={INK} strokeWidth="2"/>
        <text x={pL+8*xS} y={yF(5364)-11} textAnchor="middle" fontSize="9" fill={INK} fontWeight="700">EBC 5,364m</text>
        <circle cx={pL+9*xS} cy={yF(5545)} r="4" fill={INK} stroke={W} strokeWidth="1.5"/>
        <text x={pL+9*xS+4} y={yF(5545)-9} textAnchor="start" fontSize="8" fill={INK} fontWeight="700">KP 5,545m</text>
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
      <div style={{ maxHeight: open ? 420 : 0, overflow:'hidden', transition:'max-height 0.4s ease' }}>
        <p style={{ fontSize:16, color:TX, lineHeight:1.78, paddingBottom:20, margin:0 }}>{a}</p>
      </div>
    </div>
  );
};

/* ── MAIN PAGE ──────────────────────────────────────── */
const EverestBaseCampTrek = () => {
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
          <div style={{ position:'absolute', inset:0, backgroundImage:'url(/images/trekking/ebc/everest-3.jpg)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.95) contrast(1.06) saturate(0.95)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(12,22,38,0.5), rgba(12,22,38,0.8))' }}/>

          <div style={{ position:'relative', zIndex:2, textAlign:'center', padding: isMobile ? '110px 20px 70px' : '150px 32px 100px', maxWidth:900 }}>
            <p style={{ fontSize:16, fontWeight:500, color:'rgba(243,246,249,0.85)', margin:'0 0 16px' }}>
              Trekking in the Khumbu region
            </p>
            <h1 style={{ fontSize:'clamp(3rem,9vw,6.2rem)', fontWeight:600, lineHeight:1.02, color:SNOW, margin:'0 0 22px', textShadow:'0 2px 24px rgba(12,22,38,0.5)', letterSpacing:'-0.03em', fontFamily: HEADING_FONT }}>
              Everest<br/>Base Camp Trek
            </h1>
            <p style={{ fontSize:'clamp(1.05rem,2.4vw,1.3rem)', color:'rgba(243,246,249,0.9)', lineHeight:1.7, maxWidth:600, margin: isMobile ? '0 auto 28px' : '0 auto 36px' }}>
              Journey to the Roof of the World<br/>
              <span style={{ fontSize:'0.88em', color:'rgba(243,246,249,0.75)' }}>
                14 days from Kathmandu to Everest Base Camp and back
              </span>
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap: isMobile ? 8 : 12, justifyContent:'center', marginBottom: isMobile ? 32 : 44 }}>
              {[{icon:<Clock size={16}/>,label:'14 days'},{icon:<Mountain size={16}/>,label:'5,545m max'},{icon:<Compass size={16}/>,label:'Moderate–Challenging'},{icon:<Calendar size={16}/>,label:'Mar–May, Sep–Nov'}].map((s,i)=>(
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
            {[{label:'Duration',val:'14 days'},{label:'Max altitude',val:'5,545m'},{label:'Daily walking',val:'5–8 hrs'},{label:'Trek distance',val:'~130 km'},{label:'Group size',val:'2–12'},{label:'Start / end',val:'Kathmandu'}].map((f,i,arr)=>(
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
                <SectionTitle mb={22} size="clamp(2rem,5vw,3.1rem)">A journey to the roof of the world</SectionTitle>

                {/* Plain-language explainer boxes */}
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : '28px 44px', marginBottom:32 }}>
  {[
    { title:'What is this trek?', text:'A 14-day guided walking adventure through the Khumbu region of Nepal, finishing at the base camp of the world\'s highest mountain. No climbing equipment or mountaineering experience needed.' },
    { title:'How fit do I need to be?', text:'You should be able to walk 5–8 hours a day at altitude on rough terrain. No technical climbing is required, but good cardiovascular fitness and a structured preparation programme are essential.' },
    { title:'Where do you sleep?', text:'In teahouses: family-run Sherpa guesthouses with simple rooms and warm communal dining halls. Accommodation gets more basic (and colder) the higher you go, but is always safe and welcoming.' },
    { title:'Where does it go?', text:'From Kathmandu you fly to Lukla, then trek through the Khumbu valley (Phakding, Namche Bazaar, Tengboche, Dingboche) to Gorak Shep and Everest Base Camp at 5,364m, finishing with a sunrise from Kala Patthar.' },
  ].map((box, i) => (
    <div key={i} style={{ borderTop:'3px solid '+INK, paddingTop:14 }}>
      <h3 style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', lineHeight:1.25, margin:'0 0 8px' }}>{box.title}</h3>
      <p style={{ fontSize:15.5, color:TX, lineHeight:1.7, margin:0 }}>{box.text}</p>
    </div>
  ))}
</div>


                <p style={{ ...bodyText, marginBottom:16 }}>
                  The Everest Base Camp Trek is one of the most iconic journeys on Earth — a 14-day walk through the heart of the Khumbu Himalaya to the foot of the world's tallest mountain. The route passes through dramatic Sherpa villages, ancient monasteries, rhododendron forests, and high-altitude tundra before arriving at a landscape of glacial ice and towering rock at 5,364m.
                </p>
                <p style={bodyText}>
                  The goal is Everest Base Camp itself — and the pre-dawn hike to Kala Patthar (5,545m) for sunrise directly over Everest's summit. But the journey is as extraordinary as the destination: the Hillary Suspension Bridge crossing, the energy of Namche Bazaar, the spiritual calm of Tengboche Monastery, and the unmatched silence of the high Khumbu at 5,000m. This is not just a trek — it is a transformation.
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
      'Standing at Everest Base Camp (5,364m), the foot of the world\'s highest mountain',
      'Sunrise from Kala Patthar (5,545m) with Everest rising directly above you',
      'The legendary Lukla flight, one of the world\'s most dramatic mountain airstrips',
      'Namche Bazaar, the Sherpa capital and gateway to the Khumbu',
      'Tengboche Monastery at 3,860m, with 270° views of Everest, Lhotse and Ama Dablam',
      'The memorial cairns of Thokla Pass, the emotional centre of the journey',
      'Sherpa culture: ancient villages, prayer flags, butter lamps and high-altitude hospitality',
      'Walking the lateral moraine of the Khumbu Glacier toward the Icefall',
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
    Two permits are required for the Everest Base Camp Trek. Heritage Journey Nepal arranges both on your behalf and includes them in the trip price, so you simply carry the documents.
  </p>
  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 40 }}>
    {[
      { title:'Sagarmatha National Park Permit', cost:'NPR 3,000 (about USD 22)', detail:'Required for entry into Sagarmatha National Park, a UNESCO World Heritage Site that protects the Khumbu ecosystem and its Sherpa communities. It is checked at the park entrance near Monjo on Day 3. Your guide carries all permits, you just need to be there for the checkpoint.' },
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
    Everest Base Camp sits at 5,364m, significantly higher than Annapurna Base Camp, and Kala Patthar reaches 5,545m. At these elevations altitude sickness (Acute Mountain Sickness, or AMS) is a real and serious concern. The itinerary includes two full acclimatisation days specifically to reduce the risk.
  </p>
 
  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 28 : 36, marginBottom:28 }}>
    {[
      { heading:'Mild symptoms', serious:false, items:['Headache, especially after arriving at altitude','Tiredness beyond normal trekking fatigue','Loss of appetite or nausea','Dizziness or light-headedness','Difficulty sleeping'] },
      { heading:'Serious symptoms: descend immediately', serious:true, items:['Severe headache that paracetamol does not ease','Vomiting, unable to keep fluids down','Loss of coordination or stumbling','Confusion or unusual drowsiness','Cough or breathlessness even at rest'] },
      { heading:'Prevention', serious:false, items:['Walk slowly. "Bistari bistari" means slowly slowly','Drink 4–5 litres of water a day above 4,000m','Avoid alcohol entirely above 3,500m','Eat well, with plenty of carbohydrates like dal bhat','Never ascend with unresolved AMS symptoms'] },
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
    <strong>Our guides are trained in wilderness first aid and altitude medicine.</strong> If you show serious AMS symptoms, your guide will make the call straight away to descend. That is not up for debate, because going down is the most effective treatment there is. We carry supplemental oxygen and a Gamow bag on all treks above 4,500m, and keep 24-hour helicopter evacuation capability.
  </p>
</section>

              {/* Fitness Guide */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
  <SectionTitle>How to prepare your body for EBC</SectionTitle>
  <p style={{ ...bodyText, marginBottom:28 }}>
    The Everest Base Camp Trek is more demanding than most Himalayan treks because of the higher altitudes and longer daily distances. Start a dedicated training programme at least 10–12 weeks before departure. The fitter you arrive, the safer and more enjoyable the experience.
  </p>
 
  <div style={{ borderBottom:'1px solid '+BD }}>
    {[
      { title:'10–12 weeks before', items:['Walk or hike 4–5 times a week, building up to 2+ hours a session','Include real elevation gain in every outdoor session','Start stair climbing with a loaded pack (begin with 6kg)','Run, cycle or swim 3 times a week for a cardio base','Read up on altitude sickness and talk to your doctor about Diamox'] },
      { title:'6–8 weeks before', items:['Do two 6–8 hour hikes on consecutive days with a full pack','Build your pack weight up to 8–10kg for training hikes','Practise descents, because the Khumbu descent to Phakding is hard on the knees','Get used to drinking 4+ litres of water a day','Book your travel health appointment and check your vaccinations'] },
      { title:'2–4 weeks before', items:['Keep the frequency but ease off the intensity','Make sure your boots are fully broken in, with no new footwear on the trail','Do a full kit check, including in cold conditions','Confirm your insurance covers high-altitude trekking to at least 6,000m','Read up on Sherpa culture, Khumbu history and expedition climbing'] },
      { title:'On the trek', items:['Walk at the pace of the slowest person, which matters most at altitude','Use all the acclimatisation days properly: hike high, sleep low','Eat every meal, even if you have no appetite','Tell your guide honestly how you feel every morning','The mountains will always be there, and your safety comes first'] },
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
                  Full route: <strong>Kathmandu → Lukla → Namche Bazaar → Tengboche → Dingboche → Lobuche → Everest Base Camp</strong> and back. {!isMobile && 'Hover any point to see which day you pass through.'}
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
                        { season:'Spring (Mar–May)', color:INK, text:'The most popular season. Rhododendrons bloom in the lower valleys, skies are generally clear, and the trail is busy with expedition teams heading for Everest. The best photography light is in March and April.' },
                        { season:'Autumn (Sep–Nov)', color:INK, text:'Crystal-clear skies post-monsoon, sharp mountain views, and the driest trail conditions. October is widely considered the perfect month for EBC — stable weather, good visibility, and ideal temperatures.' },
                        { season:'Winter (Dec–Feb)', color:INK, text:'Extreme cold above 4,000m, with temperatures reaching −20°C at EBC and lower. Technically possible but very challenging; many teahouses close. Not recommended for first-timers.' },
                        { season:'Monsoon (Jun–Aug)', color:INK, text:'Heavy rain, leeches below 3,000m, cloud cover obscuring views, and landslide risk on some sections. Not recommended. The mountains are invisible for much of this period.' },
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
                  USD 1,590
                  <span style={{ fontSize:16, fontWeight:400, color:'rgba(243,246,249,0.6)', marginLeft:8, letterSpacing:0, fontFamily:BODY_FONT }}>per person</span>
                </div>
                <div style={{ fontSize:14, color:'rgba(243,246,249,0.6)', marginBottom:24 }}>Based on 2+ trekkers, all inclusive</div>
                {[
                  {icon:<Clock size={15}/>,    label:'Duration',     val:'14 days'              },
                  {icon:<Mountain size={15}/>, label:'Max altitude', val:'5,545m'               },
                  {icon:<Compass size={15}/>,  label:'Difficulty',   val:'Moderate–Challenging' },
                  {icon:<Users size={15}/>,    label:'Group size',   val:'2–12 people'          },
                  {icon:<MapPin size={15}/>,   label:'Start / end',  val:'Kathmandu'            },
                ].map((s,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.12)', fontSize:15.5, gap:12 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(243,246,249,0.65)' }}>{s.icon} {s.label}</span>
                    <span style={{ color:SNOW, fontWeight:600, textAlign:'right' }}>{s.val}</span>
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
                {['Down jacket rated to at least −15°C','Layered base, mid, and waterproof outer','Sturdy waterproof hiking boots — fully broken in','Sleeping bag rated to −20°C','Trekking poles — essential for Khumbu terrain','Headlamp with spare batteries (dark pre-dawn starts)','Sunscreen SPF 50+ and glacier goggles','Water purification tablets or filter bottle','Hand warmers for high-altitude nights'].map((item,i)=>(
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
                { icon:<Users size={28}/>, title:'Sherpa Culture & Villages', desc:'The Khumbu is the ancestral homeland of the Sherpa people — some of the most remarkable high-altitude communities on Earth. Namche Bazaar, Tengboche, and Dingboche are thriving Sherpa towns where ancient traditions coexist with the modern trekking economy. The Sherpas\' extraordinary physiology and mountain knowledge have made Everest climbing possible; their warmth and hospitality make trekking through their homeland one of the great travel experiences in Asia.' },
                { icon:<Heart size={28}/>, title:'Tengboche Monastery', desc:'The most sacred monastery in the Khumbu region sits at 3,860m on a dramatic ridge with a direct view of Everest. Founded in the early 20th century and rebuilt after a 1989 fire, Tengboche Monastery is the spiritual centre of Sherpa life and the site of the famous Mani Rimdu festival each autumn. Attending the evening puja ceremony — drums, horns, and chanting echoing off the surrounding Himalayan giants — is one of the most moving experiences on the entire route.' },
                { icon:<Utensils size={28}/>, title:'Dal Bhat & Teahouse Life', desc:'Teahouse culture is what makes the Everest trail so different from a wilderness camping expedition. Every teahouse is family-run, every meal is cooked from scratch, and dal bhat — rice, lentil soup, seasonal vegetables, and achaar pickle — is eaten twice a day by every porter, guide, and Sherpa on the mountain. The communal dining tables at 5,000m, where trekkers from twenty countries share stories over butter tea and apple pie, form some of the most unexpected and enduring friendships of a lifetime.' },
                { icon:<BookOpen size={28}/>, title:'The Story of Everest', desc:'Every stone in the Khumbu tells a story. At Thokla Pass, the memorial cairns of lost climbers line the ridge. In Namche, the Sherpa Museum documents the history of Everest expeditions from 1921 to the present. At base camp itself, the expedition tents of current summit teams are visible on the glacier. Walking this trail is not just a physical journey — it is an immersion in one of the greatest human stories of the 20th century: the long quest to stand on the highest point on Earth.' },
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
              { q:'Do I need previous trekking experience?', a:'You do not need technical mountaineering experience, but some previous multi-day hiking is strongly recommended. You should be comfortable walking 6+ hours on uneven terrain. The altitude — reaching 5,545m at Kala Patthar — is the main challenge, not technical difficulty. Our guided, paced approach manages altitude risk effectively for first-timers.' },
              { q:'What is the Lukla flight really like?', a:'Tenzing-Hillary Airport in Lukla is a 530-metre runway carved into a hillside at 2,840m. The approach is dramatic — a steep descent between mountain walls, landing on a runway that slopes uphill toward a cliff face. Most people find it exhilarating rather than terrifying. The 30-minute flight from Kathmandu passes directly over the Himalayan foothills with extraordinary mountain views. Flights are weather-dependent and delays are common, especially in spring.' },
              { q:'What is the accommodation like on the trail?', a:'Teahouses range from basic to surprisingly comfortable depending on the location. In Namche Bazaar you\'ll find proper guesthouses with attached bathrooms and WiFi. At Gorak Shep (5,140m) rooms are wooden, cold, and share basic facilities — but they are clean and include thick blankets. Bring a good sleeping bag rated to at least −20°C for the high sections. Hot showers are available at most teahouses for a small fee (NPR 200–500).' },
              { q:'Can I get WiFi and mobile signal on the trail?', a:'Mobile signal (Ncell or NTC SIM) is available up to Namche and intermittently higher. WiFi is available at most teahouses but becomes increasingly slow and unreliable above 4,000m. Above Dingboche, assume you are disconnected. This is one of the greatest gifts the Everest trail offers: ten days where your inbox genuinely cannot reach you.' },
              { q:'What is the biggest physical challenge on the trek?', a:'The biggest physical challenge is not any single day but the cumulative effect of altitude plus daily walking over two weeks. Day 9 (Lobuche to Gorak Shep to EBC and back) is the longest and highest day at 7–8 hours with minimal oxygen. Day 10 begins with a 4am start in −15°C conditions for the Kala Patthar climb. Adequate preparation, proper acclimatisation days, and honest communication with your guide are the three keys to success.' },
              { q:'Can solo travellers join a group departure?', a:'Yes. We run scheduled group departures in both peak seasons (March–May and October–November) that solo trekkers can join at the per-person price. You will share teahouse rooms with same-gender group members. Private departures for solo travellers, couples, and families are available year-round with a modest single supplement.' },
              { q:'What travel insurance do I need?', a:'Insurance specifically covering high-altitude trekking to at least 6,000m and including emergency helicopter evacuation is mandatory — non-negotiable. A helicopter evacuation from the Khumbu region costs USD 4,000–10,000 without coverage. Recommended providers: World Nomads, True Traveller, and Battleface. Your guide will check your insurance details before departure from Kathmandu.' },
              { q:'How cold does it get at Everest Base Camp?', a:'At EBC (5,364m) in spring (March–May), daytime temperatures range from −5°C to +5°C. At night they drop to −15°C or below. Add wind chill and the actual "feels like" temperature can reach −25°C. In autumn, conditions are similar or colder. The pre-dawn Kala Patthar climb in October can hit −20°C with wind. Every layer you own is necessary. A proper down jacket (not a fashion puffer — a genuine mountaineering down jacket) is essential.' },
            ].map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <div style={{ background:INK, padding: isMobile ? '56px 20px' : '84px 32px', textAlign:'center', color:SNOW }}>
          <h2 style={{ fontSize:'clamp(2rem,6vw,3.4rem)', fontWeight:600, lineHeight:1.08, letterSpacing:'-0.03em', margin:'0 0 18px', fontFamily: HEADING_FONT }}>
            Ready to trek to<br/>Everest Base Camp?
          </h2>
          <p style={{ fontSize: isMobile ? 17 : 19, color:'rgba(243,246,249,0.82)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
            Our expert guides are ready to take you to the foot of the world's highest mountain — safely, memorably, and at your pace.
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
              <div style={{ fontSize:20, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.02em', color:INK, lineHeight:1.2 }}>USD 1,590</div>
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

export default EverestBaseCampTrek;