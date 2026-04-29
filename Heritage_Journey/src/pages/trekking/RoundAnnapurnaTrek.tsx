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
    title: "Arrival in Kathmandu",
    overview: "Arrive in Kathmandu and transfer to your hotel. Spend the day exploring the city's historical sites, including Swayambhunath Stupa (Monkey Temple) and Pashupatinath Temple.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 2,
    title: "Drive to Besishahar",
    overview: "Drive from Kathmandu to Besishahar, a small town in Lamjung District. Enjoy views of rural villages and terraced fields along the way.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 3,
    title: "Trek to Bahundanda",
    overview: "Start your trek from Besishahar to Bahundanda. The trek takes you through terraced fields and traditional villages, offering stunning views of Annapurna and Manaslu ranges.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 4,
    title: "Trek to Chamje",
    overview: "Trek from Bahundanda to Chamje, passing through Gurung and Tamang villages. You'll be treated to picturesque riverside views as you walk through lush forests.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 5,
    title: "Trek to Bagarchhap",
    overview: "From Chamje, trek to Bagarchhap, a traditional village at the foot of Lamjung Himal. The route passes through pine and oak forests.",
    walkingTime: "6 hours",
    difficulty: "Moderate"
  },
  {
    day: 6,
    title: "Trek to Chame",
    overview: "Continue to Chame, the administrative center of Manang district. You will pass through several traditional villages, gaining insight into the lives of the local Gurung and Tibetan people.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 7,
    title: "Trek to Pisang",
    overview: "Trek to Pisang, a Tibetan-influenced village located along the banks of the Marsyangdi River. This route provides more dramatic views of Annapurna II and Pisang Peak.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 8,
    title: "Trek to Manang",
    overview: "Trek to Manang, a scenic valley settlement where you can interact with locals and enjoy the spectacular mountain vistas.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 9,
    title: "Rest day in Manang",
    overview: "Take a well-deserved rest day in Manang for acclimatization. Explore the area or take a side trip to Gangapurna Lake.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 10,
    title: "Trek to Yak Kharka",
    overview: "Trek to Yak Kharka, a quiet village surrounded by lush meadows and grazing yaks. The landscape shifts to alpine terrain as you gain altitude.",
    walkingTime: "4-5 hours",
    difficulty: "Moderate"
  },
  {
    day: 11,
    title: "Trek to Thorong Phedi",
    overview: "From Yak Kharka, trek to Thorong Phedi, located at the base of the famous Thorong La Pass.",
    walkingTime: "4-5 hours",
    difficulty: "Moderate"
  },
  {
    day: 12,
    title: "Trek to Muktinath via Thorong La Pass",
    overview: "Cross the challenging Thorong La Pass (5,416m), the highest point of the trek. Descend to Muktinath, a sacred pilgrimage site for both Hindus and Buddhists.",
    walkingTime: "8-10 hours",
    difficulty: "Challenging"
  },
  {
    day: 13,
    title: "Trek to Marpha",
    overview: "Trek to Marpha, a traditional village famous for its apple orchards. Enjoy the peace of this high-altitude settlement.",
    walkingTime: "4-5 hours",
    difficulty: "Moderate"
  },
  {
    day: 14,
    title: "Trek to Kalopani",
    overview: "Trek from Marpha to Kalopani, a scenic village located on the banks of the Kali Gandaki River.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 15,
    title: "Trek to Tatopani",
    overview: "Trek to Tatopani, famous for its natural hot springs. Relax and soak in the rejuvenating waters after a long trek.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 16,
    title: "Trek to Ghorepani",
    overview: "Trek from Tatopani to Ghorepani, a beautiful village in the foothills of the Annapurna range. The route passes through lush forests.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 17,
    title: "Trek to Poon Hill and Trek to Tadapani",
    overview: "Early morning hike to Poon Hill for a stunning sunrise over the Annapurna and Dhaulagiri ranges. Continue to Tadapani for an overnight stay.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 18,
    title: "Trek to Ghandruk",
    overview: "Trek to Ghandruk, a picturesque Gurung village known for its traditional stone houses and stunning mountain views.",
    walkingTime: "5-6 hours",
    difficulty: "Easy"
  },
  {
    day: 19,
    title: "Trek to Nayapul and Drive to Pokhara",
    overview: "Trek to Nayapul and take a scenic drive to Pokhara, a lakeside city. Relax and enjoy the tranquil beauty of Phewa Lake.",
    walkingTime: "4-5 hours",
    difficulty: "Easy"
  },
  {
    day: 20,
    title: "Drive back to Kathmandu",
    overview: "Drive back to Kathmandu. Spend your last day in Nepal exploring the capital, shopping, or visiting more temples.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 21,
    title: "Departure",
    overview: "Transfer to the airport for your departure flight.",
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
  "Trek through one of the most culturally diverse regions of Nepal",
  "Cross the challenging Thorong La Pass (5,416m)",
  "Experience traditional Gurung, Thakali, and Manangi villages",
  "Enjoy panoramic views of Annapurna, Dhaulagiri, and Machhapuchhre",
  "Soak in natural hot springs at Tatopani",
  "Sunrise view from Poon Hill over the Himalayan peaks",
  "Visit Muktinath, an important pilgrimage site",
  "Trek through diverse landscapes from subtropical forests to alpine valleys"
];

const sampleGalleryImages = [
  {
    src: "/images/trekking/circuit/thorangla-1.jpg",
    alt: "Round Annapurna Trek panorama"
  },
  {
    src: "/images/trekking/circuit/thorangla-2.jpg",
    alt: "Mountain views along the trek"
  },
  {
    src: "/images/trekking/circuit/thorangla-3.jpg",
    alt: "Himalayan landscapes"
  },
  {
    src: "/images/trekking/circuit/thorangla-4.jpg",
    alt: "Traditional villages"
  },
  {
    src: "/images/trekking/circuit/thorangla-5.jpg",
    alt: "Local culture"
  }
];

const weatherData = [
  { month: "January", temperature: "−10° to 5°C", condition: "snowy" as const, suitable: false },
  { month: "February", temperature: "−8° to 8°C", condition: "snowy" as const, suitable: false },
  { month: "March", temperature: "−5° to 12°C", condition: "mixed" as const, suitable: true },
  { month: "April", temperature: "0° to 15°C", condition: "cloudy" as const, suitable: true },
  { month: "May", temperature: "5° to 18°C", condition: "cloudy" as const, suitable: true },
  { month: "June", temperature: "10° to 20°C", condition: "rainy" as const, suitable: false },
  { month: "July", temperature: "12° to 20°C", condition: "rainy" as const, suitable: false },
  { month: "August", temperature: "12° to 20°C", condition: "rainy" as const, suitable: false },
  { month: "September", temperature: "8° to 18°C", condition: "mixed" as const, suitable: true },
  { month: "October", temperature: "3° to 15°C", condition: "sunny" as const, suitable: true },
  { month: "November", temperature: "−2° to 12°C", condition: "sunny" as const, suitable: true },
  { month: "December", temperature: "−8° to 8°C", condition: "snowy" as const, suitable: false }
];

const culturalHighlights = [
  {
    title: "Gurung Villages",
    description: "Experience the hospitality of the Gurung people and their vibrant culture.",
    icon: Users
  },
  {
    title: "Tibetan Culture",
    description: "Visit Tibetan Buddhist monasteries and learn about Tibetan traditions.",
    icon: Heart
  },
  {
    title: "Local Cuisine",
    description: "Enjoy traditional Nepali dishes like dal bhat, momos, and Thakali-style food.",
    icon: Utensils
  }
];

const RoundAnnapurnaTrek = () => {
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
            src="/images/trekking/circuit/thorangla-1.jpg"
            alt="Round Annapurna Trek"
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
            Round Annapurna Trek
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 italic mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "Journey through the Heart of the Himalayas"
          </p>
          
          {/* Key info badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 mr-2" />
              <span>21 Days</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Compass className="w-5 h-5 mr-2" />
              <span>Moderate to Challenging</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Mountain className="w-5 h-5 mr-2" />
              <span>5,416m</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Mar-May, Sep-Nov</span>
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
                  The Round Annapurna Trek is one of the most culturally diverse and awe-inspiring treks in Nepal. 
                  Taking you through a wide variety of landscapes, from subtropical forests to high alpine valleys, 
                  this trek offers breathtaking views of towering peaks like Annapurna, Machhapuchhre, and Dhaulagiri. 
                  Along the way, you will pass through villages inhabited by different ethnic groups, including the Gurung, 
                  Thakali, and Manangi people, each with its unique traditions and lifestyle. This journey immerses you 
                  not only in the natural beauty of the Himalayas but also in the vibrant cultural fabric of Nepal, 
                  making it an unforgettable experience.
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
                  On the Round Annapurna Trek, you will experience a rich blend of cultural heritage, 
                  from Gurung villages to Tibetan-influenced settlements. Along the route, you will 
                  meet welcoming locals and gain insight into their unique way of life. Visit 
                  monasteries, attend local festivals, and enjoy the flavors of authentic Nepali cuisine.
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
                        <p className="text-heritage-brown/70">21 Days</p>
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
                        <p className="text-heritage-brown/70">5,416m (Thorong La Pass)</p>
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
                        <span className="text-sm text-heritage-brown/80">Layers of clothing (temperature varies greatly)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Waterproof jacket and pants</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Sturdy hiking boots</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Down jacket (for higher altitudes)</span>
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

export default RoundAnnapurnaTrek;