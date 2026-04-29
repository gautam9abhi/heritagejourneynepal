import { useState, useEffect, useRef } from 'react';
import { Utensils, Mountain, Clock, Calendar, ArrowUpRight, Users, Compass, BookOpen, MapPin, Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VerticalTrekTimeline } from '@/components/trekking/VerticalTrekTimeline';
import { TrekHighlights } from '@/components/trekking/TrekHighlights';
import { TrekGallery } from '@/components/trekking/TrekGallery';
import { TrekWeather } from '@/components/trekking/TrekWeather';

// Define the itinerary data
const itinerary = [
  {
    day: 1,
    title: "Arrive in Kathmandu",
    overview: "Arrive in Kathmandu and transfer to your hotel. Explore the vibrant city, visiting temples, markets, and cultural landmarks like Durbar Square and Swayambhunath (Monkey Temple).",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 2,
    title: "Drive or Flight to Pokhara",
    overview: "Take a scenic drive or flight from Kathmandu to Pokhara. Pokhara, known for its lakes, natural beauty, and adventure sports, is the gateway to the Annapurna and Mustang regions.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 3,
    title: "Pokhara to Tatopani",
    overview: "Drive from Pokhara to Tatopani, a village on the banks of the Kali Gandaki River. Known for its natural hot springs, it's the perfect place to relax after your long drive.",
    walkingTime: "6-7 hours (driving)",
    difficulty: "Easy"
  },
  {
    day: 4,
    title: "Tatopani to Ghasa",
    overview: "Drive along the Kali Gandaki River to Ghasa, a village famous for its apple orchards. Enjoy panoramic views of the Himalayas as you drive through charming landscapes.",
    walkingTime: "4-5 hours (driving)",
    difficulty: "Easy"
  },
  {
    day: 5,
    title: "Ghasa to Kagbeni",
    overview: "Travel to Kagbeni, the gateway to the Upper Mustang region. This small village, located at the confluence of the Kali Gandaki and Jhong rivers, is known for its traditional Tibetan architecture and monasteries.",
    walkingTime: "6-7 hours (driving)",
    difficulty: "Easy"
  },
  {
    day: 6,
    title: "Kagbeni to Chele",
    overview: "Drive from Kagbeni to Chele, a village surrounded by red sandstone cliffs. Known for its unique landscape and traditional architecture, it's a perfect stop for exploring the culture and lifestyle of the Mustang region.",
    walkingTime: "3-4 hours (driving)",
    difficulty: "Easy"
  },
  {
    day: 7,
    title: "Chele to Syanbochen",
    overview: "Continue your journey to Syanbochen, a peaceful village with views of snow-capped peaks and an introduction to Mustang's Buddhist culture.",
    walkingTime: "5-6 hours (driving)",
    difficulty: "Easy"
  },
  {
    day: 8,
    title: "Syanbochen to Ghaymi",
    overview: "Drive from Syanbochen to Ghaymi, a small village surrounded by barley and wheat fields. This is a great place to learn about the local culture, architecture, and lifestyle of the people.",
    walkingTime: "4-5 hours (driving)",
    difficulty: "Easy"
  },
  {
    day: 9,
    title: "Ghaymi to Charang",
    overview: "Drive to Charang, a village known for its ancient monastery and traditional architecture. Charang offers some of the best views of the surrounding Himalayas and provides insight into the history of the region.",
    walkingTime: "3-4 hours (driving)",
    difficulty: "Easy"
  },
  {
    day: 10,
    title: "Charang to Lo Manthang",
    overview: "The final leg of the journey takes you to Lo Manthang, the capital of Upper Mustang. Known for its ancient walled city, palace, and monasteries, Lo Manthang is steeped in history and Tibetan Buddhist culture.",
    walkingTime: "4-5 hours (driving)",
    difficulty: "Moderate"
  },
  {
    day: 11,
    title: "Explore Lo Manthang",
    overview: "Spend the day exploring Lo Manthang's ancient monasteries, palaces, and temples. This is the heart of the Upper Mustang, where you can immerse yourself in the history, culture, and spiritual life of the region.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 12,
    title: "Lo Manthang to Ghaymi",
    overview: "Begin your descent back to Ghaymi, retracing the scenic route with opportunities for new views and cultural experiences along the way.",
    walkingTime: "4-5 hours (driving)",
    difficulty: "Easy"
  },
  {
    day: 13,
    title: "Ghaymi to Tatopani",
    overview: "Travel from Ghaymi to Tatopani, taking in the landscapes and allowing yourself time to relax and enjoy the hot springs upon arrival.",
    walkingTime: "7-8 hours (driving)",
    difficulty: "Moderate"
  },
  {
    day: 14,
    title: "Tatopani to Pokhara",
    overview: "Drive back to Pokhara, where you can relax by the lake, enjoy the peaceful atmosphere, and reflect on the unforgettable journey to Upper Mustang.",
    walkingTime: "6-7 hours (driving)",
    difficulty: "Easy"
  },
  {
    day: 15,
    title: "Drive or Flight back to Kathmandu",
    overview: "Return to Kathmandu by flight or drive. Spend your final evening in Nepal exploring the capital or shopping for souvenirs.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 16,
    title: "Departure",
    overview: "Transfer to the airport for your departure flight, marking the end of your journey to Upper Mustang.",
    walkingTime: "N/A",
    difficulty: "Easy"
  }
];

// Convert itinerary to format needed by TrekTimeline
const timelineData = itinerary.map(day => ({
  day: day.day,
  title: day.title,
  description: day.overview,
  duration: day.walkingTime,
  elevation: day.difficulty === "Easy" ? "Minimal elevation gain" : 
             day.difficulty === "Moderate" ? "Moderate elevation gain" : 
             "Significant elevation gain"
}));

const trekHighlights = [
  "Visit Lo Manthang, the medieval walled city and ancient capital of the Upper Mustang kingdom",
  "Experience the unique Tibetan-influenced culture preserved for centuries",
  "Explore ancient Buddhist monasteries with beautiful murals and artifacts",
  "Visit the cave temples of Chosar with their 2,500-year-old history",
  "Witness dramatic desert landscapes with colorful rock formations",
  "Experience the traditional lifestyle of the people of Mustang",
  "Enjoy breathtaking views of the Annapurna and Dhaulagiri mountain ranges",
  "Cross the mighty Kali Gandaki river, the deepest gorge in the world"
];

const sampleGalleryImages = [
  {
    src: "/images/trekking/upper/upper-5.jpg",
    alt: "Upper Mustang panorama"
  },
  {
    src: "/images/trekking/upper/upper-1.jpg",
    alt: "Desert landscapes of Upper Mustang"
  },
  {
    src: "/images/trekking/upper/upper-2.jpg",
    alt: "Lo Manthang walled city"
  },
  {
    src: "/images/trekking/upper/upper-3.jpg",
    alt: "Traditional architecture"
  },
  {
    src: "/images/trekking/upper/upper-4.jpg",
    alt: "Buddhist culture"
  }
];

const weatherData = [
  { month: "January", temperature: "−5° to 8°C", condition: "snowy" as const, suitable: false },
  { month: "February", temperature: "−2° to 10°C", condition: "snowy" as const, suitable: false },
  { month: "March", temperature: "5° to 15°C", condition: "mixed" as const, suitable: true },
  { month: "April", temperature: "10° to 18°C", condition: "cloudy" as const, suitable: true },
  { month: "May", temperature: "12° to 20°C", condition: "cloudy" as const, suitable: true },
  { month: "June", temperature: "15° to 25°C", condition: "mixed" as const, suitable: false },
  { month: "July", temperature: "15° to 25°C", condition: "rainy" as const, suitable: false },
  { month: "August", temperature: "15° to 25°C", condition: "rainy" as const, suitable: false },
  { month: "September", temperature: "12° to 20°C", condition: "mixed" as const, suitable: true },
  { month: "October", temperature: "8° to 18°C", condition: "sunny" as const, suitable: true },
  { month: "November", temperature: "0° to 12°C", condition: "sunny" as const, suitable: false },
  { month: "December", temperature: "−5° to 10°C", condition: "snowy" as const, suitable: false }
];

const culturalHighlights = [
  {
    title: "Lo Manthang",
    description: "The ancient capital of Upper Mustang, with its palaces, temples, and monasteries, offers a fascinating cultural experience.",
    icon: Users
  },
  {
    title: "Buddhist Monasteries",
    description: "Visit ancient monasteries like Jhong, Chosar, and Thubchen, where you can learn about Tibetan Buddhist practices and history.",
    icon: Heart
  },
  {
    title: "Tibetan Culture",
    description: "Savor local dishes, including Tibetan bread, momos (dumplings), and butter tea, which are staples of Mustang's cuisine.",
    icon: Utensils
  }
];

const UpperMustang = () => {
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
            src="/images/trekking/upper/upper-5.jpg"
            alt="Upper Mustang"
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
            Upper Mustang
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 italic mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "Journey to the Mystical Kingdom"
          </p>
          
          {/* Key info badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 mr-2" />
              <span>16 Days</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Compass className="w-5 h-5 mr-2" />
              <span>Moderate to Challenging</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Mountain className="w-5 h-5 mr-2" />
              <span>3,800m</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Mar-May, Sep-Oct</span>
            </div>
          </div>
          
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
            style={{ animationDelay: "0.9s" }}
          >            <Button
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
            <div className="lg:col-span-2">              {/* Overview Section */}
              <div ref={overviewRef} className="prose prose-lg max-w-none mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold text-heritage-brown mb-6">Trek Overview</h2>
                <p className="text-heritage-brown/80 leading-relaxed">
                  Upper Mustang, also known as Lo Manthang, is one of the most remote and culturally 
                  rich regions of Nepal, offering a rare opportunity to explore the land of the last 
                  forbidden kingdom. This high-altitude desert region, surrounded by the majestic 
                  Himalayan peaks, provides a unique blend of rugged landscapes, ancient monasteries, 
                  and traditional Tibetan culture. The kingdom of Lo Manthang, with its centuries-old 
                  walled city, monasteries, and palaces, invites travelers to experience the mystical 
                  beauty of its landscape and the fascinating lifestyle of its people. The trek to 
                  Upper Mustang combines breathtaking natural beauty with a deep cultural immersion, 
                  making it a once-in-a-lifetime adventure.
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

              {/* Itinerary Section - VERTICAL TIMELINE */}
              <div className="bg-white rounded-lg p-6 shadow-md mb-16">
                <h2 className="text-3xl font-bold text-heritage-brown mb-6">Daily Itinerary</h2>
                <VerticalTrekTimeline days={timelineData} />
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
                  Upper Mustang offers one of the most unique cultural experiences in Nepal. The 
                  region is deeply influenced by Tibetan Buddhism and retains many aspects of 
                  Tibetan culture, including traditional architecture, ancient monasteries, and 
                  customs. The ancient walled city of Lo Manthang, with its Tibetan-style palaces, 
                  monasteries, and temples, offers a glimpse into the region's historical significance. 
                  Throughout the trek, you'll have the opportunity to interact with the Mustang people, 
                  learn about their way of life, and experience their rich cultural traditions.
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
                        <p className="text-heritage-brown/70">16 Days</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mountain className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Difficulty</h4>
                        <p className="text-heritage-brown/70">Moderate to Challenging</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Compass className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Maximum Altitude</h4>
                        <p className="text-heritage-brown/70">3,800m (Lo Manthang)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Best Time to Trek</h4>
                        <p className="text-heritage-brown/70">March - May, September - October</p>
                      </div>
                    </div>
                  </div>

                  {/* What to Pack Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-heritage-brown mb-4">What to Pack</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Sun protection (hat, sunglasses, sunscreen)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Warm clothing for cool nights</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Comfortable footwear for desert terrain</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Camera for capturing the unique landscapes</span>
                      </li>
                    </ul>
                  </div>                  <Button 
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

export default UpperMustang;