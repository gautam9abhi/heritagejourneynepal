import { useState, useEffect, useRef } from 'react';
import { Utensils, Mountain, Clock, Calendar, ArrowUpRight, Users, Compass, BookOpen, MapPin, Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VerticalTrekTimeline } from '@/components/trekking/VerticalTrekTimeline';
import { TrekHighlights } from '@/components/trekking/TrekHighlights';
import { TrekGallery } from '@/components/trekking/TrekGallery';
import { TrekWeather } from '@/components/trekking/TrekWeather';

// Define the Ghorepani Poon Hill Trek itinerary
const ghorepaniItinerary = [
  {
    day: 1,
    title: "Drive Pokhara to Nayapul, trek to Tikhedhunga",
    overview: "After a short drive from Pokhara to Nayapul, begin your trek through picturesque villages and terraced hillsides, following the Modi Khola river toward Tikhedhunga.",
    walkingTime: "3-4 hours",
    difficulty: "Easy"
  },
  {
    day: 2,
    title: "Trek to Ghorepani",
    overview: "Ascend stone steps and trek through rhododendron forests (spectacular when in bloom during spring) to reach Ghorepani village, offering first glimpses of the Annapurna range.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 3,
    title: "Early morning hike to Poon Hill, trek to Tadapani",
    overview: "Early morning hike to Poon Hill (3,210m) for sunrise over the Himalayas. After breakfast, trek to Tadapani through beautiful forests with stunning mountain views throughout the day.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 4,
    title: "Trek to Ghandruk",
    overview: "Trek through rhododendron forests to Ghandruk, one of the largest Gurung villages in Nepal. Explore the village and learn about traditional Gurung culture and lifestyle.",
    walkingTime: "3-4 hours",
    difficulty: "Easy"
  },
  {
    day: 5,
    title: "Trek back to Nayapul and return to Pokhara",
    overview: "Descend through terraced fields and small villages back to Nayapul, where a vehicle will be waiting to take you back to Pokhara.",
    walkingTime: "4-5 hours",
    difficulty: "Easy"
  }
];

// Define the Mardi Himal Trek itinerary
const mardiHimalItinerary = [
  {
    day: 1,
    title: "Drive Pokhara to Kande, trek to Forest Camp",
    overview: "Short drive to Kande, then trek through beautiful villages and forest paths to reach Forest Camp, also known as Kokar.",
    walkingTime: "4-5 hours",
    difficulty: "Moderate"
  },
  {
    day: 2,
    title: "Trek to Low Camp",
    overview: "Continue through rhododendron forests with occasional views of the mountains to reach Low Camp, which offers better mountain views.",
    walkingTime: "3-4 hours",
    difficulty: "Moderate"
  },
  {
    day: 3,
    title: "Trek to High Camp",
    overview: "Ascend above the treeline to High Camp, with impressive panoramic views of the Annapurna range, Machhapuchhre (Fishtail), and the valley below.",
    walkingTime: "3-4 hours",
    difficulty: "Moderate"
  },
  {
    day: 4,
    title: "Trek to Mardi Himal Base Camp and return to High Camp",
    overview: "Early morning trek to Mardi Himal Base Camp (4,500m) for spectacular sunrise views of the Annapurna and Machhapuchhre peaks at close range. Return to High Camp in the afternoon.",
    walkingTime: "6-7 hours",
    difficulty: "Challenging"
  },
  {
    day: 5,
    title: "Trek back to Kande and drive to Pokhara",
    overview: "Descend via a different route through Sidhing village, offering new scenery, and finally reach Kande for your return drive to Pokhara.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  }
];

// Define the Dhampus Sarangkot Trek itinerary
const dhampusSarangkotItinerary = [
  {
    day: 1,
    title: "Drive to Phedi and trek to Dhampus",
    overview: "Short drive from Pokhara to Phedi, then trek up through villages and forests to reach Dhampus (1,600m), a beautiful Gurung village with stunning mountain views of Annapurna South, Hiunchuli, and Machhapuchhre.",
    walkingTime: "3-4 hours",
    difficulty: "Easy"
  },
  {
    day: 2,
    title: "Trek to Sarangkot",
    overview: "Trek from Dhampus to Sarangkot through traditional farming communities and terraced fields. Enjoy the sunset over Pokhara valley and the Annapurna range from the famous viewpoint.",
    walkingTime: "5-6 hours",
    difficulty: "Easy"
  },
  {
    day: 3,
    title: "Trek down to Pokhara",
    overview: "Wake early for sunrise views over the mountains, then enjoy a leisurely descent back to Pokhara, with time to explore the lakeside area in the afternoon.",
    walkingTime: "2-3 hours",
    difficulty: "Easy"
  }
];

// Define the Khopra Ridge Trek itinerary
const khopraRidgeItinerary = [
  {
    day: 1,
    title: "Drive to Nayapul, trek to Tikhedhunga",
    overview: "Drive from Pokhara to Nayapul, then trek along Modi River through beautiful villages to reach Tikhedhunga for the night.",
    walkingTime: "3-4 hours",
    difficulty: "Easy"
  },
  {
    day: 2,
    title: "Trek to Ghorepani",
    overview: "Challenging ascent to Ghorepani village via stone steps through charming villages and rhododendron forests.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 3,
    title: "Trek to Tadapani",
    overview: "Early morning optional hike to Poon Hill for sunrise views. After breakfast, continue trek to Tadapani through beautiful forests.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 4,
    title: "Trek to Nangethanti, continue to Khopra Danda (Ridge)",
    overview: "Trek off the main trail to Khopra Ridge through pristine forests and alpine terrain with few other trekkers around.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate to Challenging"
  },
  {
    day: 5,
    title: "Explore the ridge and surrounding alpine areas",
    overview: "Full day to explore Khopra Ridge (3,660m) with its spectacular views of Dhaulagiri, Annapurna, and deep valleys below.",
    walkingTime: "3-4 hours",
    difficulty: "Moderate"
  },
  {
    day: 6,
    title: "Trek back to Ghorepani",
    overview: "Begin return journey by trekking back to Ghorepani, enjoying different perspectives of the mountains.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 7,
    title: "Trek to Nayapul and drive back to Pokhara",
    overview: "Final day of trekking down through forests and villages to Nayapul, then drive back to Pokhara.",
    walkingTime: "5-6 hours",
    difficulty: "Easy"
  }
];

// Convert itineraries to format needed by TrekTimeline
const ghorepaniTimelineData = ghorepaniItinerary.map(day => ({
  day: day.day,
  title: day.title,
  description: day.overview,
  duration: day.walkingTime,
  elevation: day.difficulty === "Easy" ? "Minimal elevation gain" : 
             day.difficulty === "Moderate" ? "Moderate elevation gain" : 
             "Significant elevation gain"
}));

const mardiTimelineData = mardiHimalItinerary.map(day => ({
  day: day.day,
  title: day.title,
  description: day.overview,
  duration: day.walkingTime,
  elevation: day.difficulty === "Easy" ? "Minimal elevation gain" : 
             day.difficulty === "Moderate" ? "Moderate elevation gain" : 
             "Significant elevation gain"
}));

const dhampusTimelineData = dhampusSarangkotItinerary.map(day => ({
  day: day.day,
  title: day.title,
  description: day.overview,
  duration: day.walkingTime,
  elevation: day.difficulty === "Easy" ? "Minimal elevation gain" : 
             day.difficulty === "Moderate" ? "Moderate elevation gain" : 
             "Significant elevation gain"
}));

const khopraTimelineData = khopraRidgeItinerary.map(day => ({
  day: day.day,
  title: day.title,
  description: day.overview,
  duration: day.walkingTime,
  elevation: day.difficulty === "Easy" ? "Minimal elevation gain" : 
             day.difficulty === "Moderate" ? "Moderate elevation gain" : 
             "Significant elevation gain"
}));

const trekHighlights = [
  "Stunning sunrise views from Poon Hill over the Annapurna and Dhaulagiri ranges",
  "Experience authentic Gurung village life and culture in Ghandruk",
  "Trek through magnificent rhododendron forests (especially beautiful during spring)",
  "Panoramic close-up views of Fishtail Mountain (Machhapuchhre) from Mardi Himal Base Camp",
  "Enjoy spectacular mountain landscapes without the crowds on the Khopra Ridge Trek",
  "Perfect short adventures suitable for families and those with limited time"
];

const sampleGalleryImages = [
  { src: "/images/trekking/pokhara/poon-hill-1.jpeg", alt: "Sunrise view from Poon Hill" },
  { src: "/images/trekking/pokhara/ghandruk-1.jpg", alt: "Gurung village of Ghandruk" },
  { src: "/images/trekking/pokhara/mardi-himal-1.jpg", alt: "Mardi Himal Base Camp" },
  { src: "/images/trekking/pokhara/dhampus-1.jpg", alt: "Dhampus village" },
  { src: "/images/trekking/pokhara/sarangkot-1.jpg", alt: "Sunset view from Sarangkot" },
  { src: "/images/trekking/pokhara/khopra-ridge-1.jpg", alt: "Khopra Ridge views" },
];

const weatherData = [
  { month: "January", temperature: "−5° to 10°C", condition: "snowy" as const, suitable: false },
  { month: "February", temperature: "−3° to 12°C", condition: "snowy" as const, suitable: false },
  { month: "March", temperature: "0° to 15°C", condition: "mixed" as const, suitable: true },
  { month: "April", temperature: "3° to 18°C", condition: "cloudy" as const, suitable: true },
  { month: "May", temperature: "5° to 20°C", condition: "sunny" as const, suitable: true },
  { month: "June", temperature: "8° to 22°C", condition: "rainy" as const, suitable: false },
  { month: "July", temperature: "10° to 22°C", condition: "rainy" as const, suitable: false },
  { month: "August", temperature: "10° to 22°C", condition: "rainy" as const, suitable: false },
  { month: "September", temperature: "7° to 21°C", condition: "cloudy" as const, suitable: true },
  { month: "October", temperature: "5° to 18°C", condition: "sunny" as const, suitable: true },
  { month: "November", temperature: "0° to 15°C", condition: "mixed" as const, suitable: true },
  { month: "December", temperature: "−3° to 12°C", condition: "snowy" as const, suitable: false }
];

const culturalHighlights = [
  {
    title: "Gurung Villages",
    description: "Experience traditional Gurung culture in villages like Ghandruk, with stone houses, handicrafts, and warm hospitality.",
    icon: Users
  },
  {
    title: "Local Cuisine",
    description: "Taste authentic local dishes like dhido (buckwheat porridge), gundruk (fermented greens), and the famous Gurung bread.",
    icon: Utensils
  },
  {
    title: "Traditional Architecture",
    description: "Explore villages with traditional stone houses, slate roofs, and intricate wood carvings that reflect local craftsmanship.",
    icon: Heart
  }
];

const ShortDurationTreks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const overviewRef = useRef<HTMLDivElement>(null);

  const scrollToOverview = () => {
    overviewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero Section with Parallax Effect */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/trekking/pokhara/pokhara-short-trek.jpg"
            alt="Short Duration Treks from Pokhara"
            className="w-full h-full object-cover transform scale-110 animate-[slow-pan_30s_ease-in-out_infinite_alternate]"
            style={{ transformOrigin: 'center center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>

        <div className="container-custom relative z-10 text-center text-white py-32">
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            Short Duration Treks from Pokhara
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 italic mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "Discover stunning views, rich culture & breathtaking landscapes in just a few days"
          </p>
          
          {/* Key info badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 mr-2" />
              <span>2-7 Days</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Compass className="w-5 h-5 mr-2" />
              <span>Easy to Moderate</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Mountain className="w-5 h-5 mr-2" />
              <span>Up to 4,500m</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Mar-May, Sep-Nov</span>
            </div>
          </div>
          
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
            style={{ animationDelay: "0.9s" }}
          >            
            <Button
              size="lg"
              onClick={scrollToOverview}
              className="bg-pink-500 hover:bg-purple-700 text-lg px-8 py-3 text-white mt-8 flex items-center gap-2 group"
              style={{ animationDelay: "0.9s" }}
            >
              Start Your Journey
              <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-heritage-light">
        <div className="container-custom max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Overview Section */}
              <div ref={overviewRef} className="prose prose-lg max-w-none mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold text-heritage-brown mb-6">Trek Overview</h2>
                <p className="text-heritage-brown/80 leading-relaxed">
                  Pokhara is your perfect gateway for short trekking adventures that deliver panoramic mountain vistas, 
                  immerse you in traditional village life, and reveal the natural beauty of Nepal's diverse landscapes — all 
                  within a manageable timeframe. Whether you want an easy escape or a challenging climb, these short treks are 
                  ideal for travelers short on time but big on adventure. Each trek offers a unique perspective of the Annapurna 
                  range and surrounding landscapes, from the famous sunrise viewpoint of Poon Hill to the less-traveled trails 
                  of Khopra Ridge.
                </p>
              </div>

              {/* Trek Gallery */}
              <div className="mb-16">
                <TrekGallery images={sampleGalleryImages} />
              </div>

              {/* Trek Highlights Section */}
              <div className="mb-16">
                <TrekHighlights highlights={trekHighlights} />
              </div>

              {/* Ghorepani Poon Hill Trek */}
              <div className="bg-white rounded-lg p-6 shadow-md mb-16">
                <h2 className="text-3xl font-bold text-heritage-brown mb-4">Ghorepani Poon Hill Trek</h2>
                <p className="text-xl text-heritage-brown/80 italic mb-6">"The Sunrise Panorama Trek"</p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-heritage-brown mb-2">Overview</h3>
                  <p className="text-heritage-brown/80 mb-6">
                    A 4-5 day trek passing through charming Gurung villages, rhododendron forests, and terraced hillsides. 
                    The highlight is the early morning hike to Poon Hill for one of the best sunrise mountain views in Nepal, 
                    showcasing Annapurna and Dhaulagiri's majestic peaks.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Duration</p>
                      <p className="text-heritage-brown/80">4-5 Days</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Difficulty</p>
                      <p className="text-heritage-brown/80">Moderate</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Max Altitude</p>
                      <p className="text-heritage-brown/80">3,210m (Poon Hill)</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Best Time</p>
                      <p className="text-heritage-brown/80">Mar-May, Sep-Nov</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-heritage-brown mb-4">Sample Itinerary</h3>
                <VerticalTrekTimeline days={ghorepaniTimelineData} />
                
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-heritage-brown mb-2">Cultural Highlights</h3>
                  <p className="text-heritage-brown/80">Traditional Gurung villages, local hospitality, and vibrant rhododendron blooms.</p>
                </div>
              </div>

              {/* Mardi Himal Trek */}
              <div className="bg-white rounded-lg p-6 shadow-md mb-16">
                <h2 className="text-3xl font-bold text-heritage-brown mb-4">Mardi Himal Trek</h2>
                <p className="text-xl text-heritage-brown/80 italic mb-6">"The Hidden Gem Trek"</p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-heritage-brown mb-2">Overview</h3>
                  <p className="text-heritage-brown/80 mb-6">
                    This 5-6 day trek ventures through lush forests and alpine meadows, ending at the base camp of Mardi Himal peak. 
                    It's less crowded than other treks, providing peaceful mountain scenery and spectacular views of the Annapurna massif.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Duration</p>
                      <p className="text-heritage-brown/80">5-6 Days</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Difficulty</p>
                      <p className="text-heritage-brown/80">Moderate</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Max Altitude</p>
                      <p className="text-heritage-brown/80">4,500m (Mardi Himal Base Camp)</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Best Time</p>
                      <p className="text-heritage-brown/80">Mar-May, Sep-Nov</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-heritage-brown mb-4">Sample Itinerary</h3>
                <VerticalTrekTimeline days={mardiTimelineData} />
                
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-heritage-brown mb-2">Cultural Highlights</h3>
                  <p className="text-heritage-brown/80">Small remote villages, rich biodiversity, and rare mountain views.</p>
                </div>
              </div>

              {/* Dhampus Sarangkot Trek */}
              <div className="bg-white rounded-lg p-6 shadow-md mb-16">
                <h2 className="text-3xl font-bold text-heritage-brown mb-4">Dhampus Sarangkot Trek</h2>
                <p className="text-xl text-heritage-brown/80 italic mb-6">"The Quick Cultural Escape"</p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-heritage-brown mb-2">Overview</h3>
                  <p className="text-heritage-brown/80 mb-6">
                    This easy 2-3 day trek offers stunning views of the Annapurna range and Pokhara Valley. 
                    It passes through traditional villages and lush forests, perfect for those wanting a light trek 
                    with cultural exposure and gorgeous panoramas.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Duration</p>
                      <p className="text-heritage-brown/80">2-3 Days</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Difficulty</p>
                      <p className="text-heritage-brown/80">Easy</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Max Altitude</p>
                      <p className="text-heritage-brown/80">1,600m (Dhampus)</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Best Time</p>
                      <p className="text-heritage-brown/80">Year-round</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-heritage-brown mb-4">Sample Itinerary</h3>
                <VerticalTrekTimeline days={dhampusTimelineData} />
                
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-heritage-brown mb-2">Cultural Highlights</h3>
                  <p className="text-heritage-brown/80">Local Gurung village life, traditional farming, and spectacular sunrise/sunset views.</p>
                </div>
              </div>

              {/* Khopra Ridge Trek */}
              <div className="bg-white rounded-lg p-6 shadow-md mb-16">
                <h2 className="text-3xl font-bold text-heritage-brown mb-4">Khopra Ridge Trek</h2>
                <p className="text-xl text-heritage-brown/80 italic mb-6">"The Offbeat High-Altitude Adventure"</p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-heritage-brown mb-2">Overview</h3>
                  <p className="text-heritage-brown/80 mb-6">
                    A 6-7 day trek through remote villages, rhododendron forests, and alpine terrain. 
                    The Khopra Ridge offers unparalleled views of Annapurna, Dhaulagiri, and Machhapuchhre peaks — 
                    perfect for trekkers seeking solitude and high mountain vistas.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Duration</p>
                      <p className="text-heritage-brown/80">6-7 Days</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Difficulty</p>
                      <p className="text-heritage-brown/80">Moderate to Challenging</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Max Altitude</p>
                      <p className="text-heritage-brown/80">3,660m (Khopra Ridge)</p>
                    </div>
                    <div className="bg-heritage-light/50 p-3 rounded-md">
                      <p className="font-semibold text-heritage-brown">Best Time</p>
                      <p className="text-heritage-brown/80">Mar-May, Sep-Nov</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-heritage-brown mb-4">Sample Itinerary</h3>
                <VerticalTrekTimeline days={khopraTimelineData} />
                
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-heritage-brown mb-2">Cultural Highlights</h3>
                  <p className="text-heritage-brown/80">Experience remote villages with limited tourists, rhododendron blooms, and pristine mountain landscapes.</p>
                </div>
              </div>

              {/* Weather Information */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-heritage-brown mb-6">Weather & Best Time to Visit</h2>
                <TrekWeather months={weatherData} />
              </div>

              {/* Cultural Section */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-3xl font-bold text-heritage-brown mb-6">Cultural Immersion</h2>
                <p className="text-heritage-brown/80 mb-8">
                  The short treks from Pokhara offer not just stunning mountain views but also rich cultural experiences. 
                  You'll have the opportunity to stay in traditional Gurung villages, interact with locals, and observe their 
                  daily way of life. Many villages maintain their cultural heritage through architecture, music, dance, and cuisine. 
                  The warm hospitality you'll experience in these mountain communities is often highlighted as a memorable aspect of 
                  these treks, complementing the natural beauty surrounding them.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {culturalHighlights.map((highlight, index) => {
                    const Icon = highlight.icon;
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 bg-heritage-purple/10 rounded-full flex items-center justify-center mb-4">
                            <Icon className="h-6 w-6 text-heritage-purple" />
                          </div>
                          <h3 className="font-semibold text-heritage-brown mb-2">{highlight.title}</h3>
                          <p className="text-heritage-brown/70 text-sm">{highlight.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-bold text-heritage-brown border-b pb-2">
                    Trek Overview
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Duration</h4>
                        <p className="text-heritage-brown/70">2-7 Days</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mountain className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Difficulty</h4>
                        <p className="text-heritage-brown/70">Easy to Moderate</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Compass className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Maximum Altitude</h4>
                        <p className="text-heritage-brown/70">4,500m (Mardi Himal Base Camp)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Best Time to Trek</h4>
                        <p className="text-heritage-brown/70">March - May, September - November</p>
                      </div>
                    </div>
                  </div>

                  {/* What to Pack Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-heritage-brown mb-4">What to Pack</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Comfortable hiking boots</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Layered clothing (temperatures vary)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Rain jacket (especially during shoulder seasons)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Water bottle and purification tablets</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Camera for spectacular views</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full bg-heritage-purple hover:bg-heritage-purple/90 text-white mt-4"
                    onClick={() => window.open("/contact", "_blank", "noopener,noreferrer")}
                  >
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShortDurationTreks;
