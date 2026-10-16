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
const BLUE  = '#2f6f9f';

const W   = '#FFFFFF';
const BG  = SNOW;
const TX  = '#3a4659';
const BD  = '#d5dbe3';
const MUT = '#6b788c';

const HEADING_FONT = "'Outfit', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT    = "'Hind', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* Route colours (map, selector) — the four routes need to be told apart */
const routeColors: Record<string,string> = {
  ghorepani: INK, mardi: RED, dhampus: SAFF, khopra: BLUE,
};

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
   TREK DATA
══════════════════════════════════════════════════════ */
interface ItineraryDay {
  day: number; title: string; time: string; alt: string; diff: string; type: string;
  what: string; brief: string; tip: string; overview: string;
}
interface Trek {
  id: string; name: string; tagline: string; duration: string; maxAltitude: string;
  difficulty: string; bestSeason: string; startEnd: string; groupSize: string;
  summary: string; culturalNote: string; whyGo: string;
  altitudes: number[]; peakIdx: number; peakLabel: string;
  itinerary: ItineraryDay[];
}

const treks: Trek[] = [
  {
    id: 'ghorepani', name: 'Ghorepani Poon Hill Trek', tagline: 'The Sunrise Panorama Trek',
    duration: '4–5 Days', maxAltitude: '3,210m', difficulty: 'Moderate', bestSeason: 'Mar–May, Sep–Nov',
    startEnd: 'Pokhara', groupSize: '2–12',
    summary: 'A classic short circuit through Gurung villages, rhododendron forest, and terraced hillsides, capped by one of the best sunrise viewpoints in Nepal.',
    culturalNote: 'Traditional Gurung villages, warm lodge hospitality, and vibrant rhododendron blooms in spring.',
    whyGo: 'The best short trek for first-timers who want a genuine Himalayan panorama without a long commitment.',
    altitudes: [1070, 1540, 2860, 3210, 1940, 850], peakIdx: 3, peakLabel: 'Poon Hill 3,210m',
    itinerary: [
      { day:1, title:'Drive to Nayapul, trek to Tikhedhunga', time:'3–4 hrs', alt:'1,540m', diff:'Easy', type:'trek',
        what:'A gentle start — a short drive, then your first steps into the hills.',
        brief:'After breakfast in Pokhara, drive about an hour to Nayapul, the trailhead for this route. From here the trail follows the Modi Khola river past terraced rice paddies and small stone villages, including Birethanti, where your permits are checked, before a gradual climb to Tikhedhunga.',
        tip:'Tip: Birethanti has the last reliable shops before the trail climbs — stock up on snacks here.',
        overview:'Tikhedhunga sits at the foot of the famous stone staircase up to Ulleri. Staying here the first night means you tackle that climb fresh the next morning rather than at the end of a long driving day.' },
      { day:2, title:'Trek to Ghorepani', time:'5–6 hrs', alt:'2,860m', diff:'Moderate', type:'trek',
        what:'The big climb — thousands of stone steps into rhododendron forest.',
        brief:'The day opens with a well-known staircase of roughly 3,000 stone steps up to Ulleri, then eases into a long, beautiful climb through rhododendron and oak forest to Ghorepani, a ridge-top village with your first proper mountain views.',
        tip:'Tip: Trekking poles make a noticeable difference on the Ulleri steps — bring them even on this shorter trek.',
        overview:'Ghorepani is a cluster of lodges strung along a forested ridge, popular precisely because of what lies just above it — the Poon Hill viewpoint you\u2019ll climb before dawn tomorrow.' },
      { day:3, title:'Poon Hill sunrise, trek to Tadapani', time:'5–6 hrs', alt:'2,630m', diff:'Moderate', type:'sunrise',
        what:'Sunrise over the Annapurnas, then a forest walk to Tadapani.',
        brief:'A pre-dawn 45-minute climb to Poon Hill (3,210m) rewards you with one of Nepal\u2019s most famous panoramas — Dhaulagiri, Annapurna South, and Machhapuchhre catching the first light. After breakfast back in Ghorepani, trek through dense rhododendron forest to Tadapani.',
        tip:'Tip: Bring a headlamp and a warm layer — Poon Hill is cold and busy well before sunrise.',
        overview:'Poon Hill routinely ranks among the best sunrise viewpoints in the world, and unlike the high passes elsewhere in Nepal, reaching it takes under an hour on a clear, well-graded path.' },
      { day:4, title:'Trek to Ghandruk', time:'3–4 hrs', alt:'1,940m', diff:'Easy', type:'trek',
        what:'Descending into one of Nepal\u2019s largest Gurung villages.',
        brief:'A gentler day, descending through more rhododendron forest into Ghandruk, a large and well-preserved Gurung village with stone-paved lanes, traditional houses, and a small Gurung culture museum.',
        tip:'Tip: The Gurung Museum in Ghandruk is worth an hour — exhibits cover traditional dress and the Gurkha soldiering tradition.',
        overview:'Ghandruk is one of the most accessible windows into Gurung culture in the Annapurna region — still lived-in and working, not preserved purely for visitors.' },
      { day:5, title:'Trek to Nayapul, drive to Pokhara', time:'4–5 hrs', alt:'850m', diff:'Easy', type:'drive',
        what:'A last descent, then the drive back to Pokhara.',
        brief:'Descend through terraced fields and smaller villages back down to Nayapul, where your vehicle is waiting for the drive to Pokhara — with time in the afternoon to relax by Phewa Lake.',
        tip:'Tip: Book a lakeside table for the afternoon — a good way to ease back into life after five days on the trail.',
        overview:'This short circuit packs sweeping Himalayan views, genuine Gurung culture, and one of Nepal\u2019s best sunrise viewpoints into under a week — the most popular short trek from Pokhara for good reason.' },
    ],
  },
  {
    id: 'mardi', name: 'Mardi Himal Trek', tagline: 'The Hidden Gem Trek',
    duration: '5–6 Days', maxAltitude: '4,500m', difficulty: 'Moderate–Challenging', bestSeason: 'Mar–May, Sep–Nov',
    startEnd: 'Pokhara', groupSize: '2–12',
    summary: 'A quieter, ridge-top alternative to the classic routes, climbing through forest and open alpine terrain to close-range views of Machhapuchhre and the Annapurna massif.',
    culturalNote: 'Fewer villages and far fewer trekkers — this route is about landscape and solitude rather than village culture.',
    whyGo: 'The best short trek for travellers who\u2019ve done a popular route before and want quieter trails and a real base-camp feel.',
    altitudes: [1770, 2550, 2970, 3580, 4500, 1770], peakIdx: 4, peakLabel: 'Mardi Himal Base Camp 4,500m',
    itinerary: [
      { day:1, title:'Drive to Kande, trek to Forest Camp', time:'4–5 hrs', alt:'2,550m', diff:'Moderate', type:'trek',
        what:'Leaving the road behind for quiet forest trails.',
        brief:'A short drive to Kande marks the start of the trail proper, climbing steadily through forest and past small settlements to Forest Camp (also called Kokar), a simple clearing of lodges among the trees.',
        tip:'Tip: Mardi Himal sees far fewer trekkers than Poon Hill — expect quieter trails and simpler teahouses.',
        overview:'This is one of the newer, less-developed routes near Pokhara, and Forest Camp gives an immediate sense of that: no villages, just forest and a handful of lodges.' },
      { day:2, title:'Trek to Low Camp', time:'3–4 hrs', alt:'2,970m', diff:'Moderate', type:'trek',
        what:'A shorter day gaining height through thinning forest.',
        brief:'A steady, shorter climb through rhododendron forest that gradually thins out, with occasional gaps in the canopy offering early glimpses of the peaks ahead. Low Camp sits right at the edge of the treeline.',
        tip:'Tip: The shorter walking time makes today a good day to slow down and let your body adjust to the altitude gain.',
        overview:'Low Camp marks the transition point of the trek — below it, forest; above it, increasingly open ridge walking with the Annapurna range filling the skyline.' },
      { day:3, title:'Trek to High Camp', time:'3–4 hrs', alt:'3,580m', diff:'Moderate', type:'trek',
        what:'Above the treeline — Machhapuchhre fills the view.',
        brief:'Climbing above the last of the forest onto an open, narrow ridge, with Machhapuchhre (Fishtail) and the Annapurna massif now dominating the skyline for the rest of the day. High Camp is a small cluster of lodges perched right on the ridgeline.',
        tip:'Tip: High Camp gets cold fast after sunset — have your warm layers ready before dinner, not after.',
        overview:'The ridge-top position of High Camp gives some of the most exposed, dramatic mountain views of any teahouse stop near Pokhara.' },
      { day:4, title:'Trek to Mardi Himal Base Camp, return to High Camp', time:'6–7 hrs', alt:'4,500m', diff:'Challenging', type:'summit',
        what:'THE day — up to Base Camp for close-range Himalaya views.',
        brief:'An early start for the push up to Mardi Himal Base Camp (4,500m), climbing a rocky ridgeline with increasingly close views of Machhapuchhre\u2019s fishtail summit and the southern Annapurna wall, before returning to High Camp in the afternoon.',
        tip:'Tip: Start as early as your lodge allows — cloud tends to build over the peaks by mid-morning.',
        overview:'This is the physical and scenic high point of the trek: a genuine high-altitude base-camp experience without the permits or crowds of Everest or Annapurna Base Camp.' },
      { day:5, title:'Trek to Kande, drive to Pokhara', time:'6–7 hrs', alt:'1,770m', diff:'Moderate', type:'drive',
        what:'A long descent by a different route, then back to Pokhara.',
        brief:'Descend via Sidhing village on a different route from the way up, passing through fresh scenery and small farming communities, before reaching Kande for the drive back to Pokhara.',
        tip:'Tip: This is the longest descent day of the trek — trekking poles help protect your knees.',
        overview:'Taking a different descent route than the ascent is one of the small touches that makes Mardi Himal feel less repetitive than some short treks.' },
    ],
  },
  {
    id: 'dhampus', name: 'Dhampus Sarangkot Trek', tagline: 'The Quick Cultural Escape',
    duration: '2–3 Days', maxAltitude: '1,650m', difficulty: 'Easy', bestSeason: 'Year-round',
    startEnd: 'Pokhara', groupSize: '2–12',
    summary: 'An easy ridge walk connecting two of the best viewpoints near Pokhara, ideal for travellers short on time or new to trekking.',
    culturalNote: 'Local Gurung village life, traditional farming terraces, and two of the region\u2019s best sunrise/sunset viewpoints.',
    whyGo: 'The best short trek if you only have a couple of days, or want a gentle introduction before a longer trek.',
    altitudes: [1130, 1650, 1600, 850], peakIdx: 1, peakLabel: 'Dhampus Viewpoint 1,650m',
    itinerary: [
      { day:1, title:'Drive to Phedi, trek to Dhampus', time:'3–4 hrs', alt:'1,650m', diff:'Easy', type:'trek',
        what:'An easy climb straight into big mountain views.',
        brief:'A short drive to Phedi, then a steady climb through forest and terraced fields to Dhampus, a Gurung village with immediate views of Annapurna South, Hiunchuli, and Machhapuchhre right from the village itself.',
        tip:'Tip: Dhampus is one of the fastest routes near Pokhara to big mountain views for the effort — ideal for families or first-time trekkers.',
        overview:'Unlike most treks where the views build gradually, Dhampus rewards you almost immediately — a big part of why this route suits travellers with limited time.' },
      { day:2, title:'Trek to Sarangkot', time:'5–6 hrs', alt:'1,600m', diff:'Easy', type:'trek',
        what:'Ridge walking between two of Pokhara\u2019s best viewpoints.',
        brief:'A ridge walk through farming villages and terraced fields connecting Dhampus to Sarangkot, Pokhara\u2019s most famous viewpoint, timed to arrive for sunset over the Annapurna range and the valley below.',
        tip:'Tip: Sarangkot gets busy at sunset with day-trippers driving up from Pokhara — arriving on foot, you\u2019ll already have a good spot.',
        overview:'Sarangkot is normally visited as a quick sunrise drive from Pokhara — arriving here on foot after two days of walking gives the same iconic view a very different, earned feeling.' },
      { day:3, title:'Trek down to Pokhara', time:'2–3 hrs', alt:'850m', diff:'Easy', type:'drive',
        what:'A last sunrise, then an easy walk back down.',
        brief:'An early wake-up for sunrise views over the mountains from Sarangkot, then a relaxed descent back down to Pokhara, leaving the afternoon free to explore the lakeside.',
        tip:'Tip: Keep the afternoon free — most trekkers use it for boating on Phewa Lake or resting at a lakeside cafe.',
        overview:'At just 2–3 days, this is the shortest trek on this page — a satisfying standalone adventure, or a gentle taster before a longer trek elsewhere in Nepal.' },
    ],
  },
  {
    id: 'khopra', name: 'Khopra Ridge Trek', tagline: 'The Offbeat High-Altitude Adventure',
    duration: '6–7 Days', maxAltitude: '3,660m', difficulty: 'Moderate–Challenging', bestSeason: 'Mar–May, Sep–Nov',
    startEnd: 'Pokhara', groupSize: '2–12',
    summary: 'A longer, quieter route branching off the classic Poon Hill trail into pristine, largely untouristed alpine terrain.',
    culturalNote: 'Remote villages with far fewer visitors, rhododendron forest, and near-total trail solitude above Ghorepani.',
    whyGo: 'The best short trek for travellers who want big mountain views without the crowds of the more famous routes.',
    altitudes: [1070, 1540, 2860, 2630, 3660, 3660, 2860, 850], peakIdx: 4, peakLabel: 'Khopra Ridge 3,660m',
    itinerary: [
      { day:1, title:'Drive to Nayapul, trek to Tikhedhunga', time:'3–4 hrs', alt:'1,540m', diff:'Easy', type:'trek',
        what:'Following the Modi Khola into the hills.',
        brief:'Drive from Pokhara to Nayapul and trek along the Modi River through villages including Birethanti to Tikhedhunga — the same gentle opening day used by several routes in this region.',
        tip:'Tip: This trailhead is shared with the Poon Hill route — expect more company today than later in the trek.',
        overview:'Tikhedhunga is a useful staging point before the climb to Ghorepani, giving you a full night\u2019s rest before the steeper walking begins.' },
      { day:2, title:'Trek to Ghorepani', time:'5–6 hrs', alt:'2,860m', diff:'Moderate', type:'trek',
        what:'The stone-step climb into rhododendron forest.',
        brief:'A challenging ascent via the stone staircase to Ulleri, continuing through rhododendron and oak forest to Ghorepani — the same climb used by the Poon Hill trek, but here it\u2019s just the opening act of a longer, quieter route.',
        tip:'Tip: Pace yourself on the steps — you have five more days ahead, unlike the shorter treks that finish here.',
        overview:'Ghorepani is the last genuinely busy village you\u2019ll pass through on this trek — from here, Khopra Ridge branches away from the crowds.' },
      { day:3, title:'Optional Poon Hill sunrise, trek to Tadapani', time:'5–6 hrs', alt:'2,630m', diff:'Moderate', type:'sunrise',
        what:'An optional sunrise detour, then onward through forest.',
        brief:'An optional early climb to Poon Hill for sunrise over the Annapurna and Dhaulagiri ranges, before continuing through rhododendron forest to Tadapani — the last stretch of trail shared with the more popular routes.',
        tip:'Tip: Skip Poon Hill if you\u2019d rather rest — you\u2019ll get comparable, quieter views later on Khopra Ridge itself.',
        overview:'This is effectively the branch point: from Tadapani, most other trekkers head down toward Ghandruk while your route continues up toward Khopra.' },
      { day:4, title:'Trek to Khopra Danda via Nangethanti', time:'6–7 hrs', alt:'3,660m', diff:'Challenging', type:'trek',
        what:'Leaving the main trail behind for pristine alpine terrain.',
        brief:'A long day off the main trekking circuit, climbing through increasingly pristine forest and alpine terrain via Nangethanti to reach Khopra Danda (Khopra Ridge) — with noticeably fewer trekkers than anywhere so far.',
        tip:'Tip: This is the longest and most demanding day of the trek — start early and take it steadily.',
        overview:'The shift in atmosphere today is the whole point of this trek: forest gives way to open ridge, and the crowded trails of the past three days give way to genuine solitude.' },
      { day:5, title:'Explore Khopra Ridge', time:'3–4 hrs', alt:'3,660m', diff:'Moderate', type:'summit',
        what:'A full day among some of the best under-visited views in Nepal.',
        brief:'A full day based at Khopra Ridge (3,660m) with time to explore the surrounding alpine terrain, including an optional side trip toward Khayer Lake, with sweeping views of Dhaulagiri, Annapurna South, and the deep valleys below.',
        tip:'Tip: If your fitness and time allow, ask your guide about the longer side excursion to Khayer Lake, a sacred glacial lake a few hours further on.',
        overview:'Few viewpoints near Pokhara offer this combination of altitude, panorama, and near-total solitude — Khopra Ridge is arguably the least crowded big-view spot in the whole Annapurna region.' },
      { day:6, title:'Trek back to Ghorepani', time:'6–7 hrs', alt:'2,860m', diff:'Moderate', type:'trek',
        what:'Retracing your steps with a fresh perspective.',
        brief:'A long return trek back toward Ghorepani, descending from the ridge through the same alpine and forest terrain, with different light and cloud giving the landscape a noticeably different feel from the way up.',
        tip:'Tip: Watch your footing on the descent — tired legs and loose trail sections are where most minor slips happen.',
        overview:'Returning via the same route lets you notice details missed on the way up, a common pattern on out-and-back routes like Khopra that branch off the main circuit rather than looping around it.' },
      { day:7, title:'Trek to Nayapul, drive to Pokhara', time:'5–6 hrs', alt:'850m', diff:'Easy', type:'drive',
        what:'The final descent, then back to Pokhara.',
        brief:'A last day of trekking down through familiar forest and villages to Nayapul, then the drive back to Pokhara, arriving with time to relax before your next adventure.',
        tip:'Tip: Book your vehicle back to Pokhara the evening before at Ghorepani if possible — availability can be tight on busy afternoons.',
        overview:'At seven days, Khopra Ridge is the longest trek on this page, and rewards the extra time with genuine solitude and some of the best under-visited mountain views close to Pokhara.' },
    ],
  },
];

const gallery = [
  { src:'/images/trekking/pokhara/poon-hill-1.jpeg',   alt:'Sunrise view from Poon Hill', caption:'Sunrise over the Annapurna range from Poon Hill' },
  { src:'/images/trekking/pokhara/ghandruk-1.jpg',     alt:'Gurung village of Ghandruk',  caption:'Ghandruk — one of Nepal\u2019s largest Gurung villages' },
  { src:'/images/trekking/pokhara/mardi-himal-1.jpg',  alt:'Mardi Himal Base Camp',       caption:'Mardi Himal Base Camp, 4,500m' },
  { src:'/images/trekking/pokhara/dhampus-1.jpg',      alt:'Dhampus village',             caption:'Terraced fields above Dhampus' },
  { src:'/images/trekking/pokhara/sarangkot-1.jpg',    alt:'Sunset view from Sarangkot',  caption:'Sunset over Phewa Lake from Sarangkot' },
  { src:'/images/trekking/pokhara/khopra-ridge-1.jpg', alt:'Khopra Ridge views',          caption:'The quiet, open ridgeline of Khopra Danda' },
];

const weatherData = [
  { m:'Jan', lo:-5,  hi:10, cond:'snow',  ok:false },
  { m:'Feb', lo:-3,  hi:12, cond:'snow',  ok:false },
  { m:'Mar', lo:0,   hi:15, cond:'mixed', ok:true  },
  { m:'Apr', lo:3,   hi:18, cond:'cloud', ok:true  },
  { m:'May', lo:5,   hi:20, cond:'sun',   ok:true  },
  { m:'Jun', lo:8,   hi:22, cond:'rain',  ok:false },
  { m:'Jul', lo:10,  hi:22, cond:'rain',  ok:false },
  { m:'Aug', lo:10,  hi:22, cond:'rain',  ok:false },
  { m:'Sep', lo:7,   hi:21, cond:'cloud', ok:true  },
  { m:'Oct', lo:5,   hi:18, cond:'sun',   ok:true  },
  { m:'Nov', lo:0,   hi:15, cond:'mixed', ok:true  },
  { m:'Dec', lo:-3,  hi:12, cond:'snow',  ok:false },
];

const packList = [
  'Comfortable, broken-in hiking boots',
  'Layered clothing — mornings and evenings are cool year-round',
  'Rain jacket, especially during shoulder seasons',
  'Water bottle and purification tablets or a filter',
  'Trekking poles — genuinely useful on the stone-step climbs',
  'Sunscreen SPF 50+ and sunglasses',
  'Headlamp (essential for the Poon Hill sunrise hikes)',
  'Camera — these are some of the most photogenic short walks in Nepal',
];

const culturalHighlights = [
  { icon:<Users size={28}/>,    title:'Gurung Villages',         desc:'Ghandruk, Dhampus, and Ghorepani are traditional Gurung settlements with stone houses, terraced fields, and a long history tied to the Gurkha soldiering tradition. Staying in family-run teahouses here is one of the most authentic cultural experiences available on any short trek in Nepal.' },
  { icon:<Utensils size={28}/>, title:'Local Cuisine',           desc:'Dal bhat (lentil soup, rice, and vegetables) is the trekking staple, alongside dhido (buckwheat porridge), gundruk (fermented greens), and Tibetan bread. Meals are cooked fresh by teahouse families each night, and portions are generous — trekkers eat well on these routes.' },
  { icon:<Heart size={28}/>,    title:'Traditional Architecture',desc:'Stone houses with slate roofs and carved wooden window frames define villages like Ghandruk and Dhampus. Many buildings are generations old, built long before these hillsides became a trekking destination.' },
  { icon:<MapPin size={28}/>,   title:'Quieter Alternatives',    desc:'Mardi Himal and Khopra Ridge branch away from the busier Poon Hill and Annapurna Base Camp trails, offering the same Himalayan scale of scenery with a fraction of the foot traffic — ideal if solitude matters as much as the view.' },
];

const faqs = [
  { q:'Which of these treks should I choose?', a:'For a quick escape with big views for minimal effort, choose Dhampus–Sarangkot (2–3 days). For the classic sunrise panorama and Gurung culture, choose Ghorepani Poon Hill (4–5 days). For fewer crowds and a genuine base-camp feel, choose Mardi Himal (5–6 days) or, for the longest and quietest option, Khopra Ridge (6–7 days).' },
  { q:'Do I need previous trekking experience?', a:'No — Dhampus–Sarangkot and Ghorepani Poon Hill are suitable for reasonably active first-time trekkers. Mardi Himal and Khopra Ridge involve more sustained climbing and higher altitude, so some prior hiking fitness is a real advantage on those two routes.' },
  { q:'Do I need a permit or a guide?', a:'A TIMS card and an Annapurna Conservation Area Permit (ACAP) are required for all four routes, and we arrange both. A licensed guide is included on every trek we run — while not always legally mandatory on these particular trails, we consider one essential for safety, navigation, and getting the most out of the local culture.' },
  { q:'What is the accommodation like?', a:'All four treks use teahouses — family-run guesthouses with simple twin rooms and shared bathrooms. Rooms become more basic at higher camps such as Mardi Himal\u2019s High Camp. Hot showers are usually available for a small fee lower down, less reliably higher up.' },
  { q:'What is the best time of year to go?', a:'March to May and September to November offer the clearest skies and best mountain visibility across all four routes. The Dhampus–Sarangkot trek, at lower altitude, is walkable in winter too, though views can be hazier. The June–August monsoon brings heavy rain and leeches and is best avoided.' },
  { q:'Can I combine one of these with a longer trek?', a:'Yes — these short treks work well as either a standalone trip or a warm-up before a longer Himalayan trek such as Annapurna Base Camp or the Manaslu Circuit. Mardi Himal and Khopra Ridge in particular are good fitness and altitude tests before attempting something bigger.' },
  { q:'What should I pack?', a:'Broken-in hiking boots, layered clothing, a rain jacket, trekking poles, sunscreen, and a headlamp for the pre-dawn viewpoint hikes are the essentials. See the packing list in the sidebar for the full rundown.' },
];

const WeatherIcon = ({ cond, size=20 }: { cond: string; size?: number }) => {
  const p = { size, strokeWidth:1.5, color:TX };
  if (cond==='sun')   return <Sun       {...p} />;
  if (cond==='rain')  return <CloudRain {...p} />;
  if (cond==='snow')  return <CloudSnow {...p} />;
  if (cond==='cloud') return <Cloud     {...p} />;
  return <Wind {...p} />;
};

/* ══════════════════════════════════════════════════════
   BOOKING MODAL
══════════════════════════════════════════════════════ */
interface BookingForm {
  name: string; email: string; phone: string; nationality: string;
  groupSize: string; month: string; year: string; trek: string; message: string;
}
interface BookingErrors { name?: string; email?: string; month?: string; }
interface BookingModalProps { isOpen: boolean; onClose: () => void; defaultTrek: string; }

const BookingModal = ({ isOpen, onClose, defaultTrek }: BookingModalProps) => {
  const isMobile = useIsMobile();
  const blank = (trek: string): BookingForm => ({
    name:'', email:'', phone:'', nationality:'',
    groupSize:'2', month:'', year:'2026', trek, message:'',
  });
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<BookingForm>(blank(defaultTrek));
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => { setForm(p => ({ ...p, trek: defaultTrek })); }, [defaultTrek]);

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
          trek:        form.trek,
          name:        form.name,
          email:       form.email,
          phone:       form.phone,
          nationality: form.nationality,
          group_size:  form.groupSize,
          month:       form.month + ' ' + form.year,
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
    setForm(blank(defaultTrek));
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

        <div style={{ background:INK, borderRadius:'12px 12px 0 0', padding: isMobile ? '24px 20px 20px' : '28px 32px 24px', color:SNOW }}>
          <button onClick={handleClose} aria-label="Close"
            style={{ position:'absolute', top:18, right:20, background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%', width:34, height:34, cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={18}/>
          </button>
          <p style={{ fontSize:14, color:'rgba(243,246,249,0.65)', fontFamily:BODY_FONT, margin:'0 0 6px' }}>Heritage Journey Nepal</p>
          <h2 style={{ fontSize: isMobile ? 26 : 30, fontWeight:600, margin:'0 0 4px', color:SNOW, fontFamily: HEADING_FONT, letterSpacing:'-0.02em' }}>Book your trek</h2>
          <p style={{ fontSize:15, color:'rgba(243,246,249,0.75)', margin:0, fontFamily:BODY_FONT }}>Short duration treks from Pokhara</p>

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
              {select('Which trek?', 'trek', treks.map(t => t.name), true)}

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
                  ['Trek',        form.trek],
                  ['Name',        form.name],
                  ['Email',       form.email],
                  ['Phone',       form.phone || '—'],
                  ['Nationality', form.nationality || '—'],
                  ['Group size',  form.groupSize + ' people'],
                  ['Preferred',   form.month + ' ' + form.year],
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
                Thank you, <strong>{form.name}</strong>! We've received your request for the <strong>{form.trek}</strong> in <strong>{form.month} {form.year}</strong>.
              </p>
              <p style={{ fontSize:15, color:MUT, lineHeight:1.75, margin:'0 0 28px', fontFamily:BODY_FONT }}>
                A Heritage Journey Nepal guide will email <strong>{form.email}</strong> within 24 hours to confirm availability, answer your questions, and arrange next steps.
              </p>
              <div style={{ background:W, border:'1px solid '+BD, borderRadius:10, padding:'16px 20px', marginBottom:24, textAlign:'left' }}>
                <p style={{ fontSize:16, fontWeight:600, color:INK, fontFamily:HEADING_FONT, margin:'0 0 10px' }}>What happens next</p>
                {['We confirm availability for your dates','We send a detailed trip proposal & quote','You pay a 20% deposit to secure your spot','Full balance due before departure'].map((s,i)=>(
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

/* ── GALLERY ─────────────────────────────────────────── */
const Gallery = () => {
  const isMobile = useIsMobile();
  const [lb, setLb] = useState<number | null>(null);
  return (
    <>
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.55fr 1fr',
        gridTemplateRows: isMobile ? 'repeat(6, 200px)' : '240px 240px',
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

/* ── ITINERARY ── simple accordion, per trek */
const ItineraryTimeline = ({ itinerary }: { itinerary: ItineraryDay[] }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => { setOpen(null); }, [itinerary]);
  const indent = isMobile ? 18 : 20 + 56 + 16;

  return (
    <div style={{ background:W, border:'1px solid '+BD, borderRadius:10, overflow:'hidden' }}>
      {itinerary.map((d, i) => {
        const isOpen = open === d.day;
        const meta = [d.time !== '—' && d.time, d.alt !== '—' && d.alt, d.diff].filter(Boolean).join('  ·  ');
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

            <div className="hj-expand" style={{ display:'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition:'grid-template-rows 0.25s ease' }}>
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

/* ── TREK LOCATOR MAP ───────────────────────────────── */
const TrekLocatorMap = ({ activeId }: { activeId: string }) => {
  const [hov, setHov] = useState<string | null>(null);
  const hub = { x:250, y:420 };
  const routes: Record<string, { mid:{x:number;y:number}; end:{x:number;y:number}; endLabel:string; peak?:boolean }> = {
    ghorepani: { mid:{x:255,y:300}, end:{x:205,y:210}, endLabel:'Poon Hill', peak:true },
    mardi:     { mid:{x:305,y:280}, end:{x:275,y:165}, endLabel:'Mardi Himal BC', peak:true },
    dhampus:   { mid:{x:185,y:330}, end:{x:225,y:270}, endLabel:'Sarangkot' },
    khopra:    { mid:{x:230,y:270}, end:{x:150,y:225}, endLabel:'Khopra Ridge', peak:true },
  };
  const buildPath = (a:{x:number;y:number}, m:{x:number;y:number}, b:{x:number;y:number}) =>
    `M ${a.x} ${a.y} C ${a.x+(m.x-a.x)*0.4} ${a.y+(m.y-a.y)*0.4}, ${m.x-(m.x-b.x)*0.4} ${m.y-(m.y-b.y)*0.4}, ${m.x} ${m.y} S ${b.x-(b.x-m.x)*0.3} ${b.y-(b.y-m.y)*0.3}, ${b.x} ${b.y}`;

  return (
    <div style={{ background:'#eaf0f5', borderRadius:10, overflow:'hidden', border:'1px solid '+BD }}>
      <svg width="100%" viewBox="0 0 500 470" style={{ display:'block' }} role="img" aria-label="Map of the four short treks from Pokhara">
        <defs>
          <pattern id="tp" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
            <ellipse cx="35" cy="35" rx="33" ry="24" fill="none" stroke={BD} strokeWidth="0.5" opacity="0.7"/>
            <ellipse cx="35" cy="35" rx="20" ry="14" fill="none" stroke={BD} strokeWidth="0.4" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="500" height="470" fill="#eaf0f5"/>
        <rect width="500" height="470" fill="url(#tp)"/>
        <polygon points="180,28 230,98 130,98" fill={W} opacity="0.95"/>
        <polygon points="250,22 300,98 200,98" fill={W} opacity="0.9"/>
        <polygon points="100,42 150,102 60,102" fill={W} opacity="0.75"/>
        <polygon points="180,28 230,98 130,98" fill={INK} opacity="0.06"/>
        <text x="200" y="16" textAnchor="middle" fontSize="10" fill={TX} opacity="0.8">Annapurna foothills</text>

        {Object.entries(routes).map(([id, r]) => {
          const isActive = id === activeId;
          const isHov = hov === id;
          const c = routeColors[id];
          const lit = isActive || isHov;
          return (
            <g key={id} style={{ cursor:'pointer' }} onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov(null)}>
              <path d={buildPath(hub, r.mid, r.end)} fill="none" stroke={c}
                strokeWidth={lit ? 4.5 : 2.5} strokeLinecap="round"
                opacity={lit ? 1 : 0.5}
                strokeDasharray={isActive ? undefined : '7 5'}
                style={{ transition:'all 0.2s' }}/>
              <circle cx={r.end.x} cy={r.end.y} r={r.peak ? 11 : 8} fill={c} stroke={W} strokeWidth="2.5"
                opacity={lit ? 1 : 0.6} style={{ transition:'all 0.2s' }}/>
              {r.peak && <text x={r.end.x} y={r.end.y+1} textAnchor="middle" dominantBaseline="central" fontSize="9" fill={id==='ghorepani'||id==='mardi'||id==='khopra' ? W : INK} fontWeight="700">▲</text>}
              <text x={r.end.x + (r.end.x<250?-16:16)} y={r.end.y} textAnchor={r.end.x<250?'end':'start'} dominantBaseline="central"
                fontSize={11} fontWeight={700} fill={INK} opacity={lit ? 1 : 0.7}>
                {r.endLabel}
              </text>
            </g>
          );
        })}

        <circle cx={hub.x} cy={hub.y} r="12" fill={INK} stroke={W} strokeWidth="3"/>
        <text x={hub.x} y={hub.y+1} textAnchor="middle" dominantBaseline="central" fontSize="10" fill={W} fontWeight="700">✈</text>
        <text x={hub.x} y={hub.y+28} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>Pokhara</text>

        <rect x="12" y="12" width="162" height="98" rx="8" fill={W} opacity="0.95"/>
        <text x="24" y="30" fontSize="10" fontWeight="700" fill={INK}>Routes</text>
        {Object.entries(routeColors).map(([id,c],i) => (
          <g key={id}>
            <line x1="24" y1={45+i*16} x2="50" y2={45+i*16} stroke={c} strokeWidth="4" strokeLinecap="round"/>
            <text x="56" y={45+i*16} dominantBaseline="central" fontSize="9" fill={TX}>
              {treks.find(t=>t.id===id)?.name.replace(' Trek','')}
            </text>
          </g>
        ))}
        <g transform="translate(468,42)">
          <circle r="20" fill={W} opacity="0.95"/>
          <text textAnchor="middle" y="-6" fontSize="9" fontWeight="700" fill={INK}>N</text>
          <line x1="0" y1="-15" x2="0" y2="15" stroke={BD} strokeWidth="1.2"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke={BD} strokeWidth="1.2"/>
          <polygon points="0,-15 -4,-5 0,0" fill={INK}/>
          <polygon points="0,-15 4,-5 0,0" fill={BD}/>
        </g>
      </svg>
    </div>
  );
};

/* ── ELEVATION PROFILE (per trek) ───────────────────── */
const ElevationProfile = ({ altitudes, peakIdx, peakLabel, days }: { altitudes:number[]; peakIdx:number; peakLabel:string; days:number }) => {
  const MIN=500, MAX=Math.max(5000, Math.ceil(Math.max(...altitudes)/500)*500+500);
  const VW=580, VH=140, pL=44, pR=12, pT=12, pB=32;
  const iW=VW-pL-pR, iH=VH-pT-pB, xS = altitudes.length>1 ? iW/(altitudes.length-1) : iW;
  const yF=(a:number)=>pT+iH-((a-MIN)/(MAX-MIN))*iH;
  let d = 'M '+pL+' '+yF(altitudes[0]);
  for(let i=1;i<altitudes.length;i++){
    const x0=pL+(i-1)*xS, x1=pL+i*xS, y0=yF(altitudes[i-1]), y1=yF(altitudes[i]);
    d += ' C '+(x0+xS*0.5)+' '+y0+', '+(x1-xS*0.5)+' '+y1+', '+x1+' '+y1;
  }
  const fd = d+' L '+(pL+(altitudes.length-1)*xS)+' '+(VH-pB)+' L '+pL+' '+(VH-pB)+' Z';
  const gridSteps = MAX >= 5000 ? [1000,2000,3000,4000,5000] : [1000,2000,3000,4000];
  const peakX = pL+peakIdx*xS;
  const anchor = peakIdx > altitudes.length/2 ? 'end' : 'middle';

  return (
    <div style={{ background:W, borderRadius:10, padding:'18px 14px 14px', border:'1px solid '+BD }}>
      <p style={{ fontSize:18, color:INK, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', margin:'0 0 10px '+pL+'px' }}>Elevation profile, days 1–{days}</p>
      <svg width="100%" viewBox={'0 0 '+VW+' '+VH} role="img" aria-label={'Elevation profile peaking at '+peakLabel}>
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={INK} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={INK} stopOpacity="0.03"/>
          </linearGradient>
        </defs>
        {gridSteps.map(a=>(
          <g key={a}>
            <line x1={pL} y1={yF(a)} x2={VW-pR} y2={yF(a)} stroke={BD} strokeWidth="0.6" strokeDasharray="3 3"/>
            <text x={pL-5} y={yF(a)} textAnchor="end" dominantBaseline="central" fontSize="8" fill={MUT}>{a/1000}k</text>
          </g>
        ))}
        <path d={fd} fill="url(#eg)"/>
        <path d={d} fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round"/>
        <circle cx={peakX} cy={yF(altitudes[peakIdx])} r="5" fill={SAFF} stroke={INK} strokeWidth="2"/>
        <text x={peakX} y={yF(altitudes[peakIdx])-11} textAnchor={anchor} fontSize="9" fill={INK} fontWeight="700">{peakLabel}</text>
        {altitudes.map((_,i)=><text key={i} x={pL+i*xS} y={VH-5} textAnchor="middle" fontSize="7.5" fill={MUT}>{i}</text>)}
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
      <div style={{ maxHeight: open ? 420 : 0, overflow:'hidden', transition:'max-height 0.4s ease' }}>
        <p style={{ fontSize:16, color:TX, lineHeight:1.78, paddingBottom:20, margin:0 }}>{a}</p>
      </div>
    </div>
  );
};

/* ── MAIN PAGE ──────────────────────────────────────── */
const ShortDurationTreks = () => {
  const isMobile = useIsMobile();
  const [showBooking,  setShowBooking]  = useState<boolean>(false);
  const [selectedId,   setSelectedId]   = useState<string>(treks[0].id);
  const overviewRef  = useRef<HTMLDivElement | null>(null);
  const trekRef      = useRef<HTMLDivElement | null>(null);
  useEffect(() => { window.scrollTo(0,0); }, []);

  const selected = treks.find(t => t.id === selectedId) || treks[0];

  const selectTrek = (id: string) => {
    setSelectedId(id);
    setTimeout(() => trekRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block:'start' }), 50);
  };

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

      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} defaultTrek={selected.name}/>
      <div style={{ fontFamily:BODY_FONT, background:BG, color:INK, minHeight:'100vh', paddingBottom: isMobile ? 76 : 0 }}>

        {/* ── HERO ──────────────────────────────────── */}
        <div style={{ position:'relative', minHeight: isMobile ? '80vh' : '92vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:INK }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'url(/images/trekking/pokhara/pokhara-short-trek.jpg)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.95) contrast(1.06) saturate(0.95)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(12,22,38,0.5), rgba(12,22,38,0.8))' }}/>

          <div style={{ position:'relative', zIndex:2, textAlign:'center', padding: isMobile ? '110px 20px 70px' : '150px 32px 100px', maxWidth:900 }}>
            <p style={{ fontSize:16, fontWeight:500, color:'rgba(243,246,249,0.85)', margin:'0 0 16px' }}>
              Trekking in the Annapurna foothills
            </p>
            <h1 style={{ fontSize:'clamp(2.6rem,9vw,6rem)', fontWeight:600, lineHeight:1.02, color:SNOW, margin:'0 0 22px', textShadow:'0 2px 24px rgba(12,22,38,0.5)', letterSpacing:'-0.03em', fontFamily: HEADING_FONT }}>
              Short Duration<br/>Treks from Pokhara
            </h1>
            <p style={{ fontSize:'clamp(1.05rem,2.4vw,1.3rem)', color:'rgba(243,246,249,0.9)', lineHeight:1.7, maxWidth:640, margin: isMobile ? '0 auto 28px' : '0 auto 36px' }}>
              Big Himalayan views, in just a few days<br/>
              <span style={{ fontSize:'0.88em', color:'rgba(243,246,249,0.75)' }}>
                Four routes of 2–7 days, for every schedule and fitness level
              </span>
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap: isMobile ? 8 : 12, justifyContent:'center', marginBottom: isMobile ? 32 : 44 }}>
              {[{icon:<Clock size={16}/>,label:'2–7 days'},{icon:<Mountain size={16}/>,label:'Up to 4,500m'},{icon:<Compass size={16}/>,label:'Easy–Challenging'},{icon:<Calendar size={16}/>,label:'Mar–May, Sep–Nov'}].map((s,i)=>(
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
            {[{label:'Duration',val:'2–7 days'},{label:'Max altitude',val:'4,500m'},{label:'Difficulty',val:'Easy–Challenging'},{label:'Routes',val:'4 options'},{label:'Group size',val:'2–12'},{label:'Start / end',val:'Pokhara'}].map((f,i,arr)=>(
              <div key={i} style={{ textAlign:'center', padding: isMobile ? '8px 12px' : '8px 22px', minWidth: isMobile ? '30%' : 'auto', borderRight: (!isMobile && i<arr.length-1) ? '1px solid rgba(255,255,255,0.18)':'none' }}>
                <div style={{ fontSize: isMobile ? 13 : 14, color:'rgba(243,246,249,0.65)', marginBottom:4 }}>{f.label}</div>
                <div style={{ fontSize: isMobile ? 17 : 22, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.01em' }}>{f.val}</div>
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
                <SectionTitle mb={22} size="clamp(2rem,5vw,3.1rem)">Four routes, one gateway to the Annapurnas</SectionTitle>

                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : '28px 44px', marginBottom:32 }}>
                  {[
                    { title:'What are these treks?', text:'A collection of short, guided walking holidays from Pokhara ranging from 2 to 7 days, taking in Himalayan viewpoints, forest trails, and traditional villages. No climbing gear needed — just boots, a daypack, and a bit of fitness.' },
                    { title:'How fit do I need to be?', text:'Most routes involve 3–7 hours of walking a day on hillside trails and stone steps. Ghorepani and Dhampus–Sarangkot suit most reasonably active travellers; Mardi Himal and Khopra Ridge are more demanding.' },
                    { title:'Where do you sleep?', text:'In family-run teahouses throughout — simple twin rooms with shared bathrooms lower down, becoming more basic at higher camps such as Mardi Himal\u2019s High Camp.' },
                    { title:'Which trek should I choose?', text:'Short on time? Dhampus–Sarangkot (2–3 days). Want the classic sunrise view? Ghorepani Poon Hill (4–5 days). Want fewer crowds? Mardi Himal or Khopra Ridge (5–7 days).' },
                  ].map((box, i) => (
                    <div key={i} style={{ borderTop:'3px solid '+INK, paddingTop:14 }}>
                      <h3 style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', lineHeight:1.25, margin:'0 0 8px' }}>{box.title}</h3>
                      <p style={{ fontSize:15.5, color:TX, lineHeight:1.7, margin:0 }}>{box.text}</p>
                    </div>
                  ))}
                </div>

                <p style={{ ...bodyText, marginBottom:16 }}>
                  Pokhara is Nepal's gateway for short trekking adventures that deliver panoramic mountain vistas, immerse you in traditional village life, and reveal the natural beauty of the Annapurna foothills — all within a manageable timeframe. Whether you want an easy escape or a genuine physical challenge, these four routes each offer a distinct perspective on the same spectacular range.
                </p>
                <p style={bodyText}>
                  None of these treks require restricted-area permits or technical climbing skill, which makes them ideal both as standalone short breaks and as a fitness or altitude warm-up before a longer Himalayan trek elsewhere in Nepal.
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
                    'Stunning sunrise views from Poon Hill over the Annapurna and Dhaulagiri ranges',
                    'Authentic Gurung village life and culture in Ghandruk and Dhampus',
                    'Magnificent rhododendron forests, especially beautiful in spring',
                    'Panoramic close-up views of Machhapuchhre from Mardi Himal Base Camp',
                    'Spectacular, uncrowded mountain landscapes on the Khopra Ridge Trek',
                    'Perfect short adventures suitable for families and first-time trekkers',
                  ].map((h, i) => (
                    <p key={i} style={{ margin:0, padding:'15px 0', borderTop:'1px solid '+BD, fontSize:16.5, lineHeight:1.55, color:INK }}>
                      {h}
                    </p>
                  ))}
                </div>
              </section>

              {/* Locator Map */}
              <section style={{ marginBottom: isMobile ? 44 : 60 }}>
                <SectionTitle mb={10}>Route map</SectionTitle>
                <p style={{ fontSize: isMobile ? 15 : 16, color:TX, marginBottom:16, lineHeight:1.7 }}>
                  All four routes begin and end in Pokhara. {!isMobile && 'Hover any route to see where it leads. The solid line is the trek you have selected below.'}
                </p>
                <TrekLocatorMap activeId={selectedId}/>
              </section>

              {/* Trek Selector */}
              <section ref={trekRef} style={{ marginBottom: isMobile ? 44 : 60, scrollMarginTop: 24 }}>
                <SectionTitle>Choose your trek</SectionTitle>
                <div role="tablist" style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap:10, marginBottom:28 }}>
                  {treks.map(t => {
                    const active = t.id === selectedId;
                    return (
                      <button key={t.id} role="tab" aria-selected={active} onClick={() => selectTrek(t.id)}
                        style={{
                          textAlign:'left', cursor:'pointer', borderRadius:10, padding:'12px 14px 14px',
                          border:'2px solid '+(active ? INK : BD),
                          borderTop:'5px solid '+routeColors[t.id],
                          background: active ? W : SNOW,
                          fontFamily:BODY_FONT, transition:'border-color 0.2s',
                        }}>
                        <div style={{ fontSize:14, color:MUT, marginBottom:4 }}>{t.duration}</div>
                        <div style={{ fontSize:18, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', lineHeight:1.2, marginBottom:4 }}>{t.name}</div>
                        <div style={{ fontSize:14, color:TX }}>{t.tagline}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected trek */}
                <div style={{ background:W, border:'1px solid '+BD, borderRadius:10, padding: isMobile ? '20px' : '28px' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap', marginBottom:14 }}>
                    <div>
                      <h3 style={{ fontSize:'clamp(1.5rem,3.5vw,2.1rem)', fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.025em', lineHeight:1.12, margin:'0 0 4px' }}>{selected.name}</h3>
                      <p style={{ fontSize:16, color:MUT, margin:0 }}>{selected.tagline}</p>
                    </div>
                    <button onClick={()=>setShowBooking(true)}
                      style={{ background:SAFF, color:INK, border:'none', borderRadius:8, height:48, padding:'0 24px', fontSize:15, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
                      Enquire about this trek
                    </button>
                  </div>

                  <p style={{ fontSize: isMobile ? 16 : 17, color:TX, lineHeight:1.75, margin:'0 0 22px' }}>{selected.summary}</p>

                  <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(5,1fr)', gap:'16px 20px', marginBottom:26 }}>
                    {[
                      {label:'Duration',   val:selected.duration},
                      {label:'Max altitude',val:selected.maxAltitude},
                      {label:'Difficulty', val:selected.difficulty},
                      {label:'Best time',  val:selected.bestSeason},
                      {label:'Group size', val:selected.groupSize},
                    ].map((s,i) => (
                      <div key={i} style={{ borderTop:'3px solid '+INK, paddingTop:8 }}>
                        <div style={{ fontSize:14, color:MUT, marginBottom:2 }}>{s.label}</div>
                        <div style={{ fontSize:16, fontWeight:600, color:INK, lineHeight:1.3 }}>{s.val}</div>
                      </div>
                    ))}
                  </div>

                  <p style={{ margin:'0 0 26px', paddingLeft:18, borderLeft:'3px solid '+SAFF, fontSize: isMobile ? 15.5 : 16.5, color:INK, lineHeight:1.75 }}>
                    <strong>Why go:</strong> {selected.whyGo}
                  </p>

                  <ElevationProfile altitudes={selected.altitudes} peakIdx={selected.peakIdx} peakLabel={selected.peakLabel} days={selected.itinerary.length}/>

                  <h4 style={{ fontSize:22, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', margin:'32px 0 8px' }}>Day-by-day itinerary</h4>
                  <p style={{ fontSize:16, color:TX, margin:'0 0 18px', lineHeight:1.65 }}>
                    Tap a day to read the full description and practical tips. Each day shows walking time, altitude and difficulty.
                  </p>
                  <ItineraryTimeline itinerary={selected.itinerary}/>

                  <div style={{ marginTop:28, borderTop:'3px solid '+INK, paddingTop:14 }}>
                    <h4 style={{ fontSize:20, fontWeight:600, color:INK, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', margin:'0 0 8px' }}>Cultural highlights</h4>
                    <p style={{ fontSize:15.5, color:TX, lineHeight:1.7, margin:0 }}>{selected.culturalNote}</p>
                  </div>
                </div>
              </section>

              {/* Weather */}
              <section>
                <SectionTitle>Weather and best time to visit</SectionTitle>
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:16, marginBottom:28 }}>
                  {[
                    { season:'Spring (Mar–May)', text:'The most popular season across all four routes. Rhododendrons bloom lower down, days are warm, and skies are generally clear, with some cloud build-up by May.' },
                    { season:'Autumn (Sep–Nov)', text:'Crystal-clear skies and the sharpest mountain views of the year. The busiest season on every route, so book teahouses ahead where possible.' },
                    { season:'Winter (Dec–Feb)', text:'Cold at higher camps (Mardi Himal, Khopra Ridge) with possible snow, but Dhampus–Sarangkot at lower altitude remains walkable year-round.' },
                    { season:'Monsoon (Jun–Aug)', text:'Heavy rain, leeches, and poor visibility on all routes. Not recommended for any of these treks.' },
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
              </section>
            </div>

            {/* SIDEBAR */}
            <div style={{ position: isMobile ? 'static' : 'sticky', top: isMobile ? 'auto' : 24 }}>
              <div style={{ background:INK, color:SNOW, borderRadius:12, padding: isMobile ? '24px 22px' : '30px 26px', marginBottom:18 }}>
                <div style={{ fontSize:15, color:'rgba(243,246,249,0.65)', marginBottom:6 }}>Selected trek</div>
                <div style={{ fontSize: isMobile ? 24 : 28, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.025em', lineHeight:1.15, marginBottom:14 }}>{selected.name}</div>
                {[
                  {icon:<Clock size={15}/>,    label:'Duration',     val:selected.duration    },
                  {icon:<Mountain size={15}/>, label:'Max altitude', val:selected.maxAltitude },
                  {icon:<Compass size={15}/>,  label:'Difficulty',   val:selected.difficulty  },
                  {icon:<Users size={15}/>,    label:'Group size',   val:selected.groupSize   },
                  {icon:<MapPin size={15}/>,   label:'Start / end',  val:selected.startEnd    },
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

              <div style={{ background:W, borderRadius:10, padding: isMobile ? '18px' : '22px', border:'1px solid '+BD, marginBottom:18 }}>
                <h4 style={{ fontSize:21, fontFamily:HEADING_FONT, fontWeight:600, color:INK, letterSpacing:'-0.015em', margin:'0 0 12px' }}>Compare all four</h4>
                {treks.map(t => {
                  const active = t.id===selectedId;
                  return (
                    <button key={t.id} onClick={() => selectTrek(t.id)} aria-pressed={active}
                      style={{
                        width:'100%', textAlign:'left', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12,
                        background: active ? SNOW : 'transparent',
                        border:'none', borderLeft:'4px solid '+routeColors[t.id],
                        borderRadius:4, padding:'10px 12px', marginBottom:6, fontFamily:BODY_FONT,
                      }}>
                      <span style={{ fontSize:15.5, color:INK, fontWeight: active ? 600 : 500 }}>{t.name.replace(' Trek','')}</span>
                      <span style={{ fontSize:14, color:MUT, whiteSpace:'nowrap' }}>{t.duration}</span>
                    </button>
                  );
                })}
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
            <SectionTitle center mb={isMobile ? 36 : 52} size="clamp(1.8rem,5vw,2.7rem)">People, places and traditions</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:22 }}>
              {culturalHighlights.map((c,i)=>(
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
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────── */}
        <div style={{ background:INK, padding: isMobile ? '56px 20px' : '84px 32px', textAlign:'center', color:SNOW }}>
          <h2 style={{ fontSize:'clamp(2rem,6vw,3.4rem)', fontWeight:600, lineHeight:1.08, letterSpacing:'-0.03em', margin:'0 0 18px', fontFamily: HEADING_FONT }}>
            Ready for your<br/>Pokhara adventure?
          </h2>
          <p style={{ fontSize: isMobile ? 17 : 19, color:'rgba(243,246,249,0.82)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
            Our expert guides can help you pick the right route and tailor it to your group. Private departures are available year-round.
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

        {/* Mobile: keep the selected trek and booking button always within reach */}
        {isMobile && (
          <div style={{ position:'fixed', left:0, right:0, bottom:0, zIndex:50, background:W, borderTop:'1px solid '+BD, padding:'10px 16px calc(10px + env(safe-area-inset-bottom, 0px))', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, color:MUT, lineHeight:1.2 }}>{selected.duration}</div>
              <div style={{ fontSize:17, fontWeight:600, fontFamily:HEADING_FONT, letterSpacing:'-0.015em', color:INK, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{selected.name.replace(' Trek','')}</div>
            </div>
            <button onClick={()=>setShowBooking(true)}
              style={{ background:SAFF, color:INK, border:'none', borderRadius:8, height:48, padding:'0 22px', fontSize:16, fontFamily:BODY_FONT, fontWeight:600, cursor:'pointer', flexShrink:0 }}>
              Book this trek
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShortDurationTreks;