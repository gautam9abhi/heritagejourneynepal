import { useRef, useState, useEffect } from 'react';
import {
  Utensils, Mountain, Clock, Calendar, ArrowUpRight,
  Users, Compass, MapPin, Heart, ChevronDown,
  Wind, Sun, CloudRain, CloudSnow, Cloud, Info, CheckCircle, X, Send
} from 'lucide-react';
import Layout from '@/components/Layout';

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

const HEADING_FONT = "'Cormorant Garamond', serif";
const ACCENT_FONT  = "'Playfair Display', serif";

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

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const isMobile = useIsMobile();
  const [step,    setStep]    = useState<number>(1);
  const [form,    setForm]    = useState<BookingForm>({
    name:'', email:'', phone:'', nationality:'',
    groupSize:'2', month:'', year:'2025',
    trekType:'Standard 15-Day', message:'',
  });
  const [errors,  setErrors]  = useState<BookingErrors>({});
  const [sending, setSending] = useState<boolean>(false);

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const years  = ['2025','2026'];

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
          trek:        'Manaslu Circuit — 15 Days',
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
    setForm({ name:'', email:'', phone:'', nationality:'', groupSize:'2', month:'', year:'2025', trekType:'Standard 15-Day', message:'' });
    setErrors({});
    onClose();
  };

  const field = (label: string, key: keyof BookingForm, type = 'text', placeholder = '') => (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#1C1009', fontFamily:'sans-serif', marginBottom:6, letterSpacing:'0.04em' }}>
        {label} {['name','email','month'].includes(key) && <span style={{ color:'#EC4899' }}>*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => { setForm(p => ({...p, [key]:e.target.value})); setErrors(p => { const n={...p}; delete n[key as keyof BookingErrors]; return n; }); }}
        style={{
          width:'100%', padding:'11px 14px', border:'1.5px solid ' + (errors[key as keyof BookingErrors] ? '#EC4899' : '#DDD0F0'),
          borderRadius:10, fontSize:15, color:'#1C1009', background:'#FFFBF7',
          fontFamily:'sans-serif', outline:'none', boxSizing:'border-box',
          transition:'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor='#6B4FA0'}
        onBlur={e  => e.target.style.borderColor = errors[key as keyof BookingErrors] ? '#EC4899' : '#DDD0F0'}
      />
      {errors[key as keyof BookingErrors] && <p style={{ fontSize:12, color:'#EC4899', margin:'4px 0 0', fontFamily:'sans-serif' }}>{errors[key as keyof BookingErrors]}</p>}
    </div>
  );

  const select = (label: string, key: keyof BookingForm, options: any[], required = false) => (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#1C1009', fontFamily:'sans-serif', marginBottom:6, letterSpacing:'0.04em' }}>
        {label} {required && <span style={{ color:'#EC4899' }}>*</span>}
      </label>
      <select
        value={form[key]}
        onChange={e => { setForm(p => ({...p, [key]:e.target.value})); setErrors(p => { const n={...p}; delete n[key as keyof BookingErrors]; return n; }); }}
        style={{
          width:'100%', padding:'11px 14px', border:'1.5px solid ' + (errors[key as keyof BookingErrors] ? '#EC4899' : '#DDD0F0'),
          borderRadius:10, fontSize:15, color:'#1C1009', background:'#FFFBF7',
          fontFamily:'sans-serif', outline:'none', boxSizing:'border-box', cursor:'pointer',
        }}
      >
        {options.map((o: any) => <option key={o.val||o} value={o.val||o}>{o.label||o}</option>)}
      </select>
      {errors[key as keyof BookingErrors] && <p style={{ fontSize:12, color:'#EC4899', margin:'4px 0 0', fontFamily:'sans-serif' }}>{errors[key as keyof BookingErrors]}</p>}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div onClick={handleClose}
      style={{ position:'fixed', inset:0, background:'rgba(28,16,9,0.75)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding: isMobile ? 12 : 20, backdropFilter:'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:'#F9F6FF', borderRadius:20, width:'100%', maxWidth:560, maxHeight:'92vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(0,0,0,0.35)', position:'relative' }}>

        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,#6B4FA0 0%,#4c3270 100%)', borderRadius:'20px 20px 0 0', padding: isMobile ? '24px 20px 20px' : '28px 32px 24px', color:'#FFFBF7' }}>
          <button onClick={handleClose} style={{ position:'absolute', top:18, right:20, background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%', width:34, height:34, cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={18}/>
          </button>
          <p style={{ fontSize:11, letterSpacing:'0.22em', color:'rgba(255,255,255,0.55)', textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:8 }}>Heritage Journey Nepal</p>
          <h2 style={{ fontSize: isMobile ? 21 : 24, fontWeight:700, margin:'0 0 4px', color:'#FFFBF7', fontFamily: HEADING_FONT }}>Book Your Trek</h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.65)', margin:0, fontFamily:'sans-serif' }}>Manaslu Circuit · 15 Days · From USD 1,650/person</p>

          {/* Step indicators */}
          {step < 3 && (
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:20, flexWrap:'wrap' }}>
              {[1,2].map(s => (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{
                    width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    background: step >= s ? '#EC4899' : 'rgba(255,255,255,0.15)',
                    color:'white', fontSize:13, fontWeight:700, fontFamily:'sans-serif',
                    border: step === s ? '2px solid #fce7f3' : '2px solid transparent',
                    transition:'all 0.3s',
                  }}>{s}</div>
                  <span style={{ fontSize:12, color: step >= s ? '#fce7f3' : 'rgba(255,255,255,0.4)', fontFamily:'sans-serif' }}>
                    {s===1 ? 'Your Details' : 'Confirm'}
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
                {field('Full Name',    'name',    'text',  'e.g. John Smith')}
                {field('Email Address','email',   'email', 'e.g. john@email.com')}
                {field('Phone / WhatsApp','phone','tel',   'e.g. +1 555 0123')}
                {field('Nationality',  'nationality','text','e.g. British')}
              </div>

              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 0 : '0 16px' }}>
                {select('Group Size', 'groupSize', Array.from({length:11},(_,i)=>({val:String(i+2),label:`${i+2} ${i===0?'person':'people'}`})))}
                {select('Preferred Month', 'month', [{val:'',label:'Select month…'},...months], true)}
                {select('Year', 'year', years)}
              </div>

              {select('Trek Package', 'trekType', [
                'Standard 15-Day Trek',
                'Private Group (custom dates)',
                'Photography Special (extra nights at Samagaon)',
                'Extended (add Tsum Valley, 20 days)',
              ])}

              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#1C1009', fontFamily:'sans-serif', marginBottom:6 }}>
                  Special Requests / Questions
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({...p, message:e.target.value}))}
                  placeholder="Dietary requirements, fitness concerns, questions about the route..."
                  rows={3}
                  style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #E5D9CE', borderRadius:10, fontSize:15, color:'#1C1009', background:'#F9F6FF', fontFamily:'sans-serif', outline:'none', resize:'vertical', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor='#6B4FA0'}
                  onBlur={e  => e.target.style.borderColor='#E5D9CE'}
                />
              </div>

              <button onClick={handleNext}
                style={{ width:'100%', background:'#6B4FA0', color:'white', border:'none', borderRadius:40, padding:'15px', fontSize:16, fontFamily:'sans-serif', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 18px rgba(107,79,160,0.35)' }}>
                Review Booking <ArrowUpRight size={18}/>
              </button>
            </div>
          )}

          {/* ── STEP 2: Confirm ── */}
          {step === 2 && (
            <div>
              <div style={{ background:'#f3eeff', border:'1px solid #DDD0F0', borderRadius:14, padding: isMobile ? 16 : 22, marginBottom:24 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#1C1009', fontFamily:'sans-serif', marginBottom:16 }}>Booking Summary</h3>
                {[
                  ['Trek',        'Manaslu Circuit — 15 Days'],
                  ['Name',        form.name],
                  ['Email',       form.email],
                  ['Phone',       form.phone || '—'],
                  ['Nationality', form.nationality || '—'],
                  ['Group Size',  form.groupSize + ' people'],
                  ['Preferred',   form.month + ' ' + form.year],
                  ['Package',     form.trekType],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #E5D9CE', fontSize:14, fontFamily:'sans-serif', gap:12 }}>
                    <span style={{ color:'#8C7B6E', fontWeight:500 }}>{k}</span>
                    <span style={{ color:'#1C1009', fontWeight:600, textAlign:'right', maxWidth:'60%' }}>{v}</span>
                  </div>
                ))}
                {form.message && (
                  <div style={{ marginTop:12, padding:'10px 0', fontSize:14, color:'#4A3728', fontFamily:'sans-serif' }}>
                    <span style={{ fontWeight:600, color:'#8C7B6E' }}>Message: </span>{form.message}
                  </div>
                )}
              </div>

              <div style={{ background:'#f3eeff', border:'1px solid #6B4FA030', borderRadius:10, padding:'14px 16px', marginBottom:22, display:'flex', gap:10 }}>
                <Info size={18} color='#C2410C' style={{ flexShrink:0, marginTop:2 }}/>
                <p style={{ fontSize:13, color:'#4A3728', margin:0, lineHeight:1.65, fontFamily:'sans-serif' }}>
                  This is an <strong>enquiry / booking request</strong> — not a payment. Our team will contact you within 24 hours to confirm availability and arrange payment.
                </p>
              </div>

              <div style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:12 }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: isMobile ? 'none' : 1, background:'transparent', color:'#4A3728', border:'1.5px solid #E5D9CE', borderRadius:40, padding:'14px', fontSize:15, fontFamily:'sans-serif', cursor:'pointer' }}>
                  ← Edit Details
                </button>
                <button onClick={handleSubmit} disabled={sending}
                  style={{ flex: isMobile ? 'none' : 2, background: sending ? '#9ca3af' : '#EC4899', color:'white', border:'none', borderRadius:40, padding:'14px', fontSize:15, fontFamily:'sans-serif', fontWeight:700, cursor: sending ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: sending ? 'none' : '0 4px 18px rgba(236,72,153,0.4)' }}>
                  {sending ? '⏳ Sending…' : <><Send size={16}/> Confirm Booking Request</>}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Done ── */}
          {step === 3 && (
            <div style={{ textAlign:'center', padding:'12px 0 8px' }}>
              <div style={{ width:72, height:72, background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:32 }}>
                ✅
              </div>
              <h3 style={{ fontSize: isMobile ? 20 : 22, fontWeight:700, color:'#1C1009', marginBottom:10, fontFamily: HEADING_FONT }}>Booking Request Sent!</h3>
              <p style={{ fontSize:16, color:'#4A3728', lineHeight:1.75, marginBottom:8 }}>
                Thank you, <strong>{form.name}</strong>! We've received your request for <strong>{form.month} {form.year}</strong>.
              </p>
              <p style={{ fontSize:15, color:'#8C7B6E', lineHeight:1.75, marginBottom:28, fontFamily:'sans-serif' }}>
                A Heritage Journey Nepal guide will email <strong>{form.email}</strong> within 24 hours to confirm availability, answer your questions, and arrange next steps.
              </p>
              <div style={{ background:'#fdf6ee', border:'1px solid #E5D9CE', borderRadius:12, padding:'16px 20px', marginBottom:24, textAlign:'left' }}>
                <p style={{ fontSize:14, fontWeight:700, color:'#1C1009', fontFamily:'sans-serif', marginBottom:8 }}>What happens next?</p>
                {['We confirm availability for your dates','We send a detailed trip proposal & quote','You pay a 20% deposit to secure your spot','Full balance due 6 weeks before departure'].map((s,i)=>(
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:6, fontSize:14, color:'#4A3728', fontFamily:'sans-serif' }}>
                    <CheckCircle size={16} color='#15803d' style={{ flexShrink:0, marginTop:2 }}/> {s}
                  </div>
                ))}
              </div>
              <button onClick={handleClose}
                style={{ width:'100%', background:'#6B4FA0', color:'white', border:'none', borderRadius:40, padding:'14px', fontSize:16, fontFamily:'sans-serif', fontWeight:700, cursor:'pointer' }}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── HERITAGE JOURNEY NEPAL — brand colours (matches ABC page) ───
   Purple  #5c37a0  heritage-purple (primary accent, icons)
   Pink    #EC4899  heritage-pink   (CTA buttons)
   Brown   #5C3D2E  heritage-brown  (headings, body text)
   Light   #f9f6ff  heritage-light  (page background)
   Border  #DDD0F0  soft purple-tinted border
   Muted   #8B7BAE  muted purple-grey
─────────────────────────────────────────────────────── */
const AC  = '#5c37a0';   // heritage-purple — primary accent
const RO  = '#EC4899';   // heritage-pink   — CTA buttons
const W   = '#FFFFFF';
const BG  = '#f9f6ff00';   // heritage-light
const H   = '#5C3D2E';   // heritage-brown headings
const TX  = '#6B4C35';   // heritage-brown/70 body
const BD  = '#DDD0F0';   // soft purple border
const MUT = '#8B7BAE';   // muted purple-grey

/* ── ITINERARY DATA ─────────────────────────────────── */
const itinerary = [
  {
    day:1, title:'Arrival in Kathmandu', time:'—', alt:'1,400m', diff:'Easy', type:'city',
    what:'You arrive. We take care of everything.',
    brief:'A Heritage Journey Nepal representative meets you at Tribhuvan International Airport (TIA) and drives you to your hotel in Thamel. In the afternoon, our team briefs you on the trek and prepares your Manaslu Restricted Area Permit paperwork — required because this route passes through a protected border region.',
    tip:'Tip: Manaslu is a restricted area — bring 4 passport photos and your original passport for permit processing.',
    overview:'Because the Manaslu region borders Tibet, trekkers here need a Restricted Area Permit and must travel with a licensed guide at all times, in a group of at least two. Use today to rest, wander Thamel, or visit Boudhanath Stupa before the long drive tomorrow.',
  },
  {
    day:2, title:'Drive to Machha Khola', time:'7–8 hrs', alt:'869m', diff:'Easy', type:'drive',
    what:'A long, scenic drive following the Budhi Gandaki river.',
    brief:'Leave Kathmandu early and drive via Arughat, following the Budhi Gandaki river on a rough mountain road that gets progressively wilder. The tarmac ends outside Arughat and the final stretch to Machha Khola (869m) is a bumpy but spectacular ride through terraced hillsides.',
    tip:'Tip: This is the roughest driving day of the trip. Take motion-sickness tablets if you\'re prone to car sickness.',
    overview:'Machha Khola ("Fish River") sits right on the Budhi Gandaki. It\'s a modest riverside village of a few teahouses — your first taste of how remote and undeveloped this trek is compared to Nepal\'s more famous routes.',
  },
  {
    day:3, title:'Trek to Jagat', time:'6–7 hrs', alt:'1,340m', diff:'Moderate', type:'trek',
    what:'Suspension bridges, waterfalls, and the Budhi Gandaki gorge.',
    brief:'The trail hugs the Budhi Gandaki gorge, crossing several long suspension bridges strung high above the river and passing waterfalls that tumble straight onto the path. You pass through Khorlabesi and Tatopani (with natural hot springs) before reaching Jagat, a stone-paved village built on slabs of rock.',
    tip:'Tip: Jagat\'s trailside houses are built from flat stone slabs quarried locally — look closely at the paving underfoot too.',
    overview:'Jagat marks the first police and permit checkpoint of the trek, where your Restricted Area Permit is checked for the first time. The village\'s stone architecture is some of the most photogenic on the lower trail.',
  },
  {
    day:4, title:'Trek to Deng', time:'6–7 hrs', alt:'1,860m', diff:'Moderate', type:'trek',
    what:'Crossing into the restricted Manaslu region proper.',
    brief:'Beyond Jagat the trail passes through Salleri, Philim (a large Gurung village), and the tiny hamlet of Ekle Bhatti before reaching Deng. The gorge narrows further and bamboo and rhododendron forest close in around the trail.',
    tip:'Tip: Philim is a good lunch stop — one of the last larger villages before the trail becomes truly remote.',
    overview:'From here on, teahouses become simpler and less frequent, and you start to feel the shift from the relatively populated lower valley into genuine wilderness. Deng itself is a scattering of houses in a narrow bend of the gorge.',
  },
  {
    day:5, title:'Trek to Namrung', time:'5–6 hrs', alt:'2,630m', diff:'Moderate', type:'trek',
    what:'Culture begins to shift toward Tibetan Buddhism.',
    brief:'The trail climbs steadily through pine and rhododendron forest via Rana and Bihi Phedi. Prayer flags and mani walls start appearing more frequently as you approach Namrung — the gateway to the upper Nubri valley, where the population becomes predominantly Tibetan Buddhist.',
    tip:'Tip: Namrung has the best-stocked lodges on the trek so far — a good place to buy any last snacks before the high villages.',
    overview:'Namrung sits at a natural checkpoint where the landscape, architecture, and faces around you visibly change. Chortens (stupas) and carved mani stones now line the trail, and the peaks of the Manaslu massif begin to appear between the hills.',
  },
  {
    day:6, title:'Trek to Lho', time:'4–5 hrs', alt:'3,180m', diff:'Moderate', type:'trek',
    what:'First close-up views of Mt. Manaslu.',
    brief:'A shorter, gentler day through forest and past mani walls to Lho — the first village with an unobstructed, close-up view of Manaslu (8,163m) itself. Visit Ribung Gompa, a monastery perched above the village, in the afternoon.',
    tip:'Tip: The viewpoint just above Lho\'s monastery is one of the best photo spots on the entire trek — go at golden hour.',
    overview:'Lho is a picture-book Tibetan-influenced village: whitewashed chorten, fluttering prayer flags, terraced barley fields, and Manaslu rising directly behind it. Many trekkers say this is the moment the trek "really begins."',
  },
  {
    day:7, title:'Trek to Samagaon', time:'4–5 hrs', alt:'3,530m', diff:'Moderate', type:'trek',
    what:'A large Tibetan-influenced village beneath the Manaslu massif.',
    brief:'A relatively easy walk through Shyala, with Manaslu, Manaslu North, and Naike Peak all visible along the way, before arriving at Samagaon — the largest and most important village in the upper Nubri valley.',
    tip:'Tip: Samagaon is where most trekkers base themselves for two nights — the acclimatization day here is essential, not optional.',
    overview:'Samagaon feels like a small Tibetan town: stone houses, yak herds grazing on the outskirts, and a large working monastery. It sits directly beneath the southern face of Manaslu, one of the most dramatic mountain backdrops of any village in Nepal.',
  },
  {
    day:8, title:'Acclimatization Day in Samagaon', time:'4–5 hrs (optional hike)', alt:'3,530m', diff:'Moderate', type:'trek',
    what:'Rest day — with an optional hike toward Manaslu Base Camp.',
    brief:'A full rest day for altitude acclimatization, with an optional half-day hike up to Manaslu Base Camp (around 4,800m) or to Pungyen Gompa, a remote monastery with spectacular close-range views of the mountain.',
    tip:'Tip: "Climb high, sleep low" — even on a rest day, a few hours of hiking upward before returning to sleep in Samagaon helps your body adjust.',
    overview:'This acclimatization day is critical before the push toward Larkya La. Whichever optional hike you choose, you\'ll get some of the closest views of Manaslu\'s glaciers and seracs found anywhere on the trek.',
  },
  {
    day:9, title:'Trek to Samdo', time:'3–4 hrs', alt:'3,860m', diff:'Moderate', type:'trek',
    what:'The last village before the Tibet border.',
    brief:'A short, gentle trek that crosses the Budhi Gandaki on a wooden bridge and climbs through juniper scrub to Samdo — a wind-swept village of around 150 households, the last permanent settlement before the Tibetan border, just a few hours\' walk away.',
    tip:'Tip: Samdo\'s short walking time makes it another good soft acclimatization day — take a short afternoon walk up the ridge behind the village.',
    overview:'Samdo\'s residents are ethnically Tibetan, and until the border was formalized many families traded regularly across it. The village has a stark, high-altitude beauty — treeless hills, prayer flags snapping in the wind, and views back down the valley.',
  },
  {
    day:10, title:'Trek to Dharamsala (Larke Phedi)', time:'3–4 hrs', alt:'4,460m', diff:'Moderate', type:'trek',
    what:'A short but crucial altitude day at the foot of the pass.',
    brief:'A short trekking day, deliberately kept light, crossing the Budhi Gandaki one final time and climbing steadily through open, high-alpine terrain to Dharamsala (also called Larke Phedi) — a very basic settlement of just a couple of lodges at the foot of the Larkya La Pass.',
    tip:'Tip: Facilities here are extremely basic — expect dormitory-style rooms and simple meals. This is the wildest, most remote night of the trek.',
    overview:'Everything about today points toward tomorrow: the short distance leaves your body rested for the pass crossing, while the barren, glacier-scoured landscape around Dharamsala makes clear you are now deep in high-altitude wilderness.',
  },
  {
    day:11, title:'Cross Larkya La Pass to Bimtang', time:'8–9 hrs', alt:'3,720m', diff:'Challenging', type:'summit',
    what:'THE day — crossing the 5,106m Larkya La Pass.',
    brief:'An early pre-dawn start (often 4–5am) for the toughest and most rewarding day of the trek. Climb steadily over moraine and snow to the summit of Larkya La (5,106m), with sweeping views of Manaslu, Himlung Himal, Cheo Himal, and Kang Guru, before a long, knee-testing descent to the meadows of Bimtang (3,720m).',
    tip:'Tip: Start walking in the dark with a headlamp — the pass is safest to cross before mid-morning winds pick up. Dress in full winter layers.',
    overview:'Larkya La is a genuine high-mountain pass — icy, exposed, and utterly spectacular. Reaching the cairns and prayer flags at the top, ringed by six-thousand and seven-thousand metre peaks in every direction, is the emotional peak of the entire circuit. The descent into Bimtang\'s wide glacial meadow feels like a reward.',
  },
  {
    day:12, title:'Trek to Gho', time:'5–6 hrs', alt:'2,515m', diff:'Moderate', type:'trek',
    what:'Descending back into forest and yak pastures.',
    brief:'A gentler descent through rhododendron and pine forest and open yak pastures, leaving the high alpine terrain of Larkya La behind. The trail follows the Dudh Khola downstream toward Gho, a small farming settlement.',
    tip:'Tip: Your legs will feel yesterday\'s descent — take this day slowly and let your knees recover.',
    overview:'The scenery softens noticeably today: after two weeks above the treeline and around glaciers, the reappearance of forest, birdsong, and warmer air feels like re-entering the world.',
  },
  {
    day:13, title:'Trek to Dharapani', time:'5–6 hrs', alt:'1,960m', diff:'Moderate', type:'trek',
    what:'Rejoining the busier Annapurna Circuit trail.',
    brief:'Continue down through Tal and Karte, where the trail merges with the classic Annapurna Circuit route — noticeably busier and better developed than anywhere on the Manaslu side. Arrive at Dharapani, a bustling trail-town by comparison.',
    tip:'Tip: Mobile signal and better wifi return here — your first proper connectivity in over a week.',
    overview:'Dharapani sits within the Annapurna Conservation Area, and the road-accessible infrastructure here (better lodges, wider food choice) marks a clear contrast with the remote villages you\'ve just spent two weeks in.',
  },
  {
    day:14, title:'Drive to Kathmandu', time:'8–9 hrs', alt:'1,400m', diff:'Easy', type:'drive',
    what:'The long drive home via Besisahar.',
    brief:'A full day\'s drive from Dharapani via Besisahar back to Kathmandu — partly on a rough mountain road, then paved highway for the final stretch. Arrive in the evening for a well-earned hot shower and a real bed.',
    tip:'Tip: Book a jeep rather than a local bus for this stretch — considerably faster and more comfortable.',
    overview:'The drive traces the edge of the Annapurna range for the first few hours before dropping into the Marsyangdi valley and onto the highway. It\'s a long day, but a good one for reflecting on the trek behind you.',
  },
  {
    day:15, title:'Departure from Kathmandu', time:'—', alt:'—', diff:'Easy', type:'city',
    what:'Time to fly home — carrying the mountains with you.',
    brief:'Depending on your flight time, the morning is free for last-minute souvenir shopping in Thamel or a final visit to Boudhanath Stupa. Your guide transfers you to Tribhuvan International Airport (TIA) with plenty of time before departure.',
    tip:'Tip: Allow extra time at TIA — international check-in queues can be long. We recommend arriving 3 hours before departure.',
    overview:'You leave Nepal having crossed a 5,106m Himalayan pass, walked beneath the world\'s eighth-highest mountain, and spent two weeks in one of the least-visited restricted regions in the country. Few trekking routes anywhere offer this much genuine remoteness.',
  },
];

const gallery = [
  { src:'/images/trekking/manaslu/manaslu-1.jpg', alt:'Mount Manaslu',              caption:'Mount Manaslu (8,163m) rising above the Nubri valley' },
  { src:'/images/trekking/manaslu/manaslu-2.jpg', alt:'Larkya La Pass',             caption:'Prayer flags at Larkya La Pass, 5,106m' },
  { src:'/images/trekking/manaslu/manaslu-3.jpg', alt:'Samagaon village',           caption:'Samagaon — the largest village in the upper Nubri valley' },
  { src:'/images/trekking/manaslu/manaslu-4.jpg', alt:'Tibetan Buddhist monastery', caption:'Ribung Gompa monastery above Lho' },
  { src:'/images/trekking/manaslu/manaslu-5.jpg', alt:'Budhi Gandaki valley',       caption:'The Budhi Gandaki gorge on the lower trail' },
];

const weatherData = [
  { m:'Jan', lo:-12, hi:5,  cond:'snow',  ok:false },
  { m:'Feb', lo:-10, hi:7,  cond:'snow',  ok:false },
  { m:'Mar', lo:-5,  hi:12, cond:'mixed', ok:true  },
  { m:'Apr', lo:0,   hi:15, cond:'cloud', ok:true  },
  { m:'May', lo:2,   hi:17, cond:'cloud', ok:true  },
  { m:'Jun', lo:5,   hi:18, cond:'rain',  ok:false },
  { m:'Jul', lo:7,   hi:18, cond:'rain',  ok:false },
  { m:'Aug', lo:7,   hi:18, cond:'rain',  ok:false },
  { m:'Sep', lo:2,   hi:16, cond:'mixed', ok:true  },
  { m:'Oct', lo:-3,  hi:14, cond:'sun',   ok:true  },
  { m:'Nov', lo:-8,  hi:10, cond:'sun',   ok:true  },
  { m:'Dec', lo:-12, hi:6,  cond:'snow',  ok:false },
];

const includes = [
  'Airport transfers and all ground transportation',
  '2 nights hotel in Kathmandu (before and after trek)',
  'All teahouse accommodation during the trek',
  'All meals during trek (breakfast, lunch, dinner)',
  'Licensed English-speaking trekking guide (mandatory for restricted areas)',
  'Porter (1 per 2 trekkers, max 15kg per porter)',
  'Manaslu Restricted Area Permit (RAP)',
  'Manaslu Conservation Area Permit (MCAP)',
  'Annapurna Conservation Area Permit (ACAP)',
  'First-aid kit and emergency evacuation plan',
  'Farewell dinner in Kathmandu',
];
const excludes = [
  'International flights to/from Nepal',
  'Nepal visa on arrival (~USD 50)',
  'Travel and health insurance covering helicopter evacuation to 5,200m (mandatory)',
  'Personal trekking gear and equipment',
  'Hot showers, wifi and device charging fees on trail',
  'Tips for guide and porter (customary)',
  'Personal expenses and souvenirs',
];

/* ── Waypoints ─────────────────────────────────────── */
const waypoints = [
  { x:400, y:640, label:'Kathmandu',            day:'1, 14–15', start:true },
  { x:330, y:560, label:'Machha Khola',         day:2 },
  { x:298, y:520, label:'Jagat',                day:3 },
  { x:270, y:478, label:'Deng',                 day:4 },
  { x:250, y:432, label:'Namrung',              day:5 },
  { x:236, y:390, label:'Lho',                  day:6 },
  { x:220, y:350, label:'Samagaon',             day:'7–8', city:true },
  { x:206, y:305, label:'Samdo',                day:9 },
  { x:196, y:262, label:'Dharamsala',           day:10 },
  { x:210, y:210, label:'Larkya La Pass ★',     day:11, peak:true },
  { x:250, y:250, label:'Bimtang',              day:11 },
  { x:280, y:305, label:'Gho',                  day:12 },
  { x:322, y:365, label:'Dharapani',            day:13 },
];

/* ── HELPERS ────────────────────────────────────────── */
const diffStyle = (d: string) => ({
  Easy:        { bg:'#dcfce7', text:'#166534', label:'Easy'        },
  Moderate:    { bg:'#fef3c7', text:'#92400e', label:'Moderate'    },
  Challenging: { bg:'#fee2e2', text:'#991b1b', label:'Challenging' },
}[d] || { bg:'#f3f4f6', text:'#374151', label:d });

const typeIcon = (t: string): string => ({
  drive:   '↻',
  summit:  '▲',
  sunrise: '★',
  city:    '✈',
}[t] || '→');

const typeColor = (t: string) => ({
  city:    '#6B4FA0',
  drive:   '#0284c7',
  trek:    '#15803d',
  sunrise: '#d97706',
  summit:  '#dc2626',
}[t] || '#6B7280');

const WeatherIcon = ({ cond, size=20 }: { cond: string; size?: number }) => {
  const p = { size, strokeWidth:1.5 };
  if (cond==='sun')   return <Sun       {...p} color={AC}  />;
  if (cond==='rain')  return <CloudRain {...p} color='#0284c7' />;
  if (cond==='snow')  return <CloudSnow {...p} color='#93c5fd' />;
  if (cond==='cloud') return <Cloud     {...p} color='#9ca3af' />;
  return <Wind {...p} color='#9ca3af' />;
};

/* ── GALLERY ─────────────────────────────────────────── */
const Gallery = () => {
  const isMobile = useIsMobile();
  const [lb, setLb] = useState(null);
  return (
    <>
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.55fr 1fr',
        gridTemplateRows: isMobile ? 'repeat(5, 200px)' : '240px 240px',
        gap:10,
      }}>
        <div onClick={() => setLb(0)} style={{ gridRow: isMobile ? 'auto' : '1 / 3', borderRadius:14, overflow:'hidden', cursor:'zoom-in', position:'relative', background:BG }}>
          <img src={gallery[0].src} alt={gallery[0].alt} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.4s' }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'40px 18px 16px', background:'linear-gradient(transparent,rgba(0,0,0,0.65))' }}>
            <p style={{ color:W, fontSize:14, fontFamily:'sans-serif', margin:0 }}>{gallery[0].caption}</p>
          </div>
        </div>
        {gallery.slice(1).map((img,i) => (
          <div key={i} onClick={() => setLb(i+1)} style={{ borderRadius:12, overflow:'hidden', cursor:'zoom-in', position:'relative', background:BG }}>
            <img src={img.src} alt={img.alt} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.4s' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}/>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'24px 12px 10px', background:'linear-gradient(transparent,rgba(0,0,0,0.58))' }}>
              <p style={{ color:W, fontSize:12, fontFamily:'sans-serif', margin:0 }}>{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
      {lb !== null && (
        <div onClick={() => setLb(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding: isMobile ? 16 : 24 }}>
          <div style={{ position:'relative', maxWidth:900, width:'100%' }} onClick={e => e.stopPropagation()}>
            <img src={gallery[lb].src} alt={gallery[lb].alt} style={{ width:'100%', borderRadius:12, display:'block', maxHeight:'80vh', objectFit:'contain' }}/>
            <p style={{ color:'rgba(255,255,255,0.8)', textAlign:'center', fontFamily:'sans-serif', fontSize:15, marginTop:12 }}>{gallery[lb].caption}</p>
            {!isMobile && (
              <>
                <button onClick={() => setLb((lb-1+gallery.length)%gallery.length)} style={{ position:'absolute', left:-52, top:'45%', background:'none', border:'none', color:W, fontSize:36, cursor:'pointer' }}>‹</button>
                <button onClick={() => setLb((lb+1)%gallery.length)} style={{ position:'absolute', right:-52, top:'45%', background:'none', border:'none', color:W, fontSize:36, cursor:'pointer' }}>›</button>
              </>
            )}
            {isMobile && (
              <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:14 }}>
                <button onClick={() => setLb((lb-1+gallery.length)%gallery.length)} style={{ background:'rgba(255,255,255,0.12)', border:'none', color:W, fontSize:22, cursor:'pointer', borderRadius:'50%', width:40, height:40 }}>‹</button>
                <button onClick={() => setLb((lb+1)%gallery.length)} style={{ background:'rgba(255,255,255,0.12)', border:'none', color:W, fontSize:22, cursor:'pointer', borderRadius:'50%', width:40, height:40 }}>›</button>
              </div>
            )}
            <button onClick={() => setLb(null)} style={{ position:'absolute', top:-40, right:0, background:'none', border:'none', color:'rgba(255,255,255,0.7)', fontSize:28, cursor:'pointer' }}>✕</button>
          </div>
        </div>
      )}
    </>
  );
};

/* ── ANIMATED ITINERARY ─────────────────────────────── */
const ItineraryTimeline = () => {
  const isMobile = useIsMobile();
  const [visible,   setVisible]   = useState<number[]>([]);
  const [openDay,   setOpenDay]   = useState<number | null>(null);
  const [progress,  setProgress]  = useState<number>(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* scroll-driven visibility */
  useEffect(() => {
    const obs = refs.current.map((el, i) => {
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setTimeout(() => setVisible(p => p.includes(i) ? p : [...p, i]), i * 60); },
        { threshold: 0.1 }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o => o && o.disconnect());
  }, []);

  /* scroll-driven progress bar fill */
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      const total = rect.height;
      const scrolled = Math.max(0, winH - rect.top);
      setProgress(Math.min(100, (scrolled / (total + winH)) * 140));
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const railPad = isMobile ? 40 : 64;
  const dotOffset = isMobile ? -36 : -54;
  const connectorOffset = isMobile ? -28 : -46;
  const connectorWidth = isMobile ? 14 : 22;
  const cardBodyPadLeft = isMobile ? 18 : 76;

  return (
    <div ref={containerRef} style={{ position:'relative', paddingLeft: railPad }}>

      {/* Animated progress spine */}
      <div style={{ position:'absolute', left: isMobile ? 14 : 22, top:8, bottom:8, width:4, background:BD, borderRadius:4 }}/>
      <div style={{
        position:'absolute', left: isMobile ? 14 : 22, top:8, width:4, borderRadius:4,
        background:'linear-gradient(to bottom, #15803d, '+AC+', '+RO+')',
        height: progress + '%',
        transition:'height 0.3s ease',
        boxShadow:'0 0 8px rgba(194,65,12,0.4)',
      }}/>

      {itinerary.map((day, i) => {
        const open     = openDay === day.day;
        const vis      = visible.includes(i);
        const dc       = diffStyle(day.diff);
        const tc       = typeColor(day.type);
        const isKey    = day.type === 'summit' || day.type === 'sunrise';

        return (
          <div key={day.day} ref={el => refs.current[i] = el}
            style={{
              position:'relative', marginBottom:16,
              opacity:   vis ? 1 : 0,
              transform: vis ? 'translateX(0) scale(1)' : 'translateX(-32px) scale(0.97)',
              transition:`opacity 0.5s ${i*0.04}s ease, transform 0.5s ${i*0.04}s ease`,
            }}
          >
            {/* Spine connector line to dot */}
            <div style={{
              position:'absolute', left: connectorOffset, top:28, width: connectorWidth, height:2,
              background: vis ? 'linear-gradient(to right,'+AC+','+BD+')' : BD,
              transition:'background 0.6s',
            }}/>

            {/* Dot on spine */}
            <div style={{
              position:'absolute', left: dotOffset, top:18,
              width:26, height:26, borderRadius:'50%', zIndex:2,
              background: isKey ? (day.type==='summit' ? RO : AC) : (open ? AC : W),
              border:'3px solid ' + (isKey ? (day.type==='summit' ? RO : AC) : AC),
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12,
              boxShadow: isKey ? '0 0 0 5px '+(day.type==='summit' ? RO : AC)+'30, 0 2px 8px rgba(0,0,0,0.2)'
                               : open ? '0 0 0 4px '+AC+'25' : '0 1px 4px rgba(0,0,0,0.15)',
              transition:'all 0.3s',
              animation: isKey ? 'pulse 2s infinite' : 'none',
            }}>
              {typeIcon(day.type)}
            </div>

            {/* Card */}
            <div
              onClick={() => setOpenDay(open ? null : day.day)}
              style={{
                background: open
                  ? 'linear-gradient(135deg,'+AC+'08,'+RO+'05)'
                  : isKey ? AC+'06' : W,
                border:'2px solid ' + (open ? AC+'60' : isKey ? AC+'30' : BD),
                borderRadius:16, overflow:'hidden', cursor:'pointer',
                boxShadow: open ? '0 8px 32px '+AC+'20' : isKey ? '0 2px 12px '+AC+'15' : '0 1px 6px rgba(0,0,0,0.07)',
                transition:'all 0.3s',
              }}
            >
              {/* Top colour bar for key days */}
              {isKey && (
                <div style={{ height:4, background: day.type==='summit' ? 'linear-gradient(90deg,'+AC+','+RO+')' : 'linear-gradient(90deg,'+AC+',#f59e0b)' }}/>
              )}

              {/* Header */}
              <div style={{ display:'flex', alignItems:'flex-start', gap: isMobile ? 10 : 14, padding: isMobile ? '14px' : '16px 18px' }}>
                {/* Day number badge */}
                <div style={{ flexShrink:0, textAlign:'center', minWidth: isMobile ? 38 : 44 }}>
                  <div style={{
                    width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, borderRadius:12,
                    background: open ? AC : isKey ? AC+'15' : BG,
                    color: open ? W : AC,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: isMobile ? 14 : 16, fontWeight:800, fontFamily:'sans-serif',
                    border:'2px solid '+(open ? AC : AC+'30'),
                    transition:'all 0.3s',
                  }}>
                    {day.day}
                  </div>
                  <div style={{ fontSize:9, color:MUT, fontFamily:'sans-serif', marginTop:3 }}>DAY</div>
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  {/* Type pill */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
                    <span style={{ fontSize:10, fontFamily:'sans-serif', fontWeight:700, color:W, background:tc, padding:'2px 10px', borderRadius:20, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                      {day.type === 'summit' ? 'Pass-Crossing Day' :
                       day.type === 'sunrise' ? 'Sunrise Day' :
                       day.type === 'drive'   ? 'Drive Day' :
                       day.type === 'city'    ? 'City Day' : 'Trek Day'}
                    </span>
                    <span style={{ fontSize:11, fontFamily:'sans-serif', fontWeight:600, background:dc.bg, color:dc.text, padding:'2px 10px', borderRadius:20 }}>
                      {dc.label}
                    </span>
                  </div>

                  {/* Title */}
                  <div style={{ fontSize: isMobile ? 16 : 18, fontWeight:700, color: open ? AC : H, fontFamily: HEADING_FONT, marginBottom:4, lineHeight:1.25, transition:'color 0.2s' }}>
                    {day.title}
                  </div>

                  {/* "What is this day?" — always visible */}
                  <div style={{ fontSize: isMobile ? 13.5 : 15, color:TX, lineHeight:1.55, marginBottom:6, fontStyle:'italic' }}>
                    {day.what}
                  </div>

                  {/* Meta chips row */}
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {day.time !== '—' && (
                      <span style={{ fontSize:11, color:AC, background:AC+'12', padding:'3px 10px', borderRadius:20, fontFamily:'sans-serif', display:'flex', alignItems:'center', gap:4 }}>
                        ⏱ {day.time}
                      </span>
                    )}
                    {day.alt !== '—' && (
                      <span style={{ fontSize:11, color:TX, background:BD+'80', padding:'3px 10px', borderRadius:20, fontFamily:'sans-serif', display:'flex', alignItems:'center', gap:4 }}>
                        ⛰ {day.alt}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ flexShrink:0, marginTop:4 }}>
                  <ChevronDown size={18} color={open ? AC : MUT}
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.3s' }}/>
                </div>
              </div>

              {/* Expandable detail */}
              <div style={{ maxHeight: open ? 700 : 0, overflow:'hidden', transition:'max-height 0.5s ease' }}>
                <div style={{ padding: isMobile ? '0 16px 20px' : `0 20px 22px ${cardBodyPadLeft}px`, borderTop:'1px dashed '+BD }}>

                  {/* Brief summary */}
                  <p style={{ fontSize: isMobile ? 14.5 : 16, lineHeight:1.8, color:TX, margin:'16px 0 14px', fontWeight:500 }}>
                    {day.brief}
                  </p>

                  {/* Tip box */}
                  <div style={{ background:AC+'0d', border:'1px solid '+AC+'30', borderRadius:10, padding:'12px 14px', marginBottom:14, display:'flex', gap:10, alignItems:'flex-start' }}>
                    <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
                    <p style={{ fontSize:13.5, color:AC, margin:0, lineHeight:1.65, fontFamily:'sans-serif' }}>
                      {day.tip.replace('💡 Tip: ','')}
                    </p>
                  </div>

                  {/* Full overview */}
                  <p style={{ fontSize: isMobile ? 14 : 15, lineHeight:1.85, color:TX, margin:0 }}>
                    {day.overview}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(194,65,12,0.2); }
          50%      { box-shadow: 0 0 0 8px rgba(194,65,12,0.08); }
        }
      `}</style>
    </div>
  );
};

/* ── TREK MAP ───────────────────────────────────────── */
const TrekMap = () => {
  const [hov, setHov] = useState(null);
  const buildPath = (pts) => {
    let d = 'M '+pts[0].x+' '+pts[0].y;
    for(let i=1;i<pts.length;i++){
      const a=pts[i-1],b=pts[i];
      d+=' C '+(a.x+(b.x-a.x)*0.35)+' '+(a.y+(b.y-a.y)*0.35)+
         ', '+(b.x-(b.x-a.x)*0.35)+' '+(b.y-(b.y-a.y)*0.35)+
         ', '+b.x+' '+b.y;
    }
    return d;
  };
  const returnPts = [{x:210,y:210},{x:250,y:250},{x:280,y:305},{x:322,y:365},{x:400,y:640}];
  return (
    <div style={{ background:'#fdf8f3', borderRadius:16, overflow:'hidden', border:'1px solid '+BD }}>
      <svg width="100%" viewBox="0 0 500 700" style={{ display:'block' }}>
        <defs>
          <pattern id="tp" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
            <ellipse cx="35" cy="35" rx="33" ry="24" fill="none" stroke={BD} strokeWidth="0.4" opacity="0.5"/>
            <ellipse cx="35" cy="35" rx="20" ry="14" fill="none" stroke={BD} strokeWidth="0.3" opacity="0.32"/>
          </pattern>
          <linearGradient id="rg" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#15803d"/>
            <stop offset="50%"  stopColor={AC}/>
            <stop offset="100%" stopColor={RO}/>
          </linearGradient>
        </defs>
        <rect width="500" height="700" fill="#fdf8f3"/>
        <rect width="500" height="700" fill="url(#tp)"/>
        <polygon points="200,30 250,100 150,100" fill={W} opacity="0.9"/>
        <polygon points="255,20 305,100 205,100" fill={W} opacity="0.85"/>
        <polygon points="150,42 190,100 112,100" fill={W} opacity="0.7"/>
        <polygon points="200,30 250,100 150,100" fill={AC} opacity="0.1"/>
        <text x="215" y="14" textAnchor="middle" fontSize="10" fill={TX} opacity="0.7" fontStyle="italic">Manaslu Himalaya</text>
        <path d="M 400 640 C 370 600, 340 560, 320 520" fill="none" stroke={BD} strokeWidth="3" strokeDasharray="9 5" opacity="0.65"/>
        <text x="358" y="590" fontSize="8.5" fill={TX} opacity="0.55" transform="rotate(-42,358,590)">Arughat road · ~150km</text>
        <path d={buildPath(returnPts)} fill="none" stroke={AC} strokeWidth="2" strokeDasharray="5 4" opacity="0.3"/>
        <path d={buildPath(waypoints)} fill="none" stroke="url(#rg)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
        {waypoints.map((pt,i) => {
          const r = pt.peak?12:pt.start?10:pt.city?9:6;
          const fill = pt.peak?RO:pt.start?'#15803d':pt.city?AC:TX;
          const side = pt.x<260?'right':'left';
          const lx = side==='right'?pt.x+16:pt.x-16;
          const anch = side==='right'?'start':'end';
          return (
            <g key={i} style={{cursor:'pointer'}} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              {(pt.peak||pt.start||pt.city)&&<circle cx={pt.x} cy={pt.y} r={r+9} fill={fill} opacity="0.12"/>}
              <circle cx={pt.x} cy={pt.y} r={hov===i?r+3:r} fill={fill} stroke={W} strokeWidth="2.5" style={{transition:'r 0.15s'}}/>
              {pt.peak&&<text x={pt.x} y={pt.y+1} textAnchor="middle" dominantBaseline="central" fontSize="9" fill={W} fontWeight="700">▲</text>}
              {pt.start&&<text x={pt.x} y={pt.y+1} textAnchor="middle" dominantBaseline="central" fontSize="9" fill={W} fontWeight="700">✈</text>}
              <text x={lx} y={pt.y} textAnchor={anch} dominantBaseline="central" fontSize={pt.peak||pt.start?11:pt.city?10.5:9} fontWeight={pt.peak||pt.start||pt.city?700:500} fill={pt.peak?RO:pt.start?'#15803d':pt.city?AC:H}>
                {pt.label}
              </text>
              {hov===i&&<text x={lx} y={pt.y+14} textAnchor={anch} fontSize="9" fill={TX}>Day {pt.day}</text>}
            </g>
          );
        })}
        <rect x="12" y="12" width="158" height="102" rx="9" fill={W} opacity="0.94"/>
        <text x="24" y="30" fontSize="10" fontWeight="700" fill={H}>MAP LEGEND</text>
        <line x1="24" y1="43" x2="56" y2="43" stroke={AC} strokeWidth="4.5" strokeLinecap="round"/>
        <text x="62" y="46" fontSize="9" fill={TX}>Trek route (outbound)</text>
        <line x1="24" y1="57" x2="56" y2="57" stroke={AC} strokeWidth="2" strokeDasharray="5 4"/>
        <text x="62" y="60" fontSize="9" fill={TX}>Descent to Bimtang</text>
        <line x1="24" y1="71" x2="56" y2="71" stroke={BD} strokeWidth="3" strokeDasharray="8 4"/>
        <text x="62" y="74" fontSize="9" fill={TX}>Road</text>
        <circle cx="30" cy="87" r="6" fill={RO} stroke={W} strokeWidth="2"/>
        <text x="42" y="87" dominantBaseline="central" fontSize="9" fill={TX}>Larkya La Pass</text>
        <circle cx="30" cy="102" r="6" fill="#15803d" stroke={W} strokeWidth="2"/>
        <text x="42" y="102" dominantBaseline="central" fontSize="9" fill={TX}>Kathmandu (start/end)</text>
        <g transform="translate(468,42)">
          <circle r="22" fill={W} opacity="0.94"/>
          <text textAnchor="middle" y="-7" fontSize="10" fontWeight="700" fill={AC}>N</text>
          <line x1="0" y1="-17" x2="0" y2="17" stroke={BD} strokeWidth="1.2"/>
          <line x1="-17" y1="0" x2="17" y2="0" stroke={BD} strokeWidth="1.2"/>
          <polygon points="0,-17 -5,-6 0,0" fill={AC}/>
          <polygon points="0,-17 5,-6 0,0" fill={BD}/>
        </g>
      </svg>
    </div>
  );
};

/* ── ELEVATION PROFILE ──────────────────────────────── */
const ElevationProfile = () => {
  const alts=[1400,869,1340,1860,2630,3180,3530,3530,3860,4460,3720,2515,1960,1400,1400];
  const MIN=500,MAX=5200,VW=580,VH=140,pL=44,pR=12,pT=12,pB=32;
  const iW=VW-pL-pR,iH=VH-pT-pB,xS=iW/(alts.length-1);
  const yF=a=>pT+iH-((a-MIN)/(MAX-MIN))*iH;
  let d='M '+pL+' '+yF(alts[0]);
  for(let i=1;i<alts.length;i++){
    const x0=pL+(i-1)*xS,x1=pL+i*xS,y0=yF(alts[i-1]),y1=yF(alts[i]);
    d+=' C '+(x0+xS*0.5)+' '+y0+', '+(x1-xS*0.5)+' '+y1+', '+x1+' '+y1;
  }
  const fd=d+' L '+(pL+(alts.length-1)*xS)+' '+(VH-pB)+' L '+pL+' '+(VH-pB)+' Z';
  return (
    <div style={{ background:W, borderRadius:12, padding:'18px 14px 14px', border:'1px solid '+BD }}>
      <p style={{ fontSize:13, color:AC, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', margin:'0 0 10px '+pL+'px' }}>Elevation Profile — Days 1–15</p>
      <svg width="100%" viewBox={'0 0 '+VW+' '+VH}>
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={AC} stopOpacity="0.28"/>
            <stop offset="100%" stopColor={AC} stopOpacity="0.04"/>
          </linearGradient>
        </defs>
        {[1000,2000,3000,4000,5000].map(a=>(
          <g key={a}>
            <line x1={pL} y1={yF(a)} x2={VW-pR} y2={yF(a)} stroke={BD} strokeWidth="0.6" strokeDasharray="3 3"/>
            <text x={pL-5} y={yF(a)} textAnchor="end" dominantBaseline="central" fontSize="8" fill={MUT}>{a/1000}k</text>
          </g>
        ))}
        <path d={fd} fill="url(#eg)"/>
        <path d={d} fill="none" stroke={AC} strokeWidth="2.8" strokeLinecap="round"/>
        <circle cx={pL+10*xS} cy={yF(5106)} r="6" fill={RO} stroke={W} strokeWidth="2"/>
        <text x={pL+10*xS} y={yF(5106)-12} textAnchor="middle" fontSize="9" fill={RO} fontWeight="700">Larkya La 5,106m</text>
        {alts.map((_,i)=><text key={i} x={pL+i*xS} y={VH-5} textAnchor="middle" fontSize="7.5" fill={MUT}>{i+1}</text>)}
      </svg>
    </div>
  );
};

/* ── FAQ ACCORDION ──────────────────────────────────── */
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:'1px solid '+BD, marginBottom:0 }}>
      <button onClick={() => setOpen(!open)}
        style={{ width:'100%', background:'none', border:'none', cursor:'pointer', padding:'18px 0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, textAlign:'left' }}>
        <span style={{ fontSize:16, fontWeight:600, color: open ? AC : H, fontFamily: HEADING_FONT, lineHeight:1.35, transition:'color 0.2s' }}>{q}</span>
        <ChevronDown size={18} color={open ? AC : MUT} style={{ flexShrink:0, transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.3s' }}/>
      </button>
      <div style={{ maxHeight: open ? 320 : 0, overflow:'hidden', transition:'max-height 0.4s ease' }}>
        <p style={{ fontSize:15, color:TX, lineHeight:1.82, paddingBottom:20, margin:0 }}>{a}</p>
      </div>
    </div>
  );
};

/* ── MAIN PAGE ──────────────────────────────────────── */
const ManasluCircuitTrek = () => {
  const isMobile = useIsMobile();
  const [tab,         setTab]         = useState<string>('itinerary');
  const [showBooking, setShowBooking] = useState<boolean>(false);
  const overviewRef  = useRef<HTMLDivElement | null>(null);
  useEffect(() => { window.scrollTo(0,0); }, []);

  return (
    <Layout>
      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)}/>
      <div style={{ fontFamily:'Georgia,"Times New Roman",serif', background:BG, color:H, minHeight:'100vh' }}>

        {/* ── HERO ──────────────────────────────────── */}
        <div style={{ position:'relative', minHeight: isMobile ? '80vh' : '92vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'url(/images/trekking/manaslu/manaslu-1.jpg)', backgroundSize:'cover', backgroundPosition:'center' }}/>
          <div style={{ position:'absolute', inset:0, background:'rgba(12,6,2,0.62)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(12,6,2,0.4) 0%, rgba(12,6,2,0.15) 45%, rgba(12,6,2,0.78) 100%)' }}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:140, background:'linear-gradient(to bottom,transparent,'+BG+')' }}/>

          <div style={{ position:'relative', zIndex:2, textAlign:'center', padding: isMobile ? '100px 20px 70px' : '140px 32px 100px', maxWidth:900 }}>
            <div style={{ display:'inline-block', background:'rgba(107,79,160,0.4)', backdropFilter:'blur(10px)', border:'1px solid rgba(107,79,160,0.55)', color:'rgba(255,255,255,0.95)', padding: isMobile ? '6px 16px' : '7px 22px', borderRadius:40, fontSize: isMobile ? 11 : 13, letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:'sans-serif', marginBottom: isMobile ? 20 : 28, fontWeight:500 }}>
              Heritage Journey Nepal · Trekking
            </div>
            <h1 style={{ fontSize:'clamp(2.6rem,10vw,6rem)', fontWeight:700, lineHeight:1.1, color:W, marginBottom:20, textShadow:'0 2px 10px rgba(0,0,0,0.9), 0 6px 40px rgba(0,0,0,0.6)', letterSpacing:'-0.01em', fontFamily: HEADING_FONT }}>
              Manaslu<br/>
              <span
                style={{
                  fontFamily: ACCENT_FONT,
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#facbac',
                  fontSize: '0.82em',
                  position: 'relative',
                  display: 'inline-block',
                  marginTop: 6,
                }}
              >
                Circuit Trek
                <svg
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -10,
                    width: '100%',
                    height: 12,
                  }}
                >
                   <path d="M2,8 Q75,2 150,8 T298,8" fill="none" stroke="#E8C77A" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p style={{ fontSize:'clamp(1rem,2.4vw,1.3rem)', color:'rgba(255,255,255,0.92)', marginBottom: isMobile ? 28 : 40, lineHeight:1.8, fontStyle:'italic', textShadow:'0 1px 8px rgba(0,0,0,0.8)', maxWidth:600, margin: isMobile ? '0 auto 28px' : '0 auto 40px' }}>
              "In the Shadow of the Spirit Mountain"<br/>
              <span style={{ fontStyle:'normal', fontSize:'0.84em', color:'rgba(255,255,255,0.75)' }}>
                15 days · Kathmandu around the eighth-highest mountain on Earth
              </span>
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap: isMobile ? 8 : 12, justifyContent:'center', marginBottom: isMobile ? 32 : 44 }}>
              {[{icon:<Clock size={16}/>,label:'15 Days'},{icon:<Mountain size={16}/>,label:'5,106m Max'},{icon:<Compass size={16}/>,label:'Challenging'},{icon:<Calendar size={16}/>,label:'Mar–May · Sep–Nov'}].map((s,i)=>(
                <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.14)', backdropFilter:'blur(12px)', border:'1.5px solid rgba(255,255,255,0.35)', color:W, padding: isMobile ? '8px 16px' : '10px 22px', borderRadius:40, fontSize: isMobile ? 13 : 15, fontFamily:'sans-serif', textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>
                  {s.icon} {s.label}
                </span>
              ))}
            </div>
            <button onClick={() => overviewRef.current?.scrollIntoView({ behavior:'smooth' })}
              style={{ background:RO, color:W, border:'none', padding: isMobile ? '14px 32px' : '16px 44px', borderRadius:40, cursor:'pointer', fontSize: isMobile ? 15 : 17, fontFamily:'sans-serif', fontWeight:700, display:'inline-flex', alignItems:'center', gap:10, boxShadow:'0 4px 28px rgba(190,24,93,0.55)' }}>
              Start Your Journey <ArrowUpRight size={20}/>
            </button>
          </div>
          <div style={{ position:'absolute', bottom: isMobile ? 24 : 44, left:'50%', transform:'translateX(-50%)', color:'rgba(255,255,255,0.5)', animation:'bounce 2s infinite', zIndex:2 }}>
            <ChevronDown size={28}/>
          </div>
        </div>

        {/* ── FACTS BAND ────────────────────────────── */}
        <div style={{ background:AC, color:W, padding: isMobile ? '18px 0' : '22px 0' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding: isMobile ? '0 12px' : '0 32px', display:'flex', flexWrap:'wrap', justifyContent:'center', gap: isMobile ? 4 : 10 }}>
            {[{label:'Duration',val:'15 Days'},{label:'Max Altitude',val:'5,106m'},{label:'Daily Walking',val:'4–9 hrs'},{label:'Trek Distance',val:'~177 km'},{label:'Group Size',val:'2–12'},{label:'Start / End',val:'Kathmandu'}].map((f,i,arr)=>(
              <div key={i} style={{ textAlign:'center', padding: isMobile ? '8px 12px' : '8px 22px', minWidth: isMobile ? '30%' : 'auto', borderRight: (!isMobile && i<arr.length-1) ? '1px solid rgba(255,255,255,0.22)':'none' }}>
                <div style={{ fontSize: isMobile ? 10 : 12, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.65)', fontFamily:'sans-serif', marginBottom:5 }}>{f.label}</div>
                <div style={{ fontSize: isMobile ? 17 : 22, fontWeight:700 }}>{f.val}</div>
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
                <p style={{ fontSize:12, letterSpacing:'0.22em', color:AC, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:12 }}>Trek Overview</p>
                <h2 style={{ fontSize:'clamp(1.7rem,5vw,2.7rem)', fontWeight:400, color:H, lineHeight:1.18, marginBottom:22, fontFamily: HEADING_FONT }}>
                  A Circuit Around the<br/><em style={{ color:AC }}>Eighth-Highest Mountain</em>
                </h2>

                {/* Tourist-friendly explainer boxes */}
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:14, marginBottom:24 }}>
                  {[
                    { icon:'▲', title:'What is this trek?', text:'A 15-day guided walking holiday circling Mt. Manaslu (8,163m) through a restricted border region of Nepal. No climbing equipment needed — just boots, fitness, and a mandatory licensed guide.' },
                    { icon:'→', title:'How fit do I need to be?', text:'You should be able to walk 5–9 hours a day on uneven terrain, including one very long day crossing a 5,106m pass. Prior high-altitude trekking experience is a real advantage here.' },
                    { icon:'◆', title:'Where do you sleep?', text:'In simple teahouses lower down, becoming increasingly basic above Samagaon. Dharamsala, the night before the pass, is dormitory-style — the most remote night of the trek.' },
                    { icon:'●', title:'Where does it go?', text:'From Kathmandu you drive to Machha Khola, then trek up the Budhi Gandaki gorge through Tibetan-influenced villages, cross the Larkya La Pass at 5,106m, and descend to rejoin the Annapurna Circuit at Dharapani.' },
                  ].map((box,i) => (
                    <div key={i} style={{ background:W, border:'1px solid '+BD, borderRadius:12, padding:'18px', display:'flex', gap:12 }}>
                      <span style={{ fontSize:24, flexShrink:0 }}>{box.icon}</span>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:H, fontFamily:'sans-serif', marginBottom:6 }}>{box.title}</div>
                        <div style={{ fontSize:14, color:TX, lineHeight:1.65 }}>{box.text}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: isMobile ? 15.5 : 17, lineHeight:1.9, color:TX, marginBottom:16 }}>
                  The Manaslu Circuit Trek circles the world's eighth-highest mountain through one of Nepal's most remote and pristine restricted regions. Following the Budhi Gandaki river gorge before climbing into high alpine terrain, the trail crosses the dramatic Larkya La Pass at 5,106m. Along the way, you'll pass through Tibetan Buddhist villages like Samagaon and Samdo, far removed from the crowds of Everest or Annapurna.
                </p>
                <p style={{ fontSize: isMobile ? 15.5 : 17, lineHeight:1.9, color:TX }}>
                  Because Manaslu sits on a restricted border region, trekkers here need a licensed guide and a minimum group of two at all times — which means far fewer people on the trail than almost anywhere else in the Himalaya. For travellers seeking authenticity, solitude, and genuinely wild mountain scenery, this is one of Nepal's very best treks.
                </p>
              </section>

              {/* Gallery */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <p style={{ fontSize:12, letterSpacing:'0.22em', color:AC, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:18 }}>Photo Gallery</p>
                <Gallery />
                <p style={{ fontSize:13, color:MUT, fontFamily:'sans-serif', marginTop:10 }}>Click any photo to enlarge · use ‹ › to browse all images</p>
              </section>

              {/* Highlights */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <p style={{ fontSize:12, letterSpacing:'0.22em', color:AC, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:18 }}>Trek Highlights</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
                  {[
                    'Crossing the dramatic Larkya La Pass at 5,106m',
                    'Close-up views of Mt. Manaslu, the world\'s 8th highest peak',
                    'A remote, less-crowded alternative to the Annapurna and Everest trails',
                    'Rich Tibetan Buddhist culture in Samagaon and Samdo',
                    'Trekking through the pristine Manaslu Conservation Area',
                    'Diverse landscapes from subtropical forests to high alpine terrain',
                    'Ancient monasteries including Ribung Gompa and Pungyen Gompa',
                    'Optional side trip to Manaslu Base Camp',
                  ].map((h,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, background:W, borderRadius:10, padding:'14px 16px', border:'1px solid '+BD, fontSize:15, color:TX, lineHeight:1.5 }}>
                      {h}
                    </div>
                  ))}
                </div>
              </section>

              {/* Permits & Costs */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <p style={{ fontSize:12, letterSpacing:'0.22em', color:AC, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:12 }}>Permits Required</p>
                <h2 style={{ fontSize:'clamp(1.4rem,3.5vw,2rem)', fontWeight:400, color:H, lineHeight:1.2, marginBottom:18, fontFamily: HEADING_FONT }}>
                  What paperwork do you need?
                </h2>
                <p style={{ fontSize: isMobile ? 15 : 16, lineHeight:1.85, color:TX, marginBottom:18 }}>
                  Manaslu is a restricted region, so three permits are required — more than most other Nepal treks. Heritage Journey Nepal arranges all of them on your behalf and includes them in the trip price. A licensed guide and a minimum group of two trekkers are mandatory for the entire route; solo trekking here is not permitted.
                </p>
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:14 }}>
                  {[
                    { title:'Manaslu Restricted Area Permit (RAP)', cost:'USD 70–100 (season-dependent)', detail:'Required for the section between Jagat and Sama Gaon. Cost varies by season and is higher during peak months (Sep–Nov). Only issued through a registered trekking agency with a licensed guide — independent trekking is not allowed on this section.' },
                    { title:'Manaslu Conservation Area Permit (MCAP)', cost:'NPR 3,000 (~USD 22)', detail:'Covers the Manaslu Conservation Area, funding wildlife protection, trail maintenance, and community projects in the Nubri and Tsum valleys. Checked at the Philim checkpoint on Day 4.' },
                    { title:'Annapurna Conservation Area Permit (ACAP)', cost:'NPR 3,000 (~USD 22)', detail:'Required for the final stretch of the trek once you descend past Larkya La into Bimtang and Dharapani, which lies within the Annapurna Conservation Area. Checked near Dharapani on Day 13.' },
                  ].map((p,i) => (
                    <div key={i} style={{ background:W, borderRadius:12, padding:'20px', border:'1px solid '+BD }}>
                      <div style={{ fontSize:11, color:AC, fontFamily:'sans-serif', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Included in price</div>
                      <h4 style={{ fontSize:15, fontWeight:700, color:H, fontFamily: HEADING_FONT, marginBottom:6 }}>{p.title}</h4>
                      <div style={{ fontSize:13, color:AC, fontFamily:'sans-serif', fontWeight:600, marginBottom:10 }}>{p.cost}</div>
                      <p style={{ fontSize:14, color:TX, lineHeight:1.72, margin:0 }}>{p.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Altitude & Health */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <p style={{ fontSize:12, letterSpacing:'0.22em', color:AC, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:12 }}>Altitude & Health</p>
                <h2 style={{ fontSize:'clamp(1.4rem,3.5vw,2rem)', fontWeight:400, color:H, lineHeight:1.2, marginBottom:18, fontFamily: HEADING_FONT }}>
                  Understanding altitude sickness
                </h2>
                <p style={{ fontSize: isMobile ? 15 : 16, lineHeight:1.85, color:TX, marginBottom:18 }}>
                  Larkya La Pass sits at 5,106m — significantly higher than most trekking passes in Nepal — making altitude sickness (Acute Mountain Sickness, or AMS) a genuine concern. The route's remoteness also means help is further away than on more popular trails, so prevention and awareness matter even more here.
                </p>
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:12, marginBottom:20 }}>
                  {[
                    { heading:'Mild Symptoms', color:'#92400e', bg:'#fef3c7', items:['Headache (especially after arrival at altitude)','Fatigue beyond normal trekking tiredness','Loss of appetite or nausea','Dizziness when standing quickly','Difficulty sleeping at altitude'] },
                    { heading:'Serious Symptoms — descend immediately', color:'#991b1b', bg:'#fee2e2', items:['Severe headache unrelieved by paracetamol','Vomiting, inability to keep fluids down','Loss of coordination or stumbling','Confusion or unusual drowsiness','Persistent dry cough or breathlessness at rest'] },
                    { heading:'Prevention', color:'#166534', bg:'#dcfce7', items:['Walk slowly — the Nepali rule is "bistari bistari" (slowly slowly)','Drink 3–4 litres of water per day minimum','Avoid alcohol on the trail, especially above 3,000m','Eat carbohydrate-rich meals (dal bhat) for sustained energy','Use the two nights in Samagaon and Samdo fully for acclimatization'] },
                  ].map((col,i) => (
                    <div key={i} style={{ background:col.bg, borderRadius:12, padding:'18px' }}>
                      <h4 style={{ fontSize:13, fontWeight:700, color:col.color, fontFamily:'sans-serif', marginBottom:12, lineHeight:1.3 }}>{col.heading}</h4>
                      {col.items.map((item,j) => (
                        <div key={j} style={{ display:'flex', gap:8, marginBottom:8, fontSize:13.5, color:TX, lineHeight:1.5 }}>
                          <span style={{ color:col.color, flexShrink:0, marginTop:2, fontWeight:700 }}>·</span> {item}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div style={{ background:AC+'10', border:'1px solid '+AC+'40', borderRadius:12, padding: isMobile ? '14px 16px' : '16px 20px', display:'flex', gap:14 }}>
                  <Info size={22} color={AC} style={{ flexShrink:0, marginTop:2 }}/>
                  <p style={{ fontSize: isMobile ? 14 : 15, color:H, margin:0, lineHeight:1.7 }}>
                    <strong>Our guides are trained in wilderness first aid and altitude medicine.</strong> If you show serious AMS symptoms, your guide will make the call to descend immediately — this is non-negotiable and always the right decision. We carry basic medication including Diamox and supplemental oxygen on all treks above 3,500m, and travel insurance covering helicopter evacuation to 5,200m is mandatory.
                  </p>
                </div>
              </section>

              {/* Fitness Guide */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <p style={{ fontSize:12, letterSpacing:'0.22em', color:AC, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:12 }}>Fitness & Preparation</p>
                <h2 style={{ fontSize:'clamp(1.4rem,3.5vw,2rem)', fontWeight:400, color:H, lineHeight:1.2, marginBottom:18, fontFamily: HEADING_FONT }}>
                  How to prepare your body for the trek
                </h2>
                <p style={{ fontSize: isMobile ? 15 : 16, lineHeight:1.85, color:TX, marginBottom:20 }}>
                  This is a genuinely challenging trek — 15 days including one 8–9 hour day crossing a 5,106m pass. You do not need to be an elite athlete, but serious preparation is essential, and previous multi-day trekking experience is a real advantage. Starting a structured programme at least 10 weeks before departure is strongly recommended.
                </p>
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:14 }}>
                  {[
                    { title:'10 Weeks Before', items:['Start walking 3–4 times per week, 60–90 minutes per session','Include hills and uneven terrain wherever possible','Begin stair climbing (shopping centres, office buildings, hill walks)','Build up to 4-hour continuous hikes by week 5','Wear your trekking boots on every training walk to break them in'] },
                    { title:'4 Weeks Before', items:['Complete at least two 6–8 hour day hikes with a loaded pack','Practice carrying 8–10kg (your daypack on trek will weigh 6–8kg)','Focus on descents — your knees take the most stress on the Larkya La descent','Hydration training — practise drinking 3+ litres per day of water','Consult your doctor about Diamox (altitude medication) if concerned'] },
                    { title:'2 Weeks Before', items:['Reduce intensity but maintain frequency — short 60-min walks','Finalise all gear and do one full kit test walk','Ensure all boots are fully broken in — new boots on Day 1 is painful','Book travel health consultation and confirm vaccinations are current','Confirm travel insurance covers high-altitude trekking and evacuation to 5,200m'] },
                    { title:'On the Trek', items:['Walk at the pace of the slowest person — there is no reward for speed','Take regular short breaks rather than one long stop','Eat even when you have no appetite — altitude suppresses hunger','Rest fully on acclimatization days and do not push through fatigue','Communicate openly with your guide about how you feel every morning'] },
                  ].map((block,i) => (
                    <div key={i} style={{ background:W, borderRadius:12, padding:'20px', border:'1px solid '+BD }}>
                      <h4 style={{ fontSize:15, fontWeight:700, color:AC, fontFamily:'sans-serif', marginBottom:12 }}>{block.title}</h4>
                      {block.items.map((item,j) => (
                        <div key={j} style={{ display:'flex', gap:10, marginBottom:9, fontSize:14.5, color:TX, lineHeight:1.55 }}>
                          <CheckCircle size={15} color={AC} style={{ flexShrink:0, marginTop:3 }}/> {item}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>

              {/* Map */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <p style={{ fontSize:12, letterSpacing:'0.22em', color:AC, textTransform:'uppercase', fontFamily:'sans-serif', marginBottom:10 }}>Route Map</p>
                <p style={{ fontSize: isMobile ? 14 : 15, color:TX, marginBottom:16, lineHeight:1.7 }}>
                  Full route: <strong>Kathmandu → Machha Khola → Samagaon → Larkya La Pass → Dharapani → Kathmandu</strong>. {!isMobile && 'Hover any point to see which day you pass through.'}
                </p>
                <TrekMap />
                <div style={{ marginTop:16 }}><ElevationProfile /></div>
              </section>

              {/* Tabs */}
              <section>
                <div style={{ display:'flex', borderBottom:'2px solid '+BD, marginBottom:32, overflowX: isMobile ? 'auto' : 'visible' }}>
                  {['itinerary','includes','weather'].map(t=>(
                    <button key={t} onClick={()=>setTab(t)}
                      style={{ background:'none', border:'none', cursor:'pointer', padding: isMobile ? '12px 18px' : '13px 26px', fontFamily:'sans-serif', fontSize:14, letterSpacing:'0.08em', textTransform:'uppercase', color:tab===t?AC:MUT, borderBottom:tab===t?'2px solid '+AC:'2px solid transparent', marginBottom:-2, fontWeight:tab===t?700:400, transition:'color 0.2s', whiteSpace:'nowrap' }}>
                      {t}
                    </button>
                  ))}
                </div>

                {tab==='itinerary' && (
                  <div>
                    <div style={{ background:AC+'0e', border:'1px solid '+AC+'30', borderRadius:12, padding: isMobile ? '14px 16px' : '16px 20px', marginBottom:28, display:'flex', gap:14, alignItems:'flex-start' }}>
                      <Info size={20} color={AC} style={{ flexShrink:0, marginTop:2 }}/>
                      <div>
                        <p style={{ fontSize:15, color:H, fontFamily:'sans-serif', fontWeight:700, margin:'0 0 4px' }}>How to read the itinerary</p>
                        <p style={{ fontSize:14, color:TX, margin:0, lineHeight:1.65 }}>
                          Each card shows a plain-English summary of the day. <strong>Click any card</strong> to expand the full description including practical tips. Look for the coloured type tags: <span style={{ background:'#dcfce7', color:'#166534', padding:'1px 7px', borderRadius:10, fontSize:12, fontWeight:600 }}>Easy</span> <span style={{ background:'#fef3c7', color:'#92400e', padding:'1px 7px', borderRadius:10, fontSize:12, fontWeight:600 }}>Moderate</span> <span style={{ background:'#fee2e2', color:'#991b1b', padding:'1px 7px', borderRadius:10, fontSize:12, fontWeight:600 }}>Challenging</span>
                        </p>
                      </div>
                    </div>
                    <ItineraryTimeline />
                  </div>
                )}

                {tab==='includes' && (
                  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:28 }}>
                    <div>
                      <h4 style={{ fontSize:15, fontFamily:'sans-serif', fontWeight:700, color:'#15803d', marginBottom:18, textTransform:'uppercase', letterSpacing:'0.06em' }}>✓ What is Included</h4>
                      {includes.map((item,i)=>(
                        <div key={i} style={{ display:'flex', gap:12, marginBottom:14, fontSize:15, color:TX, lineHeight:1.6 }}>
                          <CheckCircle size={17} color='#15803d' style={{ flexShrink:0, marginTop:3 }}/> {item}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 style={{ fontSize:15, fontFamily:'sans-serif', fontWeight:700, color:'#b91c1c', marginBottom:18, textTransform:'uppercase', letterSpacing:'0.06em' }}>✗ Not Included</h4>
                      {excludes.map((item,i)=>(
                        <div key={i} style={{ display:'flex', gap:12, marginBottom:14, fontSize:15, color:TX, lineHeight:1.6 }}>
                          <span style={{ color:'#b91c1c', flexShrink:0, marginTop:2, fontWeight:700, fontSize:16 }}>✗</span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab==='weather' && (
                  <div>
                    <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:16, marginBottom:28 }}>
                      {[
                        { season:'Spring (Mar–May)', color:'#15803d', text:'The most popular season. Rhododendrons in bloom lower down, warm days, cool nights. Some cloud build-up in May but generally clear. Good for photography and wildflowers.' },
                        { season:'Autumn (Sep–Nov)', color:AC, text:'Crystal-clear skies and the sharpest mountain views. Post-monsoon freshness. The busiest permit season for Manaslu — book well ahead. October is peak perfection.' },
                        { season:'Winter (Dec–Feb)', color:'#0284c7', text:'Larkya La is frequently snowbound and can become impassable. Very few trekkers attempt this route in winter. Not recommended without significant high-altitude experience.' },
                        { season:'Monsoon (Jun–Aug)', color:'#6B7280', text:'Heavy rain, leeches, landslides, and poor visibility on the lower gorge sections. Not recommended for this trek. Trails can be dangerous.' },
                      ].map((s,i)=>(
                        <div key={i} style={{ background:W, border:'1px solid '+BD, borderRadius:12, padding:'16px 18px' }}>
                          <div style={{ fontSize:15, fontWeight:700, color:s.color, fontFamily:'sans-serif', marginBottom:8 }}>{s.season}</div>
                          <p style={{ fontSize:14, color:TX, margin:0, lineHeight:1.7 }}>{s.text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(6,1fr)', gap:10 }}>
                      {weatherData.map((m,i)=>(
                        <div key={i} style={{ background:m.ok?AC+'15':W, border:'1px solid '+(m.ok?AC+'55':BD), borderRadius:12, padding: isMobile ? '10px 6px' : '14px 8px', textAlign:'center', opacity:m.ok?1:0.52 }}>
                          <div style={{ fontSize:13, fontFamily:'sans-serif', fontWeight:700, color:m.ok?AC:MUT, marginBottom:7 }}>{m.m}</div>
                          <div style={{ marginBottom:7, display:'flex', justifyContent:'center' }}><WeatherIcon cond={m.cond}/></div>
                          <div style={{ fontSize:12, color:RO, fontFamily:'sans-serif', fontWeight:700 }}>{m.hi}°</div>
                          <div style={{ fontSize:12, color:MUT, fontFamily:'sans-serif' }}>{m.lo}°</div>
                          {m.ok&&<div style={{ fontSize:9, color:AC, fontWeight:700, marginTop:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Best</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* SIDEBAR */}
            <div style={{ position: isMobile ? 'static' : 'sticky', top: isMobile ? 'auto' : 24 }}>
              <div style={{ background:AC, color:W, borderRadius:18, padding: isMobile ? '24px 22px' : '30px 26px', marginBottom:18, boxShadow:'0 10px 48px rgba(107,79,160,0.3)' }}>
                <div style={{ fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', fontFamily:'sans-serif', marginBottom:8 }}>Starting from</div>
                <div style={{ fontSize: isMobile ? 32 : 38, fontWeight:700, marginBottom:5 }}>
                  USD 1,650
                  <span style={{ fontSize:15, fontWeight:400, color:'rgba(255,255,255,0.5)', marginLeft:8 }}>/ person</span>
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.38)', fontFamily:'sans-serif', marginBottom:24 }}>Based on 2+ trekkers · All inclusive*</div>
                {[
                  {icon:<Clock size={15}/>,    label:'Duration',     val:'15 Days'    },
                  {icon:<Mountain size={15}/>, label:'Max Altitude', val:'5,106m'     },
                  {icon:<Compass size={15}/>,  label:'Difficulty',   val:'Challenging'},
                  {icon:<Users size={15}/>,    label:'Group Size',   val:'2–12 people'},
                  {icon:<MapPin size={15}/>,   label:'Start / End',  val:'Kathmandu'  },
                ].map((s,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.1)', fontSize:15, fontFamily:'sans-serif' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.55)' }}>{s.icon} {s.label}</span>
                    <span style={{ color:W, fontWeight:700 }}>{s.val}</span>
                  </div>
                ))}
                <button onClick={()=>setShowBooking(true)}
                  style={{ width:'100%', background:RO, color:W, border:'none', borderRadius:40, padding:'15px', marginTop:22, fontSize:16, fontFamily:'sans-serif', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 18px rgba(190,24,93,0.45)' }}>
                  Book This Trek →
                </button>
                <button onClick={()=>setShowBooking(true)}
                  style={{ width:'100%', background:'transparent', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:40, padding:'13px', marginTop:12, fontSize:14, fontFamily:'sans-serif', cursor:'pointer' }}>
                  Enquire / Ask a Question
                </button>
              </div>

              <div style={{ background:W, borderRadius:16, padding: isMobile ? '18px' : '22px', border:'1px solid '+BD }}>
                <h4 style={{ fontSize:14, fontFamily:'sans-serif', fontWeight:700, color:H, marginBottom:16, letterSpacing:'0.07em', textTransform:'uppercase' }}>What to Pack</h4>
                {['Layered clothing (base, mid, waterproof outer)','Waterproof jacket and pants','Sturdy hiking boots — well broken in before the trip','Sleeping bag rated for −15°C','Trekking poles — essential for the Larkya La descent','Headlamp and spare batteries','Sunscreen SPF 50+ and good sunglasses','Water purification tablets or filter bottle'].map((item,i)=>(
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:10, fontSize:15, color:TX, lineHeight:1.5 }}>
                    <span style={{ width:20, height:20, background:AC+'18', color:AC, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, flexShrink:0, marginTop:2, fontWeight:700 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CULTURAL ──────────────────────────────── */}
        <div style={{ background:'#f3eeff', padding: isMobile ? '48px 18px' : '72px 32px', borderTop:'1px solid '+BD }}>
          <div style={{ maxWidth:1160, margin:'0 auto' }}>
            <p style={{ fontSize:12, letterSpacing:'0.22em', color:AC, textTransform:'uppercase', fontFamily:'sans-serif', textAlign:'center', marginBottom:14 }}>Cultural Immersion</p>
            <h2 style={{ fontSize:'clamp(1.6rem,5vw,2.5rem)', fontWeight:400, color:H, textAlign:'center', marginBottom: isMobile ? 36 : 52, fontFamily: HEADING_FONT }}>
              People, Places &amp; <em style={{ color:AC }}>Traditions</em>
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:22 }}>
              {[
                { icon:<Users size={30}/>, title:'Samagaon & Samdo', desc:'The upper Nubri valley is home to ethnically Tibetan communities whose way of life has changed little for generations. Samagaon and Samdo — the largest villages above Namrung — are built of stone, surrounded by yak pastures, and governed by the rhythms of high-altitude farming and herding. Staying in family-run teahouses here is one of the defining experiences of the Manaslu Circuit.' },
                { icon:<Heart size={30}/>, title:'Ancient Monasteries', desc:'Ribung Gompa, perched above Lho, and Pungyen Gompa, a remote hermitage above Samagaon, are spiritual centres of the Nubri valley\'s Buddhist community. Prayer flags string the ridgelines, mani walls of carved stone line the trails, and locals spin prayer wheels each morning. Manaslu itself is regarded as a sacred mountain by local communities.' },
                { icon:<Utensils size={30}/>, title:'Local Food', desc:'Dal bhat (lentil soup with rice and vegetables) is the backbone of the trek, alongside Tibetan bread, thukpa noodle soup, and yak cheese in the higher villages. Meals are cooked fresh by teahouse families each night, and the simple, hearty mountain fare is part of what makes the region feel so distinct from Nepal\'s more touristed trails.' },
                { icon:<MapPin size={30}/>, title:'A Restricted, Quieter Trail', desc:'Because Manaslu requires a Restricted Area Permit and a licensed guide, it sees a fraction of the traffic of the Everest or Annapurna routes. The result is a trek that still feels genuinely remote — teahouses where you\'ll recognise every other guest, villages untouched by mass tourism, and long stretches of trail with nothing but mountains, prayer flags, and the sound of the river.' },
              ].map((c,i)=>(
                <div key={i} style={{ background:W, borderRadius:16, padding:'26px', border:'1px solid '+BD }}>
                  <div style={{ color:AC, marginBottom:16 }}>{c.icon}</div>
                  <h3 style={{ fontSize:18, color:H, marginBottom:12, fontWeight:600, fontFamily: HEADING_FONT }}>{c.title}</h3>
                  <p style={{ fontSize:15, color:TX, lineHeight:1.82, margin:0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────── */}
        <div style={{ background:BG, padding: isMobile ? '48px 18px' : '72px 32px', borderTop:'1px solid '+BD }}>
          <div style={{ maxWidth:860, margin:'0 auto' }}>
            <p style={{ fontSize:12, letterSpacing:'0.22em', color:AC, textTransform:'uppercase', fontFamily:'sans-serif', textAlign:'center', marginBottom:14 }}>Frequently Asked Questions</p>
            <h2 style={{ fontSize:'clamp(1.5rem,5vw,2.3rem)', fontWeight:400, color:H, textAlign:'center', marginBottom: isMobile ? 32 : 48, fontFamily: HEADING_FONT }}>
              Everything you need to know before booking
            </h2>
            {[
              { q:'Can I trek Manaslu solo, without a group?', a:'No. Manaslu is a restricted region — Nepali regulations require every trekker to travel with a licensed guide, in a group of at least two people, for the permit-controlled section between Jagat and Dharapani. We can arrange a partner for solo travellers wanting to join an existing small group.' },
              { q:'Do I need previous trekking experience?', a:'Previous multi-day trekking experience is a real advantage on this route — it is significantly more demanding than Nepal\'s more popular treks, both due to Larkya La\'s altitude and the length of some walking days. If you are new to trekking, we recommend building up with a shorter Himalayan trek first.' },
              { q:'What is the food like on the trail?', a:'Teahouses serve a standard trekking menu: dal bhat (rice, lentil soup, and vegetables), noodle soup, pasta, omelettes, fried rice, momo dumplings, pancakes, and porridge. Options become simpler and pricier the higher and more remote you go, especially above Samagaon. Vegetarian options are always available.' },
              { q:'What kind of accommodation should I expect?', a:'Teahouses are family-run guesthouses with simple twin rooms lower down. Above Samagaon, rooms become more basic, and at Dharamsala (Larke Phedi) — the night before the pass — accommodation is dormitory-style with very limited facilities. Bring your own sleeping bag rated to at least −15°C.' },
              { q:'Is there WiFi and mobile signal on the trail?', a:'Mobile signal exists intermittently up to around Samagaon but becomes unreliable higher up and disappears almost entirely around Larkya La. WiFi is available at some teahouses for a fee but is slow. This trek offers a genuine, extended digital disconnect — plan for it.' },
              { q:'What is the best way to avoid altitude sickness before Larkya La?', a:'Use the acclimatization day in Samagaon fully, walk slowly on the approach to Samdo and Dharamsala, drink 3–4 litres of water daily, avoid alcohol above 3,000m, and tell your guide immediately if you feel unwell. The itinerary is paced deliberately — do not be tempted to skip acclimatization days to save time.' },
              { q:'What travel insurance do I need?', a:'Travel insurance that specifically covers high-altitude trekking to at least 5,200m and includes emergency helicopter evacuation is mandatory for all Heritage Journey Nepal trekkers on Manaslu. This is non-negotiable given the route\'s remoteness. Recommended providers: World Nomads, True Traveller, Battleface.' },
              { q:'How does Manaslu compare to Everest Base Camp or Annapurna?', a:'Manaslu is quieter, wilder, and more logistically demanding — restricted permits, a mandatory guide, and simpler teahouses reflect its lower visitor numbers. It also crosses a higher pass (5,106m vs Annapurna Base Camp\'s 4,130m). For trekkers who have done a more popular route before and want more solitude and a bigger physical challenge, Manaslu is an excellent next step.' },
            ].map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <div style={{ background:'linear-gradient(135deg,'+AC+' 0%,#4c3270 100%)', padding: isMobile ? '52px 20px' : '76px 32px', textAlign:'center', color:W }}>
          <h2 style={{ fontSize:'clamp(1.8rem,6vw,3.2rem)', fontWeight:400, marginBottom:18, fontFamily: HEADING_FONT }}>
           <em style={{ color:'#000000' }}>Ready to Circle<br/></em> <em style={{ color:'#fce7f3' }}>the Spirit Mountain?</em>
          </h2>
          <p style={{ fontSize: isMobile ? 16 : 18, opacity:0.88, maxWidth:520, margin:'0 auto 36px', lineHeight:1.8 }}>
            Our expert guides are ready to customise this trek for your group — private departures available year-round.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={()=>setShowBooking(true)}
              style={{ background:RO, color:W, border:'none', padding: isMobile ? '14px 32px' : '16px 44px', borderRadius:40, fontSize: isMobile ? 15 : 17, fontFamily:'sans-serif', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 20px rgba(190,24,93,0.45)' }}>
              Book Now
            </button>
            <button onClick={()=>setShowBooking(true)}
              style={{ background:'transparent', color:W, border:'2px solid rgba(255,255,255,0.45)', padding: isMobile ? '14px 32px' : '16px 44px', borderRadius:40, fontSize: isMobile ? 15 : 17, fontFamily:'sans-serif', cursor:'pointer' }}>
              Request Custom Quote
            </button>
          </div>
        </div>

        <style>{`
          @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(9px)} }
          @keyframes pulse  { 0%,100%{box-shadow:0 0 0 4px rgba(107,79,160,0.25)} 50%{box-shadow:0 0 0 9px rgba(107,79,160,0.1)} }
        `}</style>
      </div>
    </Layout>
  );
};

export default ManasluCircuitTrek;