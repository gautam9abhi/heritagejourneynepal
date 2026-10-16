import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';

/* ── DESIGN TOKENS (same as Hero.tsx) ────────────────
   Used below as Tailwind arbitrary values:
   ink #0c1626, snow #f3f6f9, saffron #f5a81c (hover #ffb92e), prayer-flag red #d63a32. */

/* ── FONTS (same as Hero.tsx) ────────────────────────
   Outfit: headings, card titles, prices and numerals.
   Hind: body text. Applied inline on each element so nothing can override it. */
const HEADING_FONT = "'Outfit', 'Helvetica Neue', Arial, sans-serif";
const BODY_FONT = "'Hind', system-ui, -apple-system, 'Segoe UI', sans-serif";
const H: CSSProperties = { fontFamily: HEADING_FONT, fontWeight: 600, letterSpacing: '-0.02em' };

// ─── Data ─────────────────────────────────────────────────────────────────────

interface ItineraryDay {
  day: number;
  title: string;
  meta?: string;       // altitude / drive distance / duration line
  description: string;
  optional?: string;   // optional add-on activities for the day
}

const tours = [
  {
    id: 1, trek_route: "/trekking/everest-base-camp-trek",
    title: "Everest Base Camp Trek", duration: "14 Days", price: 1500,
    tag: "Most Popular",
    description: "The definitive Himalayan journey — walk to the foot of the world's highest mountain through Sherpa villages, ancient monasteries, and the legendary Khumbu region.",
    longDescription: "Stand at the foot of the world's highest peak on this legendary trek. Walk through the iconic Khumbu region, past Sherpa villages and ancient monasteries to Everest Base Camp (5,364m), with unparalleled views of the Khumbu Icefall and the south face of Everest.",
    image: "https://heritagejourneynepal.com/images/trekking/ebc/everest-2.jpg",
    difficulty: "Challenging", maxAltitude: "5,364m", type: "trekking",
    bestSeason: "Mar–May, Sep–Nov", rating: 4.9, reviews: 312, groupSize: "2–16", startPoint: "Lukla",
    highlights: ["Namche Bazaar acclimatisation", "Tengboche Monastery", "Khumbu Icefall views", "Kala Patthar sunrise (5,545m)"],
    includes: ["All teahouse accommodation", "Licensed guide & porter", "Sagarmatha NP permit", "Domestic flight Kathmandu–Lukla"],
    weather: "−10°C to 10°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 2, trek_route: "/trekking/annapurna-base-camp",
    title: "Annapurna Base Camp Trek", duration: "10 Days", price: 950,
    tag: "Editor's Choice",
    description: "A 360° amphitheatre of Himalayan giants — trek through rhododendron forests and Gurung villages to the sanctuary below Annapurna I (8,091m).",
    longDescription: "Venture into the Annapurna sanctuary, surrounded by a 360° amphitheater of peaks including Annapurna I (8,091m) and Machapuchare. The trail winds through rhododendron forests, terraced rice paddies, and traditional Gurung villages before the dramatic sanctuary opening.",
    image: "https://heritagejourneynepal.com/images/trekking/abc/abc-5.jpg",
    difficulty: "Moderate", maxAltitude: "4,130m", type: "trekking",
    bestSeason: "Mar–May, Sep–Nov", rating: 4.8, reviews: 248, groupSize: "2–14", startPoint: "Nayapul",
    highlights: ["Ghorepani Poon Hill sunrise", "Machapuchare Base Camp", "Traditional Gurung villages", "Rhododendron forest in bloom"],
    includes: ["Teahouse accommodation", "Guide & porter", "ACAP conservation permit", "Transport Pokhara–Nayapul"],
    weather: "0°C to 15°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 3, trek_route: null,
    title: "Kathmandu Valley Heritage Tour", duration: "4 Days", price: 450,
    tag: "Best Introduction",
    description: "Three UNESCO World Heritage cities in four days — Kathmandu's Durbar Square, Bhaktapur's medieval core, and Patan's golden temples.",
    longDescription: "Immerse yourself in 2,000 years of Newar art and culture across three ancient cities. Marvel at medieval Bhaktapur, the golden temples of Patan's Durbar Square, the great stupa of Boudhanath, and the sacred Pashupatinath temple on the banks of the Bagmati River.",
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1400&auto=format&fit=crop",
    difficulty: "Easy", maxAltitude: "1,400m", type: "cultural",
    bestSeason: "All Year", rating: 4.7, reviews: 189, groupSize: "2–20", startPoint: "Kathmandu",
    highlights: ["Pashupatinath Temple at dusk", "Boudhanath Stupa circumambulation", "Patan Durbar Square", "Bhaktapur pottery quarter"],
    includes: ["Boutique hotel accommodation", "Expert cultural guide", "All monument entry fees", "Private vehicle"],
    weather: "15°C to 28°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 4, trek_route: "/trekking/langtang-himal-trek",
    title: "Langtang Valley Trek", duration: "8 Days", price: 850,
    tag: "",
    description: "Nepal's 'Valley of Glaciers' just 60km from Kathmandu — Tamang villages, yak pastures, and the towering Langtang Lirung at 7,227m.",
    longDescription: "Just 60km north of Kathmandu lies the beautiful Langtang Valley — the 'Valley of Glaciers'. Trek through oak forests, yak pastures, and Tamang villages to high alpine meadows below Langtang Lirung (7,227m). A deeply human story of resilience after the 2015 earthquake.",
    image: "https://images.unsplash.com/photo-1643548947288-fbf86caf414a?q=80&w=1400&auto=format&fit=crop",
    difficulty: "Moderate", maxAltitude: "4,984m", type: "trekking",
    bestSeason: "Mar–May, Sep–Nov", rating: 4.6, reviews: 134, groupSize: "2–12", startPoint: "Syabrubesi",
    highlights: ["Kyanjin Gompa monastery", "Glacier viewpoints", "Authentic Tamang culture", "Yak cheese factory visit"],
    includes: ["Teahouse accommodation", "Guide & porter", "LANP permit", "Bus transfers from Kathmandu"],
    weather: "−5°C to 12°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 5, trek_route: "/trekking/short-duration-treks",
    title: "Pokhara Adventure Package", duration: "6 Days", price: 680,
    tag: "",
    description: "Paragliding over Phewa Lake, kayaking beneath the Annapurna reflection, and sunrises at Sarangkot — Nepal's adventure capital delivered in full.",
    longDescription: "Nepal's adventure capital on the shores of Phewa Lake offers thrilling activities: soar by tandem paraglider, kayak beneath the Annapurna reflection, explore the dramatic Seti Gorge, and hike to the World Peace Pagoda at sunset.",
    image: "https://images.unsplash.com/photo-1750199886150-8d43b56718df?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    difficulty: "Easy", maxAltitude: "2,000m", type: "adventure",
    bestSeason: "All Year", rating: 4.5, reviews: 97, groupSize: "2–10", startPoint: "Pokhara",
    highlights: ["Tandem paragliding over Phewa Lake", "Sarangkot Annapurna sunrise", "Seti River Gorge walk", "World Peace Pagoda hike"],
    includes: ["Lakeside hotel accommodation", "Activity guide", "Paragliding fee included", "All local transport"],
    weather: "10°C to 25°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 6, trek_route: "/trekking/manaslu-circuit-trek",
    title: "Manaslu Circuit Trek", duration: "16 Days", price: 1800,
    tag: "Remote & Restricted",
    description: "A circuit of the world's 8th highest peak through valleys opened to trekkers only in 1992 — among the most dramatic routes in the Himalayas.",
    longDescription: "The Manaslu Circuit circumnavigates the 8,163m Manaslu massif through remote valleys opened to trekkers only in 1992. Cross Larkya La pass (5,160m) and experience authentic Tibetan-influenced culture barely touched by tourism.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop",
    difficulty: "Challenging", maxAltitude: "5,160m", type: "trekking",
    bestSeason: "Mar–May, Sep–Nov", rating: 4.9, reviews: 76, groupSize: "2–10", startPoint: "Soti Khola",
    highlights: ["Larkya La Pass crossing (5,160m)", "Manaslu Glacier panorama", "Nubri & Tsum side valleys", "Restricted-area Tibetan villages"],
    includes: ["Restricted Area Permit", "Teahouse accommodation", "Expert high-altitude guide & porter", "Jeep transfers"],
    weather: "−15°C to 8°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 7, trek_route: null,
    title: "Chitwan Jungle Safari", duration: "4 Days", price: 520,
    tag: "Wildlife",
    description: "Track one-horned rhinos on foot and look for Bengal tigers by jeep in Chitwan — a UNESCO World Heritage jungle bordering India.",
    longDescription: "Descend into the subtropical wilderness of Chitwan National Park — a UNESCO World Heritage Site. Track one-horned rhinos on foot, spot Bengal tigers by jeep, canoe the Rapti River, and sleep to jungle sounds in a riverside lodge.",
    image: "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1400&auto=format&fit=crop",
    difficulty: "Easy", maxAltitude: "200m", type: "wildlife",
    bestSeason: "Oct–May", rating: 4.7, reviews: 203, groupSize: "2–12", startPoint: "Sauraha",
    highlights: ["On-foot rhino tracking", "Bengal tiger jeep safari", "Rapti River canoe trip", "600+ bird species"],
    includes: ["River-view jungle lodge", "Expert naturalist guide", "All park & entry permits", "All safari activities"],
    weather: "18°C to 32°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 8, trek_route: "/trekking/upper-mustang",
    title: "Upper Mustang Trek", duration: "13 Days", price: 2200,
    tag: "Forbidden Kingdom",
    description: "The former Kingdom of Lo — ochre cliffs, cave monasteries, and the walled medieval capital of Lo Manthang in Nepal's high-altitude Tibetan desert.",
    longDescription: "Step back in time in the former Kingdom of Lo — a high-altitude desert hidden behind the Himalayas with culture, landscape, and architecture entirely distinct from the rest of Nepal. Granted restricted access only since 1992.",
    image: "https://heritagejourneynepal.com/images/trekking/upper/upper-3.jpg",
    difficulty: "Moderate", maxAltitude: "4,000m", type: "trekking",
    bestSeason: "May–Oct", rating: 4.9, reviews: 88, groupSize: "2–10", startPoint: "Jomsom",
    highlights: ["Lo Manthang walled city", "Ancient cave monastery complex", "Chhoser sky caves", "Living Tibetan Buddhist culture"],
    includes: ["Restricted Area Permit (\$500 included)", "Teahouse accommodation", "Expert licensed guide", "Pokhara–Jomsom flight"],
    weather: "5°C to 20°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 9, trek_route: null,
    title: "Nepal Highlights: Kathmandu, Chitwan & Pokhara", duration: "8 Days", price: 1290,
    tag: "Best of Nepal",
    description: "Cultural wonders, wildlife encounters, and scenic splendours in one seamless journey — three UNESCO cities, a jungle safari, and the lakeside Himalayan views of Pokhara.",
    longDescription: "A complete introduction to Nepal in a single itinerary: the temples and living heritage of the Kathmandu Valley, a jungle safari and Tharu cultural immersion in Chitwan National Park, and the Himalayan lake views of Pokhara. This is the trip for travellers who want to experience the full breadth of the country — ancient cities, wildlife, and mountain scenery — without committing to a multi-week trek.",
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1400&auto=format&fit=crop",
    difficulty: "Easy", maxAltitude: "1,592m", type: "cultural",
    bestSeason: "All Year", rating: 4.8, reviews: 61, groupSize: "2–20", startPoint: "Kathmandu",
    highlights: ["Boudhanath Stupa & Swayambhunath", "Chitwan jungle safari & canoe ride", "Tharu Stick Dance performance", "Sarangkot sunrise over the Annapurna range", "Phewa Lake cruise", "Farewell dinner with live Nepali music & dance"],
    includes: ["Hotel accommodation throughout (7 nights)", "Private vehicle for all road transfers", "Expert English-speaking guide", "All park permits & monument entry fees", "Daily breakfast; select lunches & dinners"],
    weather: "10°C to 28°C",
    itinerary: [
      {
        day: 1, title: "Arrival Kathmandu · Welcome by Dhaka Scarf", meta: "Altitude 1,400m · Check-in 14:00",
        description: "Met at the airport by our representative and welcomed with a traditional handwoven Dhaka scarf, then transferred to your hotel. In the afternoon, visit Boudhanath Stupa — one of the largest stupas in the world and a major centre of Tibetan Buddhism — with its prayer wheels, resident monks, and lively surrounding neighbourhood of monasteries and shops. Overnight in Kathmandu.",
        optional: "Thangka painting session with a master artist — $40 pp",
      },
      {
        day: 2, title: "Swayambhunath · Patan Durbar Square · Kathmandu Durbar Square", meta: "Altitude 1,350–1,400m",
        description: "A full day across three of the Kathmandu Valley's UNESCO World Heritage sites. Climb the 365 steps to Swayambhunath ('Monkey Temple') for sweeping valley views, explore the Malla-era wood carvings of Patan Durbar Square, then visit Kathmandu Durbar Square (Hanuman Dhoka) with its palaces, temples, and the house of the Kumari, the living goddess. Overnight in Kathmandu.",
        optional: "Early-morning mountain flight past 20 Himalayan peaks including Everest — $280–290 pp · Sound healing therapy by singing bowl in Patan — $30 pp",
      },
      {
        day: 3, title: "Drive to Chitwan · Tharu Village Walk", meta: "Drive 5–6 hrs / 175 km · Altitude 150m",
        description: "A scenic drive south through river valleys and farmland to the subtropical lowlands of Chitwan National Park. In the afternoon, a guided walk through a traditional Tharu village to see mud-and-thatch houses and local customs, followed by an evening naturalist briefing on the park's wildlife ahead of tomorrow's safari. Overnight in Chitwan.",
        optional: "White-water rafting on the Trishuli River en route — $35 pp",
      },
      {
        day: 4, title: "Jeep Safari · Canoe Ride · Tharu Stick Dance", meta: "Jeep Safari · Canoe Ride · Cultural Show",
        description: "A morning jeep safari through Chitwan National Park in search of one-horned rhinos, wild elephants, deer, and birdlife, followed by a visit to the Crocodile or Elephant Breeding Centre. In the afternoon, a peaceful canoe ride along the Rapti River, and in the evening a traditional Tharu Stick Dance performance in the village. Overnight in Chitwan.",
      },
      {
        day: 5, title: "Drive to Pokhara · Bandipur Bazaar", meta: "Drive 4–5 hrs / 165 km · Altitude 827m",
        description: "Drive west to Pokhara, Nepal's lake city set beneath the Annapurna range. Check in and spend the rest of the day at leisure, or stroll the lakeside market at Phewa Lake. Overnight in Pokhara.",
        optional: "Cable-car detour to the preserved Newari hill town of Bandipur en route",
      },
      {
        day: 6, title: "Sarangkot Sunrise · World Peace Stupa · Phewa Lake Cruise", meta: "Altitude 827–1,592m",
        description: "An early rise for sunrise over the Annapurna range from Sarangkot, then a visit to the World Peace Stupa above Phewa Lake for panoramic mountain views, followed by an early-evening cruise on the lake itself. Afternoon visit to the Tibetan Resettlement Camp and Gupteshwor Cave. Overnight in Pokhara.",
        optional: "Sarangkot–Naudanda downhill hike, 3.5 hrs — $35–60 pp · Guided visits to the Gorkha Memorial, International Mountain, and Annapurna Butterfly museums — $50–70 pp",
      },
      {
        day: 7, title: "Return to Kathmandu · Farewell Dinner", meta: "Drive 6–7 hrs / 210 km · Altitude 1,400m",
        description: "Drive back to Kathmandu, with the rest of the day free at leisure. In the evening, a farewell dinner of traditional Nepali cuisine with live music and dance at a beautifully restored 150-year-old heritage building in the city. Overnight in Kathmandu.",
        optional: "25-minute scenic flight Pokhara–Kathmandu in lieu of the road journey — $120 pp",
      },
      {
        day: 8, title: "Departure", meta: "",
        description: "Breakfast at the hotel, then transfer to the airport for your onward flight home — carrying memories of ancient stupas, jungle sunsets, and Himalayan lakes.",
      },
    ] as ItineraryDay[],
    gallery: [
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585511543313-63d569fb4c40?q=80&w=1000&auto=format&fit=crop",
    ],
    mostDemanded: true,
  },
  {
    id: 10, trek_route: "/trekking/short-duration-treks",
    title: "Poon Hill Sunrise Trek", duration: "5 Days", price: 380,
    tag: "Best for First-Timers",
    description: "Nepal's most celebrated short trek — sunrise over the Annapurna and Dhaulagiri ranges from Poon Hill (3,210m) through forests of blooming rhododendron.",
    longDescription: "Perfect for first-time trekkers, the Poon Hill trek delivers a world-class Himalayan experience in 5 days. Climb through Gurung villages and rhododendron forests to Poon Hill (3,210m) for a sunrise over the Annapurna and Dhaulagiri ranges.",
    image: "https://images.pexels.com/photos/11388549/pexels-photo-11388549.jpeg?_gl=1*tnbken*_ga*NzUzNzAyNzIyLjE3ODUzOTUxOTU.*_ga_8JE65Q40S6*czE3ODU4MjM5NDIkbzMkZzEkdDE3ODU4MjQyNTEkajM3JGwwJGgw",
    difficulty: "Easy", maxAltitude: "3,210m", type: "trekking",
    bestSeason: "All Year (best Oct–May)", rating: 4.6, reviews: 421, groupSize: "2–20", startPoint: "Nayapul",
    highlights: ["Poon Hill 3,210m sunrise viewpoint", "Rhododendron forests in full bloom", "Gurung & Magar village homestays", "Annapurna South & Dhaulagiri panorama"],
    includes: ["Teahouse accommodation", "Licensed guide", "ACAP conservation permit", "Transport Pokhara–Nayapul"],
    weather: "5°C to 20°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 11, trek_route: null,
    title: "Rara Lake Expedition", duration: "10 Days", price: 1200,
    tag: "Off the Beaten Path",
    description: "Nepal's largest and remotest lake — a sapphire jewel at 2,990m in Rara National Park, in the barely-visited far-western Himalayas.",
    longDescription: "Hidden in the far-west of Nepal, Rara Lake is a pristine sapphire jewel set at 2,990m in Rara National Park. Untouched wilderness, ancient villages, dense Himalayan forests, and skies so clear the Milky Way is blinding.",
    image: "https://images.unsplash.com/photo-1632705559818-9507ce18ae9d?q=80&w=929&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    difficulty: "Moderate", maxAltitude: "3,700m", type: "trekking",
    bestSeason: "Apr–Jun, Sep–Nov", rating: 4.8, reviews: 43, groupSize: "2–8", startPoint: "Nepalgunj",
    highlights: ["Rara Lake — Nepal's largest lake", "Rara National Park wildlife", "Far-west Himalayan villages", "Remote wilderness camping"],
    includes: ["Camping & lodge accommodation", "Expert guide & cook", "All permits", "Kathmandu–Nepalgunj flights"],
    weather: "−5°C to 15°C",
    itinerary: [] as ItineraryDay[],
    gallery: [] as string[],
    mostDemanded: false,
  },
  {
    id: 12, trek_route: null,
    title: "Odyssey in Himalayas: Heritage, Wildlife, Lakes & Himalayan Trails", duration: "12 Days", price: 1950,
    tag: "Signature Odyssey",
    description: "Nepal's grand tour in one seamless journey — Kathmandu Valley's UNESCO heritage, a Chitwan jungle safari, Bandipur's hilltop bazaar, and the Mardi Himal trek to 4,500m, finished with a farewell tasting menu at Dwarika's Krishnarpan.",
    longDescription: "Eleven nights, twelve days, and every face of Nepal in between: ancient Kathmandu Valley temples and living heritage, a Chitwan jungle safari among rhinos and Bengal tigers, the hilltop Newari bazaar of Bandipur, and an off-the-beaten-path trek through rhododendron forest to Mardi Himal Base Camp at 4,500m — before returning to Kathmandu for a Bhaktapur pottery lesson and a six-course farewell dinner at Dwarika's signature restaurant, Krishnarpan.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1400&auto=format&fit=crop",
    difficulty: "Moderate", maxAltitude: "4,500m", type: "trekking",
    bestSeason: "Mar–May, Sep–Nov", rating: 4.9, reviews: 27, groupSize: "2–12", startPoint: "Kathmandu",
    highlights: ["Boudhanath Stupa welcome & Hi Tea ceremony", "Kathmandu, Patan & Bhaktapur Durbar Squares", "Chitwan jungle safari & canoe ride", "Bandipur hilltop bazaar by cable car", "Mardi Himal trek to Base Camp (4,500m)", "Farewell six-course dinner at Dwarika's Krishnarpan"],
    includes: ["Hotel & teahouse accommodation throughout (11 nights)", "Private vehicle for all road transfers", "Expert English-speaking guide & trekking crew", "All park permits & monument entry fees", "Daily breakfast; select lunches & dinners incl. farewell dinner"],
    weather: "0°C to 20°C",
    gallery: [
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1000&auto=format&fit=crop",
      "https://heritagejourneynepal.com/images/trekking/abc/abc-5.jpg",
      "https://images.unsplash.com/photo-1585511543313-63d569fb4c40?q=80&w=1000&auto=format&fit=crop",
    ],
    itinerary: [
      {
        day: 1, title: "Arrival Kathmandu · Welcome by Dhaka Scarf", meta: "Altitude 1,400m · Check-in 14:00",
        description: "Met at the airport by our representative and welcomed with a traditional handwoven Dhaka scarf, then transferred to your hotel. In the afternoon (subject to arrival time), visit Boudhanath Stupa — possibly the world's largest Buddhist stupa and a major centre of Tibetan Buddhism — with the option to join a Hi Tea Buddhist ceremony in a nearby monastery, where monks chant mantras and offer blessings for good health. Overnight in Kathmandu.",
        optional: "Thangka painting session with a master artist — $40 pp",
      },
      {
        day: 2, title: "Swayambhunath · Patan Durbar Square · Kathmandu Durbar Square", meta: "Altitude 1,350–1,400m",
        description: "A full day across three of the Kathmandu Valley's UNESCO World Heritage sites. Climb the 365 steps to Swayambhunath ('Monkey Temple') for sweeping valley views, explore the Malla-era wood carvings and museums of Patan Durbar Square, then visit Kathmandu Durbar Square (Hanuman Dhoka) with its palaces, temples, and the house of the Kumari, the living goddess. Overnight in Kathmandu.",
        optional: "Early-morning mountain flight past 20 Himalayan peaks including Everest — $280–290 pp · Sound healing therapy by singing bowl in Patan — $30 pp",
      },
      {
        day: 3, title: "Drive to Chitwan · Tharu Village Walk", meta: "Drive 5–6 hrs / 175 km · Altitude 150m",
        description: "A scenic drive south through river valleys and farmland to the subtropical lowlands of Chitwan National Park. In the afternoon, a guided walk through a traditional Tharu village to see mud-and-thatch houses and local customs, followed by an evening naturalist briefing on the park's wildlife and conservation efforts. Dinner poolside for two with a bottle of wine. Overnight in Chitwan.",
        optional: "White-water rafting on the Trishuli River en route (~12km, 2.5 hrs) — $35 pp",
      },
      {
        day: 4, title: "Jeep Safari · Canoe Ride · Tharu Stick Dance", meta: "Jeep Safari · Canoe Ride · Cultural Show",
        description: "A morning jeep safari through Chitwan National Park in search of one-horned rhinos, wild elephants, deer, and birdlife, followed by a visit to the Crocodile Breeding Centre or Elephant Breeding Centre (location depends on lodge). In the afternoon, a peaceful canoe ride along the Rapti River, and in the evening a traditional Tharu Stick Dance performance in the village. Overnight in Chitwan.",
      },
      {
        day: 5, title: "Drive to Pokhara via Bandipur · Trek to Australian Camp", meta: "Drive ~175 km / 6 hrs · Trek to 2,065m",
        description: "Drive toward Pokhara with a cable-car excursion up to Bandipur, a preserved Newari hill town, for lunch and a stroll through its old bazaar. Continue on to Kande, where the trek begins with an hour-plus climb through cool forest shade to Thulo Kharka — better known as Australian Camp — with wide views across the Annapurna and Manaslu ranges. Overnight in a teahouse at Australian Camp.",
      },
      {
        day: 6, title: "Trek Australian Camp to Low Camp", meta: "Altitude 2,990m · 6–7 hrs",
        description: "Hike down to Pothana and Deurali, then head north along a forested ridgeline with panoramic views of Annapurna I and South, Huinchuli, Annapurna IV–II, and Lamjung Himal. The trail passes through rhododendron forest before reaching the overnight stop at Low Camp, tucked in the middle of the forest. Overnight in a teahouse at Low Camp.",
      },
      {
        day: 7, title: "Trek Low Camp to High Camp", meta: "Altitude 3,550m · 6–7 hrs",
        description: "Trek uphill along a ridge toward Mardi Himal and Machhapuchhre as the tree line thins into scattered rhododendron bushes and shrub. Keep an eye out for the Danphe pheasant, Nepal's national bird, along the way. High Camp is the day's final destination, with stunning close-range mountain views. Overnight in a teahouse at High Camp.",
      },
      {
        day: 8, title: "Mardi Himal Base Camp · Descend to Siding Village", meta: "Altitude 4,500m · ~7 hrs",
        description: "A steep, thinning-air climb higher above High Camp rewards you with a grand vista of snow-clad Annapurna peaks in perfect tranquility, as the tree line fades to short rhododendron and juniper. From here, descend back down through warmer terrain to Siding Village. Overnight in Siding Village.",
      },
      {
        day: 9, title: "Drive to Pokhara · Boating on Phewa Lake", meta: "~4 hrs by local sharing jeep",
        description: "The trail follows the Mardi River through a wide valley of rice-paddy farm villages before ending at Mardi village for a short drive back to Pokhara. Round off the trek with an evening of boating on Phewa Lake. Overnight in Pokhara.",
      },
      {
        day: 10, title: "Return to Kathmandu", meta: "Drive 6–7 hrs / 210 km · Altitude 1,400m",
        description: "Breakfast at the hotel, then drive back to Kathmandu, with the rest of the day free at leisure. Overnight in Kathmandu.",
        optional: "25-minute scenic flight Pokhara–Kathmandu in lieu of the road journey — $120 pp",
      },
      {
        day: 11, title: "Bhaktapur Sightseeing · Farewell Dinner", meta: "Drive ~30 min · UNESCO Durbar Square",
        description: "Visit the medieval city of Bhaktapur, its Durbar Square anchored by the Lions' Gate, the Golden Gate, and the Palace of Fifty-Five Windows, plus a short pottery-making session at Pottery Square and a visit to Nyatapola, the tallest temple in the Kathmandu Valley. Return to Kathmandu for a six-course farewell dinner at Krishnarpan, Dwarika's signature slow-dining restaurant celebrating Nepal's traditional cuisine. Overnight in Kathmandu.",
      },
      {
        day: 12, title: "Departure", meta: "",
        description: "Breakfast at the hotel, then transfer to the airport for your onward flight home — carrying memories of ancient stupas, jungle safaris, Himalayan trails, and lakeside sunsets.",
      },
    ] as ItineraryDay[],
    mostDemanded: true,
  },
];

const TYPE_LABEL: Record<string, string> = {
  trekking: "Trekking", cultural: "Cultural", adventure: "Adventure", wildlife: "Wildlife",
};

// Fixed display order + short blurb for each section header in the grid
const TYPE_ORDER: string[] = ["trekking", "cultural", "adventure", "wildlife"];
const TYPE_SECTION_COPY: Record<string, string> = {
  trekking: "Multi-day treks into the high Himalaya",
  cultural: "Heritage cities, temples & living tradition",
  adventure: "Paragliding, kayaking & adrenaline in Pokhara",
  wildlife: "Jungle safaris in Nepal's lowland national parks",
};

type Tour = typeof tours[0];

const Difficulty = ({ level, className = '' }: { level: string; className?: string }) => (
  <span className={`text-xs font-medium ${className}`}>{level}</span>
);

// ─── Animated Day-by-Day Itinerary (full-page version) ────────────────────────

const AnimatedItinerary = ({ days }: { days: ItineraryDay[] }) => {
  const [visible, setVisible] = useState<number[]>([]);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const o = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(prev => (prev.includes(i) ? prev : [...prev, i])), i * 60);
          }
        },
        { threshold: 0.15 }
      );
      o.observe(el);
      return o;
    });
    return () => observers.forEach(o => o && o.disconnect());
  }, [days]);

  return (
    <div className="relative pl-10 sm:pl-14">
      <div className="absolute left-4 sm:left-6 top-2 bottom-2 w-px bg-[#0c1626]/20" />
      {days.map((d, i) => {
        const open = openDay === d.day;
        const vis = visible.includes(i);
        return (
          <div
            key={d.day}
            ref={el => { refs.current[i] = el; }}
            className="relative mb-4"
            style={{
              opacity: vis ? 1 : 0,
              transform: vis ? 'translateX(0)' : 'translateX(-16px)',
              transition: `opacity 0.5s ease ${i * 0.03}s, transform 0.5s ease ${i * 0.03}s`,
            }}
          >
            <div style={H} className={`absolute -left-10 sm:-left-14 top-1 w-8 h-8 flex items-center justify-center text-sm font-semibold border transition-colors
              ${open ? 'bg-[#0c1626] border-[#0c1626] text-[#f3f6f9]' : 'bg-white border-[#0c1626]/30 text-[#0c1626]'}`}>
              {d.day}
            </div>
            <button
              onClick={() => setOpenDay(open ? null : d.day)}
              className={`w-full text-left border transition-colors overflow-hidden bg-white
                ${open ? 'border-[#0c1626]' : 'border-[#0c1626]/15 hover:border-[#0c1626]/40'}`}
            >
              <div className="flex items-start justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#0c1626]/60 mb-1">Day {d.day}</p>
                  <h4 style={H} className="text-base sm:text-lg font-semibold text-[#0c1626] leading-snug">{d.title}</h4>
                  {d.meta && <p className="text-xs text-[#0c1626]/60 mt-1">{d.meta}</p>}
                </div>
                <ChevronDown size={18} className={`shrink-0 mt-1 text-[#0c1626]/50 transition-transform ${open ? 'rotate-180 text-[#0c1626]' : ''}`} />
              </div>
              <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                <div className="overflow-hidden">
                  <div className="px-5 pb-5">
                    <p className="text-[15px] text-[#0c1626]/80 leading-relaxed mb-3">{d.description}</p>
                    {d.optional && (
                      <p className="text-xs text-[#0c1626]/80 bg-[#f3f6f9] border border-[#0c1626]/15 px-3 py-2 leading-relaxed">
                        <strong className="font-semibold">Optional:</strong> {d.optional}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};

// ─── Inquire Form ─────────────────────────────────────────────────────────────

const INPUT_CLASS = "w-full bg-white border border-[#0c1626]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#0c1626] focus:outline-none focus:border-[#f5a81c] transition";
const LABEL_CLASS = "block text-xs font-semibold text-[#0c1626]/70 mb-1.5";

const InquireForm = ({ tour, onBack }: { tour: Tour; onBack: () => void }) => {
  const [form, setForm] = useState({ name: '', email: '', date: '', group: '2', message: '' });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center max-w-lg mx-auto">
      <h3 style={H} className="text-xl font-semibold text-[#0c1626] mb-2">Enquiry received</h3>
      <p className="text-[#0c1626]/70 text-[15px] leading-relaxed">
        Thank you, <strong>{form.name}</strong>. Our team will contact you at <strong>{form.email}</strong> within 24 hours about the {tour.title}.
      </p>
      <button onClick={onBack} className="mt-8 text-sm text-[#0c1626] font-semibold hover:opacity-70 transition-opacity">
        Back to tour details
      </button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto py-8 pt-20">
      <button onClick={onBack} className="text-xs text-[#0c1626]/60 hover:text-[#0c1626] mb-6 flex items-center gap-1 transition">
        <ArrowLeft size={13}/> Back to details
      </button>
      <h3 style={H} className="text-2xl font-semibold text-[#0c1626] mb-1">Send an enquiry</h3>
      <p className="text-sm text-[#0c1626]/60 mb-7">
        {tour.title} &nbsp;·&nbsp; from{' '}
        <span style={H} className="font-semibold text-[#0c1626]">${tour.price.toLocaleString()}</span> per person
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Full name *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Your name" className={INPUT_CLASS}/>
          </div>
          <div>
            <label className={LABEL_CLASS}>Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              placeholder="you@email.com" className={INPUT_CLASS}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Preferred date</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              className={INPUT_CLASS}/>
          </div>
          <div>
            <label className={LABEL_CLASS}>Group size</label>
            <select value={form.group} onChange={e => setForm({...form, group: e.target.value})}
              className={INPUT_CLASS}>
              {['1','2','3','4','5','6','7','8','9','10+'].map(n => (
                <option key={n} value={n}>{n} {n==='1'?'person':'people'}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={LABEL_CLASS}>Message</label>
          <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
            placeholder="Fitness level, special requirements, questions…"
            className={`${INPUT_CLASS} resize-none`}/>
        </div>
        <button
          onClick={() => { if (form.name && form.email) setSubmitted(true); }}
          disabled={!form.name || !form.email}
          className="w-full bg-[#f5a81c] hover:bg-[#ffb92e] disabled:opacity-40 disabled:cursor-not-allowed text-[#0c1626] font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
          Send enquiry
        </button>
      </div>
    </div>
  );
};

// ─── Full-Screen Tour Overlay (no route change — same URL) ────────────────────

const TourDetailOverlay = ({ tour, onClose }: { tour: Tour; onClose: () => void }) => {
  const navigate = useNavigate();
  const [view, setView] = useState<'detail'|'inquire'>('detail');

  // Let the browser Back button close the overlay instead of leaving /tours
  useEffect(() => {
    window.history.pushState({ tourOverlay: true }, '');
    const onPop = () => onClose();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    if (window.history.state?.tourOverlay) window.history.back();
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f3f6f9] overflow-y-auto" style={{ fontFamily: BODY_FONT }}>
      {/* Floating nav */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-5 sm:px-8 py-4 pointer-events-none">
        <button onClick={handleClose}
          className="pointer-events-auto flex items-center gap-1.5 bg-[#0c1626]/80 hover:bg-[#0c1626] text-[#f3f6f9] text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <ArrowLeft size={14}/> Back to tours
        </button>
        <button onClick={handleClose} aria-label="Close"
          className="pointer-events-auto bg-[#0c1626]/80 hover:bg-[#0c1626] text-[#f3f6f9] rounded-lg p-2.5 transition-colors">
          <X size={16}/>
        </button>
      </div>

      {view === 'inquire' ? (
        <div className="px-6">
          <InquireForm tour={tour} onBack={() => setView('detail')} />
        </div>
      ) : (
        <>
          {/* HERO */}
          <div className="relative w-full" style={{ height: '52vh', minHeight: 360, maxHeight: 560 }}>
            <img src={tour.image} alt={tour.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=80&w=1400&auto=format&fit=crop'; }}/>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,22,38,0.88) 0%, rgba(12,22,38,0.3) 55%, rgba(12,22,38,0.2) 100%)' }}/>
            <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-8 max-w-4xl mx-auto w-full">
              <div className="flex items-center gap-4 mb-2 text-[#f3f6f9]">
                <Difficulty level={tour.difficulty} />
                <span className="text-[#f3f6f9]/70 text-xs">{TYPE_LABEL[tour.type]}</span>
              </div>
              <h1 style={{ ...H, letterSpacing: '-0.03em' }} className="text-3xl sm:text-4xl font-semibold text-[#f3f6f9] leading-tight mb-2">{tour.title}</h1>
            </div>
          </div>

          {/* FACTS BAND */}
          <div className="border-b border-[#0c1626]/15 bg-white">
            <div className="max-w-4xl mx-auto grid grid-cols-4 divide-x divide-[#0c1626]/15">
              {[
                { label: 'Duration', value: tour.duration },
                { label: 'Max altitude', value: tour.maxAltitude },
                { label: 'Group size', value: tour.groupSize },
                { label: 'Departs from', value: tour.startPoint.split('/')[0].trim() },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center py-5 px-2 text-center">
                  <div className="text-[11px] text-[#0c1626]/60 mb-0.5">{s.label}</div>
                  <div style={H} className="text-sm font-semibold text-[#0c1626]">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 pb-32">
            <p className="text-[#0c1626]/80 text-[17px] leading-relaxed mb-12 max-w-2xl">{tour.longDescription}</p>

            {tour.gallery.length > 0 && (
              <div className="mb-14">
                <h3 style={H} className="text-xl font-semibold text-[#0c1626] mb-4">Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {tour.gallery.map((src, i) => (
                    <div key={i} className="aspect-[4/5] overflow-hidden bg-[#0c1626]/10">
                      <img src={src} alt={`${tour.title} ${i + 1}`} className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tour.itinerary.length > 0 && (
              <div className="mb-14">
                <p className="text-sm text-[#0c1626]/60 mb-1">Day-by-day itinerary</p>
                <h2 style={H} className="text-2xl font-semibold text-[#0c1626] mb-6">{tour.itinerary.length}-Day Programme</h2>
                <AnimatedItinerary days={tour.itinerary} />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div>
                <h4 style={H} className="text-lg font-semibold text-[#0c1626] mb-3">Highlights</h4>
                <ul className="space-y-2.5">
                  {tour.highlights.map(h => (
                    <li key={h} className="flex items-start gap-2 text-[15px] text-[#0c1626]/85">
                      <span className="mt-2 w-1.5 h-1.5 bg-[#0c1626] shrink-0" aria-hidden="true"/> {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={H} className="text-lg font-semibold text-[#0c1626] mb-3">What's included</h4>
                <ul className="space-y-2.5">
                  {tour.includes.map(inc => (
                    <li key={inc} className="flex items-start gap-2 text-[15px] text-[#0c1626]/85">
                      <span className="mt-2 w-1.5 h-1.5 bg-[#0c1626] shrink-0" aria-hidden="true"/> {inc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#0c1626]/70 bg-white border border-[#0c1626]/15 px-5 py-4">
              <span><strong className="text-[#0c1626]">Best season:</strong> {tour.bestSeason}</span>
              <span className="text-[#0c1626]/25 hidden sm:inline">|</span>
              <span><strong className="text-[#0c1626]">Temperature:</strong> {tour.weather}</span>
            </div>
          </div>

          {/* STICKY BOOKING BAR */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#0c1626]/15 z-10">
            <div className="max-w-4xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#0c1626]/60 leading-none mb-1">Starting from</p>
                <p style={H} className="text-2xl font-semibold text-[#0c1626] leading-none">
                  ${tour.price.toLocaleString()}
                  <span className="text-xs font-normal text-[#0c1626]/60 ml-1" style={{ fontFamily: BODY_FONT }}>/ person</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setView('inquire')}
                  className="border-2 border-[#0c1626] text-[#0c1626] hover:bg-[#0c1626] hover:text-[#f3f6f9] px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  Enquire now
                </button>
                {tour.trek_route && (
                  <button onClick={() => { onClose(); navigate(tour.trek_route!); }}
                    className="bg-[#f5a81c] hover:bg-[#ffb92e] text-[#0c1626] px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors">
                    Full itinerary
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Tour Card (grid item) ─────────────────────────────────────────────────────
// Extracted so the same card markup can be reused per type-section below.

const TourCard = ({ tour, onSelect, onNavigate }: { tour: Tour; onSelect: () => void; onNavigate: (route: string) => void }) => {
  return (
    <div
      className="group bg-white border border-[#0c1626]/15 hover:border-[#0c1626]/40 overflow-hidden cursor-pointer transition-colors"
      onClick={onSelect}>
      <div className="relative overflow-hidden" style={{ height: 185 }}>
        <img src={tour.image} alt={tour.title}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=80&w=800&auto=format&fit=crop'; }}/>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,22,38,0.5) 0%, transparent 55%)' }}/>
      </div>
      <div className="p-4">
        <p className="text-xs text-[#0c1626]/60 mb-1">{TYPE_LABEL[tour.type]}</p>
        <h3 style={H} className="font-semibold text-[#0c1626] text-base leading-snug mb-2 line-clamp-2">{tour.title}</h3>
        <p className="text-xs text-[#0c1626]/65 mb-4">
          {tour.duration} · {tour.maxAltitude} · {tour.difficulty}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-[#0c1626]/15">
          <div>
            <span style={H} className="text-lg font-semibold text-[#0c1626]">${tour.price.toLocaleString()}</span>
            <span className="text-[#0c1626]/60 text-xs ml-1">/ person</span>
          </div>
          <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
            <button onClick={onSelect}
              className="border border-[#0c1626]/25 text-[#0c1626] hover:border-[#0c1626] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
              Details
            </button>
            {tour.trek_route && (
              <button onClick={() => onNavigate(tour.trek_route!)}
                className="bg-[#f5a81c] hover:bg-[#ffb92e] text-[#0c1626] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                Itinerary
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Tours() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3500);
  const [tourType, setTourType] = useState('all');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setHeroLoaded(true), 80); }, []);

  // Deep-link support: /tours?tour=9 opens that tour's detail overlay directly,
  // so links from elsewhere on the site (e.g. the homepage Hero) can jump
  // straight into a specific tour instead of just landing on the grid.
  useEffect(() => {
    const tourId = searchParams.get('tour');
    if (tourId) {
      const found = tours.find(t => t.id === parseInt(tourId, 10));
      if (found) setSelectedTour(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseTour = () => {
    setSelectedTour(null);
    if (searchParams.get('tour')) {
      const next = new URLSearchParams(searchParams);
      next.delete('tour');
      setSearchParams(next, { replace: true });
    }
  };

  const filtered = tours.filter(t => {
    const s = searchTerm.toLowerCase();
    if (s && !t.title.toLowerCase().includes(s) && !t.description.toLowerCase().includes(s)) return false;
    if (tourType !== 'all' && t.type !== tourType) return false;
    if (t.price > maxPrice) return false;
    const days = parseInt(t.duration);
    if (selectedDuration === 'short' && days > 7) return false;
    if (selectedDuration === 'medium' && (days <= 7 || days > 12)) return false;
    if (selectedDuration === 'long' && days <= 12) return false;
    return true;
  });

  // "Most in Demand" tours get pulled out into their own section up top,
  // so they're not left buried inside (or duplicated with) their type group.
  const demanded = filtered.filter(t => t.mostDemanded);

  // Group the rest into sections by type so trekking/cultural/adventure/wildlife
  // don't interleave. When a single type is already selected via the filter
  // pills, there's only one group, so the section header is skipped.
  const groups = TYPE_ORDER
    .map(type => ({ type, items: filtered.filter(t => t.type === type && !t.mostDemanded) }))
    .filter(g => g.items.length > 0);

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Hind:wght@400;500;600&display=swap');
      `}</style>
      <div className="bg-[#f3f6f9] min-h-screen text-[#0c1626]" style={{ fontFamily: BODY_FONT }}>
        {selectedTour && <TourDetailOverlay tour={selectedTour} onClose={handleCloseTour} />}

        {/* HERO */}
        <div className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: 620, maxHeight: 900 }}>
          <img
            src="https://images.pexels.com/photos/14117079/pexels-photo-14117079.jpeg?_gl=1*b1786x*_ga*NzUzNzAyNzIyLjE3ODUzOTUxOTU.*_ga_8JE65Q40S6*czE3ODU4MjM5NDIkbzMkZzEkdDE3ODU4MjQxNDQkajU5JGwwJGgw"
            alt="Himalayan peaks"
            onError={e => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/14117079/pexels-photo-14117079.jpeg?_gl=1*b1786x*_ga*NzUzNzAyNzIyLjE3ODUzOTUxOTU.*_ga_8JE65Q40S6*czE3ODU4MjM5NDIkbzMkZzEkdDE3ODU4MjQxNDQkajU5JGwwJGgw'; }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 30%', transition: 'opacity 0.8s', opacity: heroLoaded ? 1 : 0 }}
          />
          {/* Same night-indigo overlays as the home hero */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(12,22,38,0.8), rgba(12,22,38,0.4) 55%, rgba(12,22,38,0.15))'
          }}/>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(12,22,38,0.8), transparent 50%, rgba(12,22,38,0.25))'
          }}/>
          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-7xl mx-auto px-6 pb-0">
              <p className="text-[#f3f6f9] text-[15px] font-medium mb-5">
                Nepal expedition specialists
              </p>
              <h1 style={{ fontFamily: HEADING_FONT, fontSize: 'clamp(2.6rem, 6vw, 5rem)', fontWeight: 600, color: '#f3f6f9', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem', textShadow: '0 2px 24px rgba(12,22,38,0.5)' }}>
                Himalayan Journeys,<br/>
                Crafted for You.
              </h1>
              <p className="text-[17px] sm:text-lg max-w-lg mb-8 leading-relaxed" style={{ color: 'rgba(243,246,249,0.86)' }}>
                From Everest Base Camp to the forbidden Kingdom of Lo — hand-picked treks, cultural tours and wildlife safaris with expert guides.
              </p>
              <div className="bg-[#f3f6f9] rounded-lg p-1.5 flex flex-col sm:flex-row gap-2 max-w-3xl mb-0">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={17}/>
                  <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search destinations, activities…" aria-label="Search tours"
                    className="w-full pl-11 pr-4 py-3 text-base text-[#0c1626] placeholder-slate-500 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a81c] rounded-md"/>
                </div>
                <div className="hidden sm:block w-px bg-[#0c1626]/15 my-2"/>
                <div className="relative">
                  <select value={tourType} onChange={e => setTourType(e.target.value)} aria-label="Tour type"
                    className="appearance-none bg-transparent pl-4 pr-8 py-3 text-[15px] text-[#0c1626] focus:outline-none cursor-pointer rounded-md">
                    <option value="all">All types</option>
                    <option value="trekking">Trekking</option>
                    <option value="cultural">Cultural</option>
                    <option value="adventure">Adventure</option>
                    <option value="wildlife">Wildlife</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
                </div>
                <div className="hidden sm:block w-px bg-[#0c1626]/15 my-2"/>
                <div className="relative">
                  <select value={selectedDuration} onChange={e => setSelectedDuration(e.target.value)} aria-label="Duration"
                    className="appearance-none bg-transparent pl-4 pr-8 py-3 text-[15px] text-[#0c1626] focus:outline-none cursor-pointer rounded-md">
                    <option value="all">Any duration</option>
                    <option value="short">Up to 7 days</option>
                    <option value="medium">8–12 days</option>
                    <option value="long">13+ days</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
                </div>
                <button
                  className="bg-[#f5a81c] hover:bg-[#ffb92e] text-[#0c1626] px-6 py-3 rounded-md text-[15px] font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  onClick={() => { const el = document.getElementById('tour-grid'); el?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Find tours
                </button>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-4 gap-0 mt-8 overflow-hidden">
                {[
                  { n: '800+', label: 'Happy travellers' },
                  { n: '15+', label: 'Years in Nepal' },
                  { n: '98%', label: 'Satisfaction rate' },
                  { n: '24/7', label: 'On-trail support' },
                ].map(s => (
                  <div key={s.label} className="text-center py-5 px-4 border-r border-[#0c1626]/15 last:border-0 bg-[#f3f6f9]">
                    <div style={H} className="text-2xl font-semibold text-[#0c1626] leading-none">{s.n}</div>
                    <div className="text-[#0c1626]/60 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED */}
        <div className="bg-white border-b border-[#0c1626]/15">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-6">
              <p className="text-sm text-[#0c1626]/60 mb-1">Handpicked journeys</p>
              <h2 style={H} className="text-3xl font-semibold text-[#0c1626]">Signature Expeditions</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {tours.filter(t => [1, 2, 9].includes(t.id)).map(tour => (
                <div key={tour.id} onClick={() => setSelectedTour(tour)}
                  className="group relative overflow-hidden cursor-pointer" style={{ height: 320 }}>
                  <img src={tour.image} alt={tour.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=80&w=800&auto=format&fit=crop'; }}/>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,22,38,0.88) 0%, transparent 55%)' }}/>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="text-[#f3f6f9]/75 text-sm mb-1">{tour.duration} &nbsp;·&nbsp; {tour.maxAltitude}</div>
                    <h3 style={H} className="text-[#f3f6f9] font-semibold text-xl leading-snug">{tour.title}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span style={H} className="text-[#f3f6f9] font-semibold text-xl">${tour.price.toLocaleString()}</span>
                      <span className="text-[#f3f6f9]/70 text-sm">per person</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-[#f3f6f9] border-b border-[#0c1626]/15 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-[#0c1626]/70">Budget</span>
            <input type="range" min={380} max={4500} step={50} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum budget"
              className="w-40 accent-[#0c1626]"/>
            <span style={H} className="text-sm font-semibold text-[#0c1626]">Up to ${maxPrice.toLocaleString()}</span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {Object.entries({ all: 'All', trekking: 'Trekking', cultural: 'Cultural', adventure: 'Adventure', wildlife: 'Wildlife' }).map(([k, v]) => (
                <button key={k} onClick={() => setTourType(k)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${tourType === k ? 'bg-[#0c1626] text-[#f3f6f9]' : 'bg-white border border-[#0c1626]/20 text-[#0c1626]/75 hover:border-[#0c1626]'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TOUR GRID — grouped into sections by type */}
        <div id="tour-grid" className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 style={H} className="text-2xl font-semibold text-[#0c1626]">
              {filtered.length} {filtered.length === 1 ? 'tour' : 'tours'} available
            </h2>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-sm text-[#0c1626] font-semibold hover:opacity-70 transition-opacity">
                Clear search
              </button>
            )}
          </div>
          {groups.length === 0 && demanded.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#0c1626]/25">
              <p style={H} className="text-lg font-semibold text-[#0c1626]/60 mb-3">No tours match your filters</p>
              <button onClick={() => { setSearchTerm(''); setTourType('all'); setSelectedDuration('all'); setMaxPrice(3500); }}
                className="text-sm text-[#0c1626] font-semibold hover:opacity-70 transition-opacity">Reset all filters</button>
            </div>
          ) : (
            <div className="space-y-12">
              {demanded.length > 0 && (
                <div className="bg-white border border-[#0c1626]/15 p-6 sm:p-7">
                  <div className="flex items-baseline justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 style={H} className="text-xl font-semibold text-[#0c1626]">Most in Demand</h3>
                        <p className="text-sm text-[#0c1626]/65 mt-0.5">Our best-selling journeys, booked most often by travellers</p>
                      </div>
                    </div>
                    <span className="text-sm text-[#0c1626]/65">
                      {demanded.length} {demanded.length === 1 ? 'tour' : 'tours'}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {demanded.map(tour => (
                      <TourCard key={tour.id} tour={tour} onSelect={() => setSelectedTour(tour)} onNavigate={route => navigate(route)} />
                    ))}
                  </div>
                </div>
              )}
              {groups.map(group => (
                <div key={group.type}>
                  {groups.length > 1 && (
                    <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-[#0c1626]/15">
                      <div>
                        <h3 style={H} className="text-xl font-semibold text-[#0c1626]">{TYPE_LABEL[group.type]}</h3>
                        <p className="text-sm text-[#0c1626]/65 mt-0.5">{TYPE_SECTION_COPY[group.type]}</p>
                      </div>
                      <span className="text-sm text-[#0c1626]/65">
                        {group.items.length} {group.items.length === 1 ? 'tour' : 'tours'}
                      </span>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {group.items.map(tour => (
                      <TourCard key={tour.id} tour={tour} onSelect={() => setSelectedTour(tour)} onNavigate={route => navigate(route)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WHY US */}
        <div className="border-t border-[#0c1626]/15 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-4 gap-8">
            {[
              { title: 'Expert Local Guides', body: 'Every journey led by certified Nepali mountain guides with 10+ years experience.' },
              { title: 'Safety First', body: 'Comprehensive insurance, emergency protocols, and 24/7 support on every route.' },
              { title: 'Responsible Travel', body: 'Carbon-offset treks, local employment, and community conservation funds.' },
              { title: 'End-to-End Logistics', body: 'Permits, flights, transfers, and accommodation — all handled before you arrive.' },
            ].map(f => (
              <div key={f.title}>
                <h4 style={H} className="font-semibold text-[#0c1626] text-lg mb-1.5">{f.title}</h4>
                <p className="text-[15px] text-[#0c1626]/70 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}