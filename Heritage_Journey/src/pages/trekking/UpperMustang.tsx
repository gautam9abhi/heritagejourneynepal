import { useRef, useState, useEffect } from 'react';
import {
  Utensils, Mountain, Clock, Calendar, ArrowUpRight,
  Users, Compass, MapPin, Heart, ChevronDown,
  Wind, Sun, CloudRain, CloudSnow, Cloud, Info, CheckCircle, X, Send
} from 'lucide-react';
import Layout from '@/components/Layout';

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS — shared with Hero.tsx and the Everest / Langtang pages
══════════════════════════════════════════════════════ */
const INK   = '#0c1626';
const SNOW  = '#f3f6f9';
const SAFF  = '#f5a81c';
const RED   = '#d63a32';

const W   = '#FFFFFF';
const BG  = SNOW;
const TX  = '#3a4659';
const BD  = '#d5dbe3';
const MUT = '#6b788c';

const HEADING_FONT = "'Outfit', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT    = "'Hind', system-ui, -apple-system, 'Segoe UI', sans-serif";

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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
  name: string; email: string; phone: string; nationality: string;
  groupSize: string; month: string; year: string; trekType: string; message: string;
}
interface BookingErrors { name?: string; email?: string; month?: string; }
interface BookingModalProps { isOpen: boolean; onClose: () => void; }

const emptyForm: BookingForm = {
  name:'', email:'', phone:'', nationality:'',
  groupSize:'2', month:'', year:'2026',
  trekType:'Standard 16-Day Trip', message:'',
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
          trek:        'Upper Mustang — 16 Days',
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
    <div onClick={handleClose} role="dialog" aria-modal="true" aria-label="Book your trip"
      style={{ position:'fixed', inset:0, background:'rgba(12,22,38,0.78)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding: isMobile ? 12 : 20 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:SNOW, borderRadius:12, width:'100%', maxWidth:560, maxHeight:'92vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(0,0,0,0.4)', position:'relative', fontFamily:BODY_FONT }}>

        <div style={{ background:INK, borderRadius:'12px 12px 0 0', padding: isMobile ? '24px 20px 20px' : '28px 32px 24px', color:SNOW }}>
          <button onClick={handleClose} aria-label="Close"
            style={{ position:'absolute', top:18, right:20, background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%', width:34, height:34, cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={18}/>
          </button>
          <p style={{ fontSize:14, color:'rgba(243,246,249,0.65)', fontFamily:BODY_FONT, margin:'0 0 6px' }}>Heritage Journey Nepal</p>
          <h2 style={{ fontSize: isMobile ? 26 : 30, fontWeight:600, margin:'0 0 4px', color:SNOW, fontFamily: HEADING_FONT, letterSpacing:'-0.02em' }}>Book your trip</h2>
          <p style={{ fontSize:15, color:'rgba(243,246,249,0.75)', margin:0, fontFamily:BODY_FONT }}>Upper Mustang, 16 days</p>

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

              {select('Package', 'trekType', [
                'Standard 16-Day Trip',
                'Private Group (custom dates)',
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

          {step === 2 && (
            <div>
              <div style={{ background:W, border:'1px solid '+BD, borderRadius:10, padding: isMobile ? 16 : 22, marginBottom:24 }}>
                <h3 style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.02em', margin:'0 0 12px' }}>Booking summary</h3>
                {[
                  ['Trip',        'Upper Mustang — 16 Days'],
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

/* ── DATA ───────────────────────────────────────────── */
const itinerary = [
  { day:1,  title:'Arrive in Kathmandu', time:'N/A', diff:'Easy', overview:'Arrive in Kathmandu and transfer to your hotel. Explore the vibrant city, visiting temples, markets, and cultural landmarks like Durbar Square and Swayambhunath (Monkey Temple).' },
  { day:2,  title:'Drive or Flight to Pokhara', time:'N/A', diff:'Easy', overview:'Take a scenic drive or flight from Kathmandu to Pokhara. Pokhara, known for its lakes, natural beauty, and adventure sports, is the gateway to the Annapurna and Mustang regions.' },
  { day:3,  title:'Pokhara to Tatopani', time:'6–7 hrs (driving)', diff:'Easy', overview:'Drive from Pokhara to Tatopani, a village on the banks of the Kali Gandaki River. Known for its natural hot springs, it\'s the perfect place to relax after your long drive.' },
  { day:4,  title:'Tatopani to Ghasa', time:'4–5 hrs (driving)', diff:'Easy', overview:'Drive along the Kali Gandaki River to Ghasa, a village famous for its apple orchards. Enjoy panoramic views of the Himalayas as you drive through charming landscapes.' },
  { day:5,  title:'Ghasa to Kagbeni', time:'6–7 hrs (driving)', diff:'Easy', overview:'Travel to Kagbeni, the gateway to the Upper Mustang region. This small village, located at the confluence of the Kali Gandaki and Jhong rivers, is known for its traditional Tibetan architecture and monasteries.' },
  { day:6,  title:'Kagbeni to Chele', time:'3–4 hrs (driving)', diff:'Easy', overview:'Drive from Kagbeni to Chele, a village surrounded by red sandstone cliffs. Known for its unique landscape and traditional architecture, it\'s a perfect stop for exploring the culture and lifestyle of the Mustang region.' },
  { day:7,  title:'Chele to Syanbochen', time:'5–6 hrs (driving)', diff:'Easy', overview:'Continue your journey to Syanbochen, a peaceful village with views of snow-capped peaks and an introduction to Mustang\'s Buddhist culture.' },
  { day:8,  title:'Syanbochen to Ghaymi', time:'4–5 hrs (driving)', diff:'Easy', overview:'Drive from Syanbochen to Ghaymi, a small village surrounded by barley and wheat fields. This is a great place to learn about the local culture, architecture, and lifestyle of the people.' },
  { day:9,  title:'Ghaymi to Charang', time:'3–4 hrs (driving)', diff:'Easy', overview:'Drive to Charang, a village known for its ancient monastery and traditional architecture. Charang offers some of the best views of the surrounding Himalayas and provides insight into the history of the region.' },
  { day:10, title:'Charang to Lo Manthang', time:'4–5 hrs (driving)', diff:'Moderate', overview:'The final leg of the journey takes you to Lo Manthang, the capital of Upper Mustang. Known for its ancient walled city, palace, and monasteries, Lo Manthang is steeped in history and Tibetan Buddhist culture.' },
  { day:11, title:'Explore Lo Manthang', time:'N/A', diff:'Easy', overview:'Spend the day exploring Lo Manthang\'s ancient monasteries, palaces, and temples. This is the heart of the Upper Mustang, where you can immerse yourself in the history, culture, and spiritual life of the region.' },
  { day:12, title:'Lo Manthang to Ghaymi', time:'4–5 hrs (driving)', diff:'Easy', overview:'Begin your descent back to Ghaymi, retracing the scenic route with opportunities for new views and cultural experiences along the way.' },
  { day:13, title:'Ghaymi to Tatopani', time:'7–8 hrs (driving)', diff:'Moderate', overview:'Travel from Ghaymi to Tatopani, taking in the landscapes and allowing yourself time to relax and enjoy the hot springs upon arrival.' },
  { day:14, title:'Tatopani to Pokhara', time:'6–7 hrs (driving)', diff:'Easy', overview:'Drive back to Pokhara, where you can relax by the lake, enjoy the peaceful atmosphere, and reflect on the unforgettable journey to Upper Mustang.' },
  { day:15, title:'Drive or Flight back to Kathmandu', time:'N/A', diff:'Easy', overview:'Return to Kathmandu by flight or drive. Spend your final evening in Nepal exploring the capital or shopping for souvenirs.' },
  { day:16, title:'Departure', time:'N/A', diff:'Easy', overview:'Transfer to the airport for your departure flight, marking the end of your journey to Upper Mustang.' },
];

const trekHighlights = [
  'Visit Lo Manthang, the medieval walled city and ancient capital of the Upper Mustang kingdom',
  'Experience the unique Tibetan-influenced culture preserved for centuries',
  'Explore ancient Buddhist monasteries with beautiful murals and artifacts',
  'Visit the cave temples of Chosar with their 2,500-year-old history',
  'Witness dramatic desert landscapes with colorful rock formations',
  'Experience the traditional lifestyle of the people of Mustang',
  'Enjoy breathtaking views of the Annapurna and Dhaulagiri mountain ranges',
  'Cross the mighty Kali Gandaki river, the deepest gorge in the world',
];

const gallery = [
  { src:'/images/trekking/upper/upper-5.jpg', alt:'Upper Mustang panorama',              caption:'Upper Mustang panorama' },
  { src:'/images/trekking/upper/upper-1.jpg', alt:'Desert landscapes of Upper Mustang',  caption:'Desert landscapes of Upper Mustang' },
  { src:'/images/trekking/upper/upper-2.jpg', alt:'Lo Manthang walled city',             caption:'Lo Manthang walled city' },
  { src:'/images/trekking/upper/upper-3.jpg', alt:'Traditional architecture',            caption:'Traditional architecture' },
  { src:'/images/trekking/upper/upper-4.jpg', alt:'Buddhist culture',                    caption:'Buddhist culture' },
];

const weatherData = [
  { m:'Jan', lo:-5, hi:8,  cond:'snow',  ok:false },
  { m:'Feb', lo:-2, hi:10, cond:'snow',  ok:false },
  { m:'Mar', lo:5,  hi:15, cond:'mixed', ok:true  },
  { m:'Apr', lo:10, hi:18, cond:'cloud', ok:true  },
  { m:'May', lo:12, hi:20, cond:'cloud', ok:true  },
  { m:'Jun', lo:15, hi:25, cond:'mixed', ok:false },
  { m:'Jul', lo:15, hi:25, cond:'rain',  ok:false },
  { m:'Aug', lo:15, hi:25, cond:'rain',  ok:false },
  { m:'Sep', lo:12, hi:20, cond:'mixed', ok:true  },
  { m:'Oct', lo:8,  hi:18, cond:'sun',   ok:true  },
  { m:'Nov', lo:0,  hi:12, cond:'sun',   ok:false },
  { m:'Dec', lo:-5, hi:10, cond:'snow',  ok:false },
];

const culturalHighlights = [
  { title:'Lo Manthang', description:'The ancient capital of Upper Mustang, with its palaces, temples, and monasteries, offers a fascinating cultural experience.', icon:<Users size={28}/> },
  { title:'Buddhist Monasteries', description:'Visit ancient monasteries like Jhong, Chosar, and Thubchen, where you can learn about Tibetan Buddhist practices and history.', icon:<Heart size={28}/> },
  { title:'Tibetan Culture', description:'Savor local dishes, including Tibetan bread, momos (dumplings), and butter tea, which are staples of Mustang\'s cuisine.', icon:<Utensils size={28}/> },
];

const packList = [
  'Sun protection (hat, sunglasses, sunscreen)',
  'Warm clothing for cool nights',
  'Comfortable footwear for desert terrain',
  'Camera for capturing the unique landscapes',
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

/* ── ITINERARY ── simple accordion */
const ItineraryTimeline = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<number | null>(null);
  const indent = isMobile ? 18 : 20 + 56 + 16;

  return (
    <div style={{ background:W, border:'1px solid '+BD, borderRadius:10, overflow:'hidden' }}>
      {itinerary.map((d, i) => {
        const isOpen = open === d.day;
        const meta = [d.time !== 'N/A' && d.time, d.diff].filter(Boolean).join('  ·  ');
        return (
          <div key={d.day} style={{
            borderTop: i ? '1px solid '+BD : 'none',
            background: isOpen ? SNOW : W,
            boxShadow: isOpen ? `inset 3px 0 0 ${SAFF}` : 'none',
            transition:'background 0.2s',
          }}>
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
                <span style={{ display:'block', fontSize:14, color:MUT }}>{meta}</span>
              </span>
              <ChevronDown
                className="hj-expand"
                size={20}
                color={INK}
                style={{ flexShrink:0, marginTop:4, transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.25s ease' }}
              />
            </button>

            <div className="hj-expand" style={{ display:'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition:'grid-template-rows 0.25s ease' }}>
              <div style={{ overflow:'hidden' }}>
                <div style={{ padding: `0 ${isMobile ? 18 : 20}px 22px ${indent}px` }}>
                  <p style={{ fontSize: isMobile ? 15.5 : 16.5, lineHeight:1.75, color:INK, margin:0 }}>{d.overview}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── MAIN PAGE ──────────────────────────────────────── */
const UpperMustang = () => {
  const isMobile = useIsMobile();
  const [showBooking, setShowBooking] = useState<boolean>(false);
  const overviewRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { window.scrollTo(0,0); }, []);

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
          <div style={{ position:'absolute', inset:0, backgroundImage:'url(/images/trekking/upper/upper-5.jpg)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.95) contrast(1.06) saturate(0.95)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(12,22,38,0.5), rgba(12,22,38,0.8))' }}/>

          <div style={{ position:'relative', zIndex:2, textAlign:'center', padding: isMobile ? '110px 20px 70px' : '150px 32px 100px', maxWidth:900 }}>
            <p style={{ fontSize:16, fontWeight:500, color:'rgba(243,246,249,0.85)', margin:'0 0 16px' }}>
              Exploring the Mustang region
            </p>
            <h1 style={{ fontSize:'clamp(3rem,9vw,6.2rem)', fontWeight:600, lineHeight:1.02, color:SNOW, margin:'0 0 22px', textShadow:'0 2px 24px rgba(12,22,38,0.5)', letterSpacing:'-0.03em', fontFamily: HEADING_FONT }}>
              Upper<br/>Mustang
            </h1>
            <p style={{ fontSize:'clamp(1.05rem,2.4vw,1.3rem)', color:'rgba(243,246,249,0.9)', lineHeight:1.7, maxWidth:600, margin: isMobile ? '0 auto 28px' : '0 auto 36px' }}>
              Journey to the Mystical Kingdom<br/>
              <span style={{ fontSize:'0.88em', color:'rgba(243,246,249,0.75)' }}>
                16 days from Kathmandu to Lo Manthang and back
              </span>
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap: isMobile ? 8 : 12, justifyContent:'center', marginBottom: isMobile ? 32 : 44 }}>
              {[{icon:<Clock size={16}/>,label:'16 days'},{icon:<Mountain size={16}/>,label:'3,800m max'},{icon:<Compass size={16}/>,label:'Moderate–Challenging'},{icon:<Calendar size={16}/>,label:'Mar–May, Sep–Oct'}].map((s,i)=>(
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
            {[{label:'Duration',val:'16 days'},{label:'Max altitude',val:'3,800m'},{label:'Difficulty',val:'Moderate–Challenging'},{label:'Best time',val:'Mar–May, Sep–Oct'},{label:'Start / end',val:'Kathmandu'}].map((f,i,arr)=>(
              <div key={i} style={{ textAlign:'center', padding: isMobile ? '8px 12px' : '8px 22px', minWidth: isMobile ? '45%' : 'auto', borderRight: (!isMobile && i<arr.length-1) ? '1px solid rgba(255,255,255,0.18)':'none' }}>
                <div style={{ fontSize: isMobile ? 13 : 14, color:'rgba(243,246,249,0.65)', marginBottom:4 }}>{f.label}</div>
                <div style={{ fontSize: isMobile ? 17 : 22, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.01em' }}>{f.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────── */}
        <div ref={overviewRef} style={{ maxWidth:1240, margin:'0 auto', padding: isMobile ? '48px 18px 56px' : '72px 32px 88px', scrollMarginTop:24 }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr min(360px,34%)', gap: isMobile ? 40 : 52, alignItems:'start' }}>

            <div>
              {/* Overview */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <SectionTitle mb={22} size="clamp(2rem,5vw,3.1rem)">The last forbidden kingdom</SectionTitle>
                <p style={bodyText}>
                  Upper Mustang, also known as Lo Manthang, is one of the most remote and culturally rich regions of Nepal, offering a rare opportunity to explore the land of the last forbidden kingdom. This high-altitude desert region, surrounded by the majestic Himalayan peaks, provides a unique blend of rugged landscapes, ancient monasteries, and traditional Tibetan culture. The kingdom of Lo Manthang, with its centuries-old walled city, monasteries, and palaces, invites travelers to experience the mystical beauty of its landscape and the fascinating lifestyle of its people. The trek to Upper Mustang combines breathtaking natural beauty with a deep cultural immersion, making it a once-in-a-lifetime adventure.
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
                <SectionTitle>Trip highlights</SectionTitle>
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', columnGap:44, borderBottom:'1px solid '+BD }}>
                  {trekHighlights.map((h, i) => (
                    <p key={i} style={{ margin:0, padding:'15px 0', borderTop:'1px solid '+BD, fontSize:16.5, lineHeight:1.55, color:INK }}>
                      {h}
                    </p>
                  ))}
                </div>
              </section>

              {/* Itinerary */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <SectionTitle>Daily itinerary</SectionTitle>
                <p style={{ fontSize:16, color:TX, margin:'0 0 18px', lineHeight:1.65 }}>
                  Tap a day to read the full description. Each day shows driving time and difficulty.
                </p>
                <ItineraryTimeline />
              </section>

              {/* Weather */}
              <section>
                <SectionTitle>Weather and best time to visit</SectionTitle>
                <p style={{ fontSize:16, color:TX, margin:'0 0 18px', lineHeight:1.65 }}>
                  Highlighted months are the best times to go. Temperatures show the typical daily low and high in °C.
                </p>
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
              </section>
            </div>

            {/* SIDEBAR */}
            <div style={{ position: isMobile ? 'static' : 'sticky', top: isMobile ? 'auto' : 24 }}>
              <div style={{ background:INK, color:SNOW, borderRadius:12, padding: isMobile ? '24px 22px' : '30px 26px', marginBottom:18 }}>
                <h3 style={{ fontSize:24, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.02em', margin:'0 0 12px' }}>Trip overview</h3>
                {[
                  {icon:<Clock size={15}/>,    label:'Duration',     val:'16 days'                },
                  {icon:<Mountain size={15}/>, label:'Difficulty',   val:'Moderate–Challenging'   },
                  {icon:<Compass size={15}/>,  label:'Max altitude', val:'3,800m (Lo Manthang)'   },
                  {icon:<Calendar size={15}/>, label:'Best time',    val:'Mar–May, Sep–Oct'       },
                  {icon:<MapPin size={15}/>,   label:'Start / end',  val:'Kathmandu'              },
                ].map((s,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.12)', fontSize:15.5, gap:12 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(243,246,249,0.65)' }}>{s.icon} {s.label}</span>
                    <span style={{ color:SNOW, fontWeight:600, textAlign:'right' }}>{s.val}</span>
                  </div>
                ))}
                <button onClick={()=>setShowBooking(true)}
                  style={{ width:'100%', background:SAFF, color:INK, border:'none', borderRadius:8, height:54, marginTop:22, fontSize:16, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer' }}>
                  Book this trip
                </button>
                <button onClick={() => window.open('/contact', '_blank', 'noopener,noreferrer')}
                  style={{ width:'100%', background:'transparent', color:SNOW, border:'1.5px solid rgba(255,255,255,0.4)', borderRadius:8, height:50, marginTop:12, fontSize:15, fontFamily:BODY_FONT, fontWeight:500, cursor:'pointer' }}>
                  Contact us
                </button>
              </div>

              <div style={{ background:W, borderRadius:10, padding: isMobile ? '18px' : '22px', border:'1px solid '+BD }}>
                <h4 style={{ fontSize:21, fontFamily:HEADING_FONT, fontWeight:600, color:INK, letterSpacing:'-0.015em', margin:'0 0 16px' }}>What to pack</h4>
                {packList.map((item,i)=>(
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
            <SectionTitle center mb={isMobile ? 20 : 24} size="clamp(1.8rem,5vw,2.7rem)">Cultural immersion</SectionTitle>
            <p style={{ ...bodyText, maxWidth:760, margin:`0 auto ${isMobile ? 32 : 48}px`, textAlign:'center' }}>
              Upper Mustang offers one of the most unique cultural experiences in Nepal. The region is deeply influenced by Tibetan Buddhism and retains many aspects of Tibetan culture, including traditional architecture, ancient monasteries, and customs. The ancient walled city of Lo Manthang, with its Tibetan-style palaces, monasteries, and temples, offers a glimpse into the region's historical significance. Throughout the trip, you'll have the opportunity to interact with the Mustang people, learn about their way of life, and experience their rich cultural traditions.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:22 }}>
              {culturalHighlights.map((c,i)=>(
                <div key={i} style={{ background:SNOW, borderRadius:10, padding:'26px', border:'1px solid '+BD }}>
                  <div style={{ color:INK, marginBottom:16 }}>{c.icon}</div>
                  <h3 style={{ fontSize:22, color:INK, margin:'0 0 12px', fontWeight:600, fontFamily: HEADING_FONT, letterSpacing:'-0.02em', lineHeight:1.2 }}>{c.title}</h3>
                  <p style={{ fontSize:15.5, color:TX, lineHeight:1.78, margin:0 }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <div style={{ background:INK, padding: isMobile ? '56px 20px' : '84px 32px', textAlign:'center', color:SNOW }}>
          <h2 style={{ fontSize:'clamp(2rem,6vw,3.4rem)', fontWeight:600, lineHeight:1.08, letterSpacing:'-0.03em', margin:'0 0 18px', fontFamily: HEADING_FONT }}>
            Ready to visit<br/>Upper Mustang?
          </h2>
          <p style={{ fontSize: isMobile ? 17 : 19, color:'rgba(243,246,249,0.82)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
            Our expert guides are ready to take you to the walled city of Lo Manthang — safely, memorably, and at your pace.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={()=>setShowBooking(true)}
              style={{ background:SAFF, color:INK, border:'none', height:56, padding: isMobile ? '0 30px' : '0 38px', borderRadius:8, fontSize:17, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer' }}>
              Book now
            </button>
            <button onClick={() => window.open('/contact', '_blank', 'noopener,noreferrer')}
              style={{ background:'transparent', color:SNOW, border:'2px solid rgba(255,255,255,0.55)', height:56, padding: isMobile ? '0 30px' : '0 38px', borderRadius:8, fontSize:17, fontFamily:BODY_FONT, fontWeight:500, cursor:'pointer' }}>
              Contact us
            </button>
          </div>
        </div>

        {/* Mobile: keep the booking button always within reach */}
        {isMobile && (
          <div style={{ position:'fixed', left:0, right:0, bottom:0, zIndex:50, background:W, borderTop:'1px solid '+BD, padding:'10px 16px calc(10px + env(safe-area-inset-bottom, 0px))', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div>
              <div style={{ fontSize:13, color:MUT, lineHeight:1.2 }}>Upper Mustang</div>
              <div style={{ fontSize:18, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.02em', color:INK, lineHeight:1.2 }}>16 days</div>
            </div>
            <button onClick={()=>setShowBooking(true)}
              style={{ background:SAFF, color:INK, border:'none', borderRadius:8, height:48, padding:'0 26px', fontSize:16, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer' }}>
              Book this trip
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UpperMustang;