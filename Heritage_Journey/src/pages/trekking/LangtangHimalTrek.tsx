import { useRef, useState, useEffect } from 'react';
import {
  Utensils, Mountain, Clock, Calendar, ArrowUpRight,
  Users, Compass, MapPin, Heart, ChevronDown,
  Wind, Sun, CloudRain, CloudSnow, Cloud, Info, CheckCircle, X, Send, BookOpen
} from 'lucide-react';
import Layout from '@/components/Layout';

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS — shared with Hero.tsx and the Everest page
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
   RESPONSIVE HOOK — inline styles, so we detect viewport width
   to switch grid layouts, padding, and font sizes.
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
  trekType:'Standard 15-Day Trek', message:'',
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
          trek:        'Langtang Himal Trek — 15 Days',
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
          <p style={{ fontSize:15, color:'rgba(243,246,249,0.75)', margin:0, fontFamily:BODY_FONT }}>Langtang Himal Trek, 15 days, from USD 1,190 per person</p>

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
                'Standard 15-Day Trek',
                'Private Group (custom dates)',
                'Shorter 10-Day (Langtang Valley only, no Tamang Heritage extension)',
                'Photography Special (extra night at Kyanjin Gompa)',
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
                  ['Trek',        'Langtang Himal Trek — 15 Days'],
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
    overview:'Use the afternoon to acclimatise to Kathmandu\'s buzz. Visit Swayambhunath Stupa (the "Monkey Temple") on its hilltop above the city, or the sprawling riverside cremation ghats of Pashupatinath. In the evening we host a welcome dinner where your guide walks you through every detail of the 15 days ahead.',
  },
  {
    day:2, title:'Drive Kathmandu → Syabrubesi', time:'7–8 hrs drive', alt:'1,467m', diff:'Easy', type:'drive',
    what:'A long, spectacular drive along the Trishuli River to the trailhead.',
    brief:'Leave Kathmandu early and follow the Pasang Lhamu Highway northwest, tracing the Trishuli and then Bhote Koshi rivers as the road climbs into the hills of Rasuwa district. The final stretch winds through terraced farmland to Syabrubesi, the gateway town to Langtang National Park.',
    tip:'Tip: The road has improved greatly in recent years but can still be rough in places — an early start avoids the worst of the midday traffic out of the valley.',
    overview:'Syabrubesi (1,467m) is a small trailhead town straddling the Bhote Koshi river, close to the Tibetan border. It\'s the last point with easy road access before the trail into Langtang National Park begins, and the last night you\'ll sleep this low for nearly two weeks.',
  },
  {
    day:3, title:'Trek to Lama Hotel', time:'6 hrs', alt:'2,380m', diff:'Moderate', type:'trek',
    what:'Into dense forest along the Langtang Khola.',
    brief:'The trek begins by crossing the Bhote Koshi and climbing into thick forests of oak, pine, and rhododendron, following the roaring Langtang Khola upstream. The trail passes waterfalls and the occasional troop of langur monkeys before reaching Lama Hotel, a small cluster of teahouses in the forest.',
    tip:'Tip: Keep an eye out for red pandas and langur monkeys in the forest canopy — this stretch is one of the best for wildlife on the whole trek.',
    overview:'Lama Hotel (2,380m) isn\'t a hotel at all, but a name that stuck to this cluster of teahouses deep in the Langtang forest. The subtropical warmth of Syabrubesi is already behind you — the air here is cooler and the forest noticeably wilder.',
  },
  {
    day:4, title:'Trek to Langtang Village', time:'6–7 hrs', alt:'3,430m', diff:'Moderate', type:'trek',
    what:'Out of the forest and into the wide, dramatic Langtang valley.',
    brief:'Climb steadily out of the tree line, passing the site of the old Langtang Village — tragically destroyed by a landslide triggered by the 2015 earthquake — before reaching the rebuilt village further up the valley. Views of Langtang Lirung (7,227m) dominate the skyline for the rest of the day.',
    tip:'Tip: Take a moment at the 2015 earthquake memorial near the old village site — it\'s a moving reminder of the resilience of the Tamang communities who call this valley home.',
    overview:'Langtang Village (3,430m) was rebuilt by its Tamang residents after the devastating 2015 landslide, and today stands as a symbol of the valley\'s recovery. Stone houses, prayer wheels, and yak pastures sit beneath the towering wall of Langtang Lirung.',
  },
  {
    day:5, title:'Trek to Kyanjin Gompa', time:'3–4 hrs', alt:'3,870m', diff:'Moderate', type:'trek',
    what:'A short day to your high-altitude base at the valley\'s head.',
    brief:'A shorter, gentler day following the widening valley floor past yak pastures and mani walls to Kyanjin Gompa, home to a 500-year-old Buddhist monastery and a small cheese factory established with Swiss assistance in the 1950s.',
    tip:'Tip: Visit the cheese factory in the afternoon and try the local yak cheese — a genuinely unique Langtang souvenir.',
    overview:'Kyanjin Gompa (3,870m) sits at the head of the Langtang valley, ringed by a spectacular amphitheatre of peaks including Langtang Lirung, Kyanjin Ri, and the Langtang Glacier. This is your base for the next two nights.',
  },
  {
    day:6, title:'Acclimatisation Day — Kyanjin Ri Sunrise Hike', time:'4–5 hrs hike', alt:'4,773m high point', diff:'Challenging', type:'sunrise',
    what:'An optional but highly recommended climb to the best viewpoint in the valley.',
    brief:'Wake before dawn and climb the steep ridge above Kyanjin Gompa to Kyanjin Ri (4,773m) for a 360-degree panorama of the Langtang range, including Langtang Lirung, Naya Kangri, and the vast Langtang Glacier. Return to Kyanjin Gompa by late morning to rest, explore the monastery, or take a shorter walk to Langshisha Kharka.',
    tip:'Tip: Kyanjin Ri has a lower and upper viewpoint — the lower one (around 4,300m) is a solid alternative if you\'re feeling the altitude and still delivers spectacular views.',
    overview:'Kyanjin Ri is widely regarded as one of the best value viewpoints in the Nepal Himalaya for the effort required — a single steep morning climb rewards you with an unobstructed panorama that rivals treks costing twice the time and distance. This "climb high, sleep low" day is also the key acclimatisation step before your descent begins.',
  },
  {
    day:7, title:'Trek to Lama Hotel', time:'6–7 hrs', alt:'2,380m', diff:'Moderate', type:'trek',
    what:'Retracing your steps back down through the forest.',
    brief:'Descend back down the valley, passing again through Langtang Village and the tree line into the forested lower section. The descent is quick and the extra oxygen at lower altitude is a welcome relief after two nights above 3,800m.',
    tip:'Tip: Your knees will thank you for trekking poles on this descent — the trail drops over 1,400m across the day.',
    overview:'Returning to Lama Hotel (2,380m) after Kyanjin Gompa feels like a different world — the forest is lush and green again, and the air is noticeably thicker. This marks the start of the Tamang Heritage Trail extension, taking you off the standard Langtang Valley route.',
  },
  {
    day:8, title:'Trek to Thulo Syabru', time:'5–6 hrs', alt:'2,210m', diff:'Moderate', type:'trek',
    what:'Onto the ridge above Syabrubesi, joining the Tamang Heritage Trail.',
    brief:'Descend to Syabrubesi and then climb the opposite side of the valley to Thulo Syabru, a traditional Tamang village perched on a ridge with sweeping views back down toward the Langtang valley you\'ve just left.',
    tip:'Tip: Thulo Syabru has one of the best sunset viewpoints of the whole trip — worth staying up on the ridge for.',
    overview:'Thulo Syabru (2,210m) marks the start of the quieter, less-trekked Tamang Heritage Trail, where traditional stone houses and terraced fields replace the busier teahouse villages of the main Langtang valley.',
  },
  {
    day:9, title:'Trek to Gatlang', time:'5–6 hrs', alt:'2,238m', diff:'Moderate', type:'trek',
    what:'Deeper into Tamang heartland.',
    brief:'Follow a ridge trail through rhododendron forest and small settlements to Gatlang, one of the most picturesque and culturally rich Tamang villages on the route, known for its traditional architecture and the nearby sacred Parvati Kunda lake.',
    tip:'Tip: Ask your guide about a short side trip to Parvati Kunda, a small sacred lake just above the village — a peaceful spot away from the main trail.',
    overview:'Gatlang (2,238m) is a large, traditional Tamang settlement of tightly packed stone houses with slate roofs, still home to a strong weaving and textile tradition. It\'s one of the best places on the trek to see everyday Tamang life up close.',
  },
  {
    day:10, title:'Trek to Tatopani', time:'6–7 hrs', alt:'2,607m', diff:'Moderate', type:'trek',
    what:'Through forest and farmland to natural hot springs.',
    brief:'Cross forested ridgelines and small streams en route to Tatopani — literally "hot water" in Nepali — home to a natural hot spring where tired legs get a very welcome soak after a week of trekking.',
    tip:'Tip: Save some energy for the hot springs — after ten days on the trail, this is one of the most rewarding stops of the entire trip.',
    overview:'Tatopani (2,607m) is a small settlement built around its namesake hot spring, tucked into forested hillside with views toward the Tibetan border peaks. It\'s a favourite overnight stop precisely because of what awaits at the end of the day.',
  },
  {
    day:11, title:'Trek to Thuman', time:'5–6 hrs', alt:'2,338m', diff:'Moderate', type:'trek',
    what:'A culturally rich Tamang village with strong Tibetan Buddhist ties.',
    brief:'Continue along the Tamang Heritage Trail through pine forest and small hamlets to Thuman, a village known for its traditional Tamang architecture, a historic monastery, and views across the valley toward the Tibetan plateau.',
    tip:'Tip: Thuman\'s monastery is one of the oldest on this route — ask your guide about visiting if it happens to be open.',
    overview:'Thuman (2,338m) sits on a sunny hillside with unusually good views of Langtang Lirung for a village this far off the main valley trail, and is regarded as one of the most authentic stops on the Tamang Heritage route.',
  },
  {
    day:12, title:'Trek to Briddim', time:'6 hrs', alt:'2,229m', diff:'Moderate', type:'trek',
    what:'A charming village with an ancient monastery and strong homestay culture.',
    brief:'Trek through forest and terraced hillside to Briddim, a close-knit Tamang village built around traditional homestay tourism, with an ancient monastery on the hillside above the settlement.',
    tip:'Tip: Briddim pioneered the community homestay model in this region — many trekkers cite it as their favourite village of the whole trip for exactly that reason.',
    overview:'Briddim (2,229m) is often the cultural highlight of the Tamang Heritage extension — a small, tightly-knit community where trekking tourism has been built around genuine homestays rather than standard teahouses, giving a far closer look at Tamang daily life.',
  },
  {
    day:13, title:'Trek to Syabrubesi', time:'5–6 hrs', alt:'1,467m', diff:'Moderate', type:'trek',
    what:'The final walking day, descending back to the trailhead.',
    brief:'Descend through forest and farmland back to Syabrubesi, closing the loop on the Tamang Heritage extension and rejoining the road at the trailhead where the trek began nearly two weeks earlier.',
    tip:'Tip: Treat yourself to a proper meal in Syabrubesi tonight — it\'s the last teahouse dinner of the trip.',
    overview:'Arriving back in Syabrubesi (1,467m) closes a genuine loop — up the Langtang valley to Kyanjin Gompa, then back down and across the Tamang Heritage villages of Thulo Syabru, Gatlang, Tatopani, Thuman, and Briddim.',
  },
  {
    day:14, title:'Drive Syabrubesi → Kathmandu', time:'7–8 hrs drive', alt:'1,400m', diff:'Easy', type:'drive',
    what:'Back to the capital for a farewell celebration.',
    brief:'Drive back to Kathmandu along the same scenic highway, retracing the route from two weeks earlier. Transfer to your hotel in Thamel, with the evening free before a Heritage Journey Nepal farewell dinner.',
    tip:'Tip: The farewell dinner is where you get your trek certificate and hear stories from your guide about seasons past. Don\'t skip it.',
    overview:'The drive back into the Kathmandu Valley brings the trip full circle — from the forests and hot springs of Langtang to the high, glacier-ringed amphitheatre of Kyanjin Gompa and the traditional Tamang villages beyond. The farewell dinner brings the whole group together to mark what you\'ve shared.',
  },
  {
    day:15, title:'Departure from Kathmandu', time:'—', alt:'—', diff:'Easy', type:'city',
    what:'Time to fly home — carrying the Himalaya with you.',
    brief:'Depending on your flight time, the morning is free for last-minute shopping in Thamel or a final visit to Boudhanath or Pashupatinath. Your guide transfers you to Tribhuvan International Airport (TIA) with plenty of time before departure.',
    tip:'Tip: Allow at least 3 hours before your international departure — TIA check-in queues can be very long in peak season.',
    overview:'You leave Nepal having completed one of its most rewarding cultural treks: the glacier-ringed Langtang valley, the sunrise panorama from Kyanjin Ri, and the traditional Tamang villages of Gatlang, Thuman, and Briddim. Fifteen days and a route far quieter than Everest or Annapurna — this is the kind of journey people spend the rest of their lives telling stories about.',
  },
];

const gallery = [
  { src:'/images/trekking/langtang/langtang-1.jpg', alt:'Langtang Himal panorama', caption:'Langtang Lirung (7,227m) rising above the valley' },
  { src:'/images/trekking/langtang/langtang-2.jpg', alt:'Himalayan landscapes',    caption:'The trail winding through rhododendron forest toward Kyanjin Gompa' },
  { src:'/images/trekking/langtang/langtang-3.jpg', alt:'Kyanjin Ri viewpoint',    caption:'Sunrise panorama from Kyanjin Ri, 4,773m' },
  { src:'/images/trekking/langtang/langtang-4.jpg', alt:'Traditional villages',    caption:'Traditional Tamang stone houses along the Tamang Heritage Trail' },
  { src:'/images/trekking/langtang/langtang-5.jpg', alt:'Local culture',           caption:'Prayer wheels and mani walls near Kyanjin Gompa monastery' },
];

const weatherData = [
  { m:'Jan', lo:-10, hi:5,  cond:'snow',  ok:false },
  { m:'Feb', lo:-7,  hi:8,  cond:'snow',  ok:false },
  { m:'Mar', lo:-2,  hi:12, cond:'mixed', ok:true  },
  { m:'Apr', lo:2,   hi:15, cond:'cloud', ok:true  },
  { m:'May', lo:5,   hi:18, cond:'cloud', ok:true  },
  { m:'Jun', lo:8,   hi:20, cond:'rain',  ok:false },
  { m:'Jul', lo:10,  hi:20, cond:'rain',  ok:false },
  { m:'Aug', lo:10,  hi:20, cond:'rain',  ok:false },
  { m:'Sep', lo:7,   hi:18, cond:'mixed', ok:true  },
  { m:'Oct', lo:3,   hi:15, cond:'sun',   ok:true  },
  { m:'Nov', lo:-1,  hi:12, cond:'sun',   ok:true  },
  { m:'Dec', lo:-7,  hi:8,  cond:'snow',  ok:false },
];

const includes = [
  'Airport transfers and all ground transportation',
  '2 nights hotel in Kathmandu (3-star, twin share)',
  'Private ground transport: Kathmandu–Syabrubesi & Syabrubesi–Kathmandu',
  'All teahouse and homestay accommodation during the trek (12 nights)',
  'All meals during the trek (breakfast, lunch, dinner)',
  'Licensed English-speaking trekking guide',
  'Porter (1 per 2 trekkers, max 15kg per porter)',
  'Langtang National Park Entry Permit and TIMS card',
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
interface Waypoint {
  x: number; y: number; label: string; day: string | number;
  start?: boolean; city?: boolean; peak?: boolean; special?: boolean;
}

const waypoints: Waypoint[] = [
  { x:250, y:650, label:'Kathmandu',           day:'1, 14–15', start:true },
  { x:210, y:560, label:'Syabrubesi',          day:'2, 13',    city:true  },
  { x:225, y:495, label:'Lama Hotel',          day:'3, 7' },
  { x:245, y:430, label:'Langtang Village',    day:4 },
  { x:262, y:365, label:'Kyanjin Gompa',       day:'5, 6',     city:true  },
  { x:280, y:328, label:'Kyanjin Ri 4,773m',   day:6,          peak:true  },
  { x:150, y:530, label:'Thulo Syabru',        day:8 },
  { x:110, y:485, label:'Gatlang',             day:9 },
  { x:96,  y:428, label:'Tatopani',            day:10,         special:true },
  { x:118, y:378, label:'Thuman',              day:11 },
  { x:156, y:420, label:'Briddim',             day:12 },
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
  const outPts    = [{x:250,y:650},{x:210,y:560},{x:225,y:495},{x:245,y:430},{x:262,y:365},{x:280,y:328}];
  const loopPts   = [{x:262,y:365},{x:225,y:495},{x:210,y:560},{x:150,y:530},{x:110,y:485},{x:96,y:428},{x:118,y:378},{x:156,y:420},{x:210,y:560}];
  const returnPts = [{x:210,y:560},{x:300,y:600},{x:250,y:650}];
  return (
    <div style={{ background:'#eaf0f5', borderRadius:10, overflow:'hidden', border:'1px solid '+BD }}>
      <svg width="100%" viewBox="0 0 500 700" style={{ display:'block' }} role="img" aria-label="Route map from Kathmandu to Syabrubesi, up the Langtang Valley to Kyanjin Gompa, then a loop through the Tamang Heritage villages">
        <defs>
          <pattern id="tp" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
            <ellipse cx="35" cy="35" rx="33" ry="24" fill="none" stroke={BD} strokeWidth="0.5" opacity="0.7"/>
            <ellipse cx="35" cy="35" rx="20" ry="14" fill="none" stroke={BD} strokeWidth="0.4" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="500" height="700" fill="#eaf0f5"/>
        <rect width="500" height="700" fill="url(#tp)"/>
        {/* Langtang Himal silhouette */}
        <polygon points="230,80 285,168 176,168" fill={W} opacity="0.95"/>
        <polygon points="288,66 340,168 236,168" fill={W} opacity="0.9"/>
        <polygon points="182,96 220,168 144,168" fill={W} opacity="0.75"/>
        <polygon points="230,80 285,168 176,168" fill={INK} opacity="0.06"/>
        <text x="258" y="50" textAnchor="middle" fontSize="10" fill={TX} opacity="0.8">Langtang Himal</text>
        {/* Road return */}
        <path d={buildPath(returnPts)} fill="none" stroke={INK} strokeWidth="2" strokeDasharray="5 4" opacity="0.35"/>
        {/* Out to Kyanjin Ri */}
        <path d={buildPath(outPts)} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Tamang Heritage loop */}
        <path d={buildPath(loopPts)} fill="none" stroke={RED} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
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
        {/* Legend */}
        <rect x="12" y="12" width="178" height="118" rx="8" fill={W} opacity="0.95"/>
        <text x="24" y="30" fontSize="10" fontWeight="700" fill={INK}>Legend</text>
        <line x1="24" y1="43" x2="56" y2="43" stroke={INK} strokeWidth="4.5" strokeLinecap="round"/>
        <text x="62" y="46" fontSize="9" fill={TX}>Langtang Valley route</text>
        <line x1="24" y1="57" x2="56" y2="57" stroke={RED} strokeWidth="3.5" strokeLinecap="round" opacity="0.85"/>
        <text x="62" y="60" fontSize="9" fill={TX}>Tamang Heritage Trail</text>
        <line x1="24" y1="71" x2="56" y2="71" stroke={INK} strokeWidth="2" strokeDasharray="5 4" opacity="0.5"/>
        <text x="62" y="74" fontSize="9" fill={TX}>Road transfer</text>
        <circle cx="30" cy="87" r="6" fill={SAFF} stroke={W} strokeWidth="2"/>
        <text x="42" y="87" dominantBaseline="central" fontSize="9" fill={TX}>Kyanjin Ri viewpoint</text>
        <circle cx="30" cy="102" r="6" fill={INK} stroke={W} strokeWidth="2"/>
        <text x="42" y="102" dominantBaseline="central" fontSize="9" fill={TX}>Kathmandu (start/end)</text>
        <circle cx="30" cy="117" r="6" fill={TX} stroke={W} strokeWidth="2"/>
        <text x="42" y="117" dominantBaseline="central" fontSize="9" fill={TX}>Villages and teahouses</text>
        {/* Compass */}
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
  const alts=[1400,1467,2380,3430,3870,4773,2380,2210,2238,2607,2338,2229,1467,1400,1400];
  const MIN=500,MAX=5200,VW=580,VH=140,pL=44,pR=12,pT=12,pB=32;
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
      <p style={{ fontSize:18, color:INK, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', margin:'0 0 10px '+pL+'px' }}>Elevation profile, days 1–15</p>
      <svg width="100%" viewBox={'0 0 '+VW+' '+VH} role="img" aria-label="Elevation profile peaking at 4,773 metres on day 6">
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
        <circle cx={pL+5*xS} cy={yF(4773)} r="5" fill={SAFF} stroke={INK} strokeWidth="2"/>
        <text x={pL+5*xS+8} y={yF(4773)-6} textAnchor="start" fontSize="9" fill={INK} fontWeight="700">Kyanjin Ri 4,773m</text>
        <circle cx={pL+4*xS} cy={yF(3870)} r="4" fill={INK} stroke={W} strokeWidth="1.5"/>
        <text x={pL+4*xS-6} y={yF(3870)-7} textAnchor="end" fontSize="8" fill={INK} fontWeight="700">Kyanjin Gompa 3,870m</text>
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
const LangtangHimalTrek = () => {
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
          <div style={{ position:'absolute', inset:0, backgroundImage:'url(/images/trekking/langtang/langtang-1.jpg)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.95) contrast(1.06) saturate(0.95)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(12,22,38,0.5), rgba(12,22,38,0.8))' }}/>

          <div style={{ position:'relative', zIndex:2, textAlign:'center', padding: isMobile ? '110px 20px 70px' : '150px 32px 100px', maxWidth:900 }}>
            <p style={{ fontSize:16, fontWeight:500, color:'rgba(243,246,249,0.85)', margin:'0 0 16px' }}>
              Trekking in the Langtang region
            </p>
            <h1 style={{ fontSize:'clamp(3rem,9vw,6.2rem)', fontWeight:600, lineHeight:1.02, color:SNOW, margin:'0 0 22px', textShadow:'0 2px 24px rgba(12,22,38,0.5)', letterSpacing:'-0.03em', fontFamily: HEADING_FONT }}>
              Langtang<br/>Himal Trek
            </h1>
            <p style={{ fontSize:'clamp(1.05rem,2.4vw,1.3rem)', color:'rgba(243,246,249,0.9)', lineHeight:1.7, maxWidth:600, margin: isMobile ? '0 auto 28px' : '0 auto 36px' }}>
              Exploring Tamang Culture and the Majestic Himalayas<br/>
              <span style={{ fontSize:'0.88em', color:'rgba(243,246,249,0.75)' }}>
                15 days through the Langtang Valley and the Tamang Heritage Trail
              </span>
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap: isMobile ? 8 : 12, justifyContent:'center', marginBottom: isMobile ? 32 : 44 }}>
              {[{icon:<Clock size={16}/>,label:'15 days'},{icon:<Mountain size={16}/>,label:'4,773m max'},{icon:<Compass size={16}/>,label:'Moderate'},{icon:<Calendar size={16}/>,label:'Mar–May, Sep–Nov'}].map((s,i)=>(
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
            {[{label:'Duration',val:'15 days'},{label:'Max altitude',val:'4,773m'},{label:'Daily walking',val:'4–7 hrs'},{label:'Trek distance',val:'~130 km'},{label:'Group size',val:'2–12'},{label:'Start / end',val:'Kathmandu'}].map((f,i,arr)=>(
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
                <SectionTitle mb={22} size="clamp(2rem,5vw,3.1rem)">Into the glacier-ringed Langtang Valley</SectionTitle>

                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : '28px 44px', marginBottom:32 }}>
                  {[
                    { title:'What is this trek?', text:'A 15-day guided walking journey up the Langtang Valley to Kyanjin Gompa and Kyanjin Ri (4,773m), then looping back through the traditional Tamang Heritage villages. No climbing equipment or mountaineering experience needed.' },
                    { title:'How fit do I need to be?', text:'You should be able to walk 4–7 hours a day at altitude on varied terrain for consecutive days. No technical climbing is required, but reasonable cardiovascular fitness makes the trek significantly more enjoyable, especially the Kyanjin Ri sunrise climb.' },
                    { title:'Where do you sleep?', text:'In teahouses in the main Langtang valley and traditional community homestays along the Tamang Heritage Trail. Rooms are simple but warm, with communal dining halls that are the heart of teahouse life each evening.' },
                    { title:'Where does it go?', text:'From Kathmandu, drive to Syabrubesi and trek up the Langtang valley to Kyanjin Gompa, then loop back down and across the quieter Tamang Heritage villages of Thulo Syabru, Gatlang, Tatopani, Thuman, and Briddim before returning to Kathmandu.' },
                  ].map((box, i) => (
                    <div key={i} style={{ borderTop:'3px solid '+INK, paddingTop:14 }}>
                      <h3 style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', lineHeight:1.25, margin:'0 0 8px' }}>{box.title}</h3>
                      <p style={{ fontSize:15.5, color:TX, lineHeight:1.7, margin:0 }}>{box.text}</p>
                    </div>
                  ))}
                </div>

                <p style={{ ...bodyText, marginBottom:16 }}>
                  The Langtang Himal Trek is one of Nepal's most rewarding cultural journeys — a 15-day route that climbs through dense rhododendron and oak forest into a dramatic glacier-ringed valley beneath Langtang Lirung (7,227m), then loops back through traditional Tamang villages rarely visited by trekkers on the busier Everest and Annapurna routes.
                </p>
                <p style={bodyText}>
                  The emotional high point is the sunrise climb to Kyanjin Ri (4,773m), with its 360-degree panorama over the Langtang range and glacier below — but the journey is remarkable throughout: the rebuilt village of Langtang itself, the ancient monastery and cheese factory at Kyanjin Gompa, the hot springs of Tatopani, and the deep Tamang culture of Gatlang, Thuman, and Briddim. Few treks anywhere combine this much high-mountain scenery with this level of genuine cultural immersion, all within striking distance of Kathmandu.
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
                    'Climb Kyanjin Ri (4,773m) for a 360-degree sunrise panorama of the Langtang range',
                    'Visit the rebuilt village of Langtang and its 2015 earthquake memorial',
                    'Explore the 500-year-old monastery and cheese factory at Kyanjin Gompa',
                    'Soak in natural hot springs at Tatopani on the Tamang Heritage Trail',
                    'Stay in traditional Tamang homestays in Briddim',
                    'Walk through some of Nepal\'s least-crowded high-altitude trekking country',
                    'Experience deep Tamang culture in Gatlang, Thuman, and Briddim',
                    'Trek beneath Langtang Lirung (7,227m) through forests rich with red panda and langur',
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
                  Two permits are required for the Langtang Himal Trek, both arranged on your behalf and included in the trip price. Heritage Journey Nepal handles all registration, so you simply carry the documents and present them at checkpoints along the route.
                </p>
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 40 }}>
                  {[
                    { title:'Langtang National Park Entry Permit', cost:'NPR 3,000 (about USD 22)', detail:'Required for entry into Langtang National Park, which covers the entire valley and much of the Tamang Heritage route. Checked at the park entrance near Syabrubesi and again at points along the trail. Your guide carries all permits, you just need to be there for the checkpoint.' },
                    { title:'TIMS: Trekkers\' Information Management System', cost:'NPR 2,000 (about USD 15)', detail:'A national trekker registration card required for all trekkers in Nepal. Your name, nationality, and emergency contact details are logged so search and rescue can be coordinated if needed. Carry it with your passport at all times on the trail.' },
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
                  Kyanjin Ri sits at 4,773m and Kyanjin Gompa itself at 3,870m, high enough that altitude sickness (Acute Mountain Sickness, or AMS) is a real consideration. The itinerary includes a dedicated rest and acclimatisation day at Kyanjin Gompa, with the optional Kyanjin Ri climb built in as a "climb high, sleep low" acclimatisation strategy.
                </p>

                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 28 : 36, marginBottom:28 }}>
                  {[
                    { heading:'Mild symptoms', serious:false, items:['Headache, especially after arriving at altitude','Fatigue beyond normal trekking tiredness','Loss of appetite or nausea','Dizziness or light-headedness','Difficulty sleeping at altitude'] },
                    { heading:'Serious symptoms: descend immediately', serious:true, items:['Severe headache not relieved by paracetamol','Vomiting, unable to keep fluids down','Loss of coordination or stumbling','Confusion or unusual drowsiness','Persistent cough or breathlessness at rest'] },
                    { heading:'Prevention', serious:false, items:['Walk slowly. "Bistari bistari" means slowly slowly','Drink 3–4 litres of water a day above 3,000m','Avoid alcohol entirely above 3,000m','Eat well, with carbohydrate-rich meals like dal bhat','Skip the Kyanjin Ri climb if you have unresolved AMS symptoms'] },
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
                  <strong>Our guides are trained in wilderness first aid and altitude medicine.</strong> If you show serious AMS symptoms, your guide will make the immediate call to descend or skip the Kyanjin Ri climb. That is not up for debate, because going down is the most effective treatment there is. We carry supplemental oxygen above Lama Hotel, and keep 24-hour helicopter evacuation capability.
                </p>
              </section>

              {/* Fitness Guide */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <SectionTitle>How to prepare your body for 15 days on the trail</SectionTitle>
                <p style={{ ...bodyText, marginBottom:28 }}>
                  The Langtang Himal Trek is a good introduction to multi-day high-altitude trekking. No single day is extreme, but the cumulative effect of two weeks of consecutive walking, plus the steep Kyanjin Ri climb, rewards genuine preparation. Start a dedicated training programme at least 8–10 weeks before departure.
                </p>

                <div style={{ borderBottom:'1px solid '+BD }}>
                  {[
                    { title:'8–10 weeks before', items:['Walk or hike 3–4 times a week, building up to 2+ hours a session','Include elevation gain in every outdoor session where possible','Start stair climbing with a loaded pack (begin with 5kg)','Run, cycle or swim 2–3 times a week for a cardio base','Read up on altitude sickness and talk to your doctor about Diamox'] },
                    { title:'4–6 weeks before', items:['Do two 5–6 hour day hikes on consecutive days with a full pack','Build your pack weight up to 7–8kg for training hikes','Practise descents, because the trail out of Kyanjin Gompa is hard on the knees','Get used to drinking 3+ litres of water a day','Book your travel health appointment and confirm all vaccinations'] },
                    { title:'2–4 weeks before', items:['Keep the frequency but ease off the intensity','Make sure your boots are fully broken in, with no new footwear on the trail','Do a full kit check, including in cold conditions','Confirm your insurance covers high-altitude trekking to at least 5,000m','Read up on Tamang culture and the villages along the route'] },
                    { title:'On the trek', items:['Walk at the pace of the slowest person, which matters most at altitude','Use the rest day at Kyanjin Gompa properly: hike high, sleep low','Eat every meal, even if you have no appetite','Tell your guide honestly how you feel every morning','The mountains will always be there, and your safety comes first'] },
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
                  Full route: <strong>Kathmandu → Syabrubesi → Lama Hotel → Langtang Village → Kyanjin Gompa → Kyanjin Ri → Thulo Syabru → Gatlang → Tatopani → Thuman → Briddim → Syabrubesi → Kathmandu</strong>. {!isMobile && 'Hover any point to see which day you pass through.'}
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
                      Tap a day to read the full description and practical tips. Each day shows walking or driving time, altitude and difficulty.
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
                        { season:'Spring (Mar–May)', text:'A very popular season. Rhododendrons bloom through the lower forest sections, skies are generally clear, and the trail up to Kyanjin Gompa is busy but never crowded compared to Everest or Annapurna. The best photography light is in March and April.' },
                        { season:'Autumn (Sep–Nov)', text:'Crystal-clear skies post-monsoon, sharp mountain views, and the driest trail conditions. October and early November are widely considered the ideal months: stable weather, good visibility, and comfortable temperatures for the Kyanjin Ri climb.' },
                        { season:'Winter (Dec–Feb)', text:'Cold at Kyanjin Gompa and above, with occasional snowfall that can make the Kyanjin Ri climb icy underfoot. Technically possible with the right gear and a flexible schedule, but not recommended for first-timers.' },
                        { season:'Monsoon (Jun–Aug)', text:'Heavy rain, leeches on the lower forested sections, cloud cover obscuring mountain views, and landslide risk on the access road. Not recommended for this trek.' },
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
                  USD 1,190
                  <span style={{ fontSize:16, fontWeight:400, color:'rgba(243,246,249,0.6)', marginLeft:8, letterSpacing:0, fontFamily:BODY_FONT }}>per person</span>
                </div>
                <div style={{ fontSize:14, color:'rgba(243,246,249,0.6)', marginBottom:24 }}>Based on 2+ trekkers, all inclusive</div>
                {[
                  {icon:<Clock size={15}/>,    label:'Duration',     val:'15 days'              },
                  {icon:<Mountain size={15}/>, label:'Max altitude', val:'4,773m (Kyanjin Ri)'  },
                  {icon:<Compass size={15}/>,  label:'Difficulty',   val:'Moderate'             },
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
                {['Down jacket rated to at least −10°C','Layered base, mid, and waterproof outer','Sturdy waterproof hiking boots — fully broken in','Sleeping bag rated to −10°C','Trekking poles — especially useful on the Kyanjin Gompa descent','Headlamp with spare batteries (dark pre-dawn start for Kyanjin Ri)','Sunscreen SPF 50+ and sunglasses','Water purification tablets or filter bottle','A small gift or notebook if staying in a Briddim homestay'].map((item,i)=>(
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
                { icon:<Users size={28}/>, title:'Tamang Villages', desc:'The Langtang region is the heartland of Tamang culture in Nepal. From the rebuilt village of Langtang itself to Thulo Syabru, Gatlang, Thuman, and Briddim on the Tamang Heritage Trail, every stop offers a genuine window into the traditions, architecture, and daily rhythms of this Tibetan-influenced ethnic group.' },
                { icon:<Heart size={28}/>, title:'Kyanjin Gompa Monastery', desc:'A roughly 500-year-old Buddhist monastery sits at the head of the valley in Kyanjin Gompa, alongside a small Swiss-assisted cheese factory dating to the 1950s. Together they capture the blend of deep tradition and quiet modern history that defines this part of the Himalaya.' },
                { icon:<Utensils size={28}/>, title:'Homestays & Teahouse Life', desc:'Briddim pioneered community-run homestay tourism in this region, and staying with a Tamang family here — sharing dal bhat cooked over a wood fire — is one of the most memorable nights of the whole trip. Elsewhere, family-run teahouses provide the same warm, communal dining hall experience found across Nepal\'s trekking routes.' },
                { icon:<BookOpen size={28}/>, title:'Resilience After 2015', desc:'The Langtang valley was devastated by a landslide triggered by the 2015 Gorkha earthquake, which destroyed the original Langtang Village. The community has since rebuilt, and walking through today\'s village — alongside the earthquake memorial — is a moving testament to Tamang resilience and the region\'s recovery.' },
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
              { q:'Do I need previous trekking experience?', a:'You do not need technical mountaineering experience, but some previous multi-day hiking is helpful, since this is a two-week trek. You should be comfortable walking 4–7 hours on varied terrain for consecutive days. The altitude — reaching 4,773m at Kyanjin Ri — is the main challenge, not technical difficulty. Our guided, paced approach manages altitude risk effectively for first-timers.' },
              { q:'What is the Kyanjin Ri sunrise climb really like?', a:'It is a steep, roughly 4–5 hour round-trip climb from Kyanjin Gompa, starting before dawn to catch the sunrise from the top. Temperatures can be well below freezing at the start. It is physically demanding but not technical — no ropes or crampons are needed in normal conditions. It is optional, and a lower viewpoint on the same ridge is a solid alternative if you\'re feeling the altitude.' },
              { q:'How is this trek different from Everest or Annapurna?', a:'Langtang is far less crowded than both — the trail sees a fraction of the trekkers, teahouses are quieter, and the pace feels more personal. It is also shorter and reaches a lower maximum altitude (4,773m versus 5,364m at Everest Base Camp or 5,416m at Thorong La), making it a strong choice for trekkers with less time or who prefer a quieter, more culturally-focused route.' },
              { q:'What is the accommodation like on the trail?', a:'Accommodation ranges from standard teahouses in the main Langtang valley to genuine community homestays on the Tamang Heritage Trail, particularly in Briddim. Rooms are simple, twin-share, and get colder near Kyanjin Gompa. Bring a good sleeping bag rated to at least −10°C for the high sections.' },
              { q:'Can I get WiFi and mobile signal on the trail?', a:'Mobile signal (Ncell or NTC SIM) is available in most lower and mid-altitude villages and intermittently higher up the valley. WiFi is available at most teahouses in the main Langtang valley but becomes less reliable on the quieter Tamang Heritage villages. This is one of the trek\'s quiet pleasures — genuine disconnection for a few days.' },
              { q:'What is the biggest physical challenge on the trek?', a:'The biggest physical challenge is the steep climb to Kyanjin Ri on the acclimatisation day, combined with the cumulative effect of two weeks of consecutive walking. No single trekking day is as long or as high as the pass-crossing days found on Everest or Annapurna routes, which makes Langtang a good option for less experienced trekkers.' },
              { q:'Can solo travellers join a group departure?', a:'Yes. We run scheduled group departures in both peak seasons (March–May and October–November) that solo trekkers can join at the per-person price. You will share teahouse or homestay rooms with same-gender group members. Private departures for solo travellers, couples, and families are available year-round with a modest single supplement.' },
              { q:'What travel insurance do I need?', a:'Insurance specifically covering high-altitude trekking to at least 5,000m and including emergency helicopter evacuation is mandatory — non-negotiable. A helicopter evacuation from the upper Langtang valley costs USD 2,500–6,000 without coverage. Recommended providers: World Nomads, True Traveller, and Battleface. Your guide will check your insurance details before departure from Kathmandu.' },
              { q:'Can I do a shorter version of this trek?', a:'Yes. A shorter 10-day itinerary covering just the Langtang Valley and Kyanjin Gompa (without the Tamang Heritage Trail extension) is available on request. This drops the Thulo Syabru–Gatlang–Tatopani–Thuman–Briddim loop and returns directly from Lama Hotel to Syabrubesi, saving roughly five days.' },
            ].map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <div style={{ background:INK, padding: isMobile ? '56px 20px' : '84px 32px', textAlign:'center', color:SNOW }}>
          <h2 style={{ fontSize:'clamp(2rem,6vw,3.4rem)', fontWeight:600, lineHeight:1.08, letterSpacing:'-0.03em', margin:'0 0 18px', fontFamily: HEADING_FONT }}>
            Ready to trek the<br/>Langtang Valley?
          </h2>
          <p style={{ fontSize: isMobile ? 17 : 19, color:'rgba(243,246,249,0.82)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
            Our expert guides are ready to take you into the glacier-ringed Langtang valley and through traditional Tamang villages — safely, memorably, and at your pace.
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
              <div style={{ fontSize:20, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.02em', color:INK, lineHeight:1.2 }}>USD 1,190</div>
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

export default LangtangHimalTrek;