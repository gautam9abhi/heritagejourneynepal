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
    title: "Kathmandu to Syabrubesi",
    overview: "Begin your journey with a scenic drive from Kathmandu to Syabrubesi, a small village at the entrance of the Langtang National Park. Enjoy the stunning views of the valley and the surrounding hills as you make your way to your destination.",
    walkingTime: "7-8 hours (driving)",
    difficulty: "Easy to Moderate"
  },
  {
    day: 2,
    title: "Syabrubesi to Lama Hotel",
    overview: "Trek from Syabrubesi to Lama Hotel, passing through beautiful forests of pine and rhododendron, and crossing several streams. The trail gradually ascends, offering scenic views of the surrounding mountains.",
    walkingTime: "6 hours",
    difficulty: "Moderate"
  },
  {
    day: 3,
    title: "Lama Hotel to Langtang Village",
    overview: "Trek to Langtang Village, passing through beautiful landscapes and experiencing the local culture of the Tamang people. The trek provides magnificent views of Langtang Lirung, the highest peak in the Langtang region.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 4,
    title: "Langtang Village to Kyanjin Gompa",
    overview: "Trek from Langtang village to Kyanjin Gompa, a sacred Buddhist monastery situated at the base of Langtang Lirung. The trail offers beautiful views of glaciers and the surrounding peaks.",
    walkingTime: "3-4 hours",
    difficulty: "Moderate"
  },
  {
    day: 5,
    title: "Acclimatization Day in Kyanjin Gompa",
    overview: "Spend the day in Kyanjin Gompa to acclimatize to the altitude. You can explore the village, visit the local monastery, and take short hikes around the area for stunning views of the Langtang range.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 6,
    title: "Kyanjin Gompa to Lama Hotel",
    overview: "After acclimatizing, trek back to Lama Hotel. The descent is as scenic as the ascent, with stunning views of the Langtang Himal and surrounding valleys.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 7,
    title: "Lama Hotel to Syabrubesi",
    overview: "Trek back from Lama Hotel to Syabrubesi, retracing your steps through the lush forests and along the beautiful streams.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 8,
    title: "Syabrubesi to Gatlang",
    overview: "Trek from Syabrubesi to Gatlang, a picturesque Tamang village nestled in the hills. Along the way, you will pass through forests and small settlements, and enjoy the views of the surrounding mountains.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 9,
    title: "Gatlang to Tatopani",
    overview: "Trek from Gatlang to Tatopani, a village famous for its natural hot springs. After a long day of trekking, you can relax and unwind in the hot springs.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 10,
    title: "Tatopani to Thuman",
    overview: "Trek from Tatopani to Thuman, a Tamang village with stunning views of the Langtang Himal. The village is known for its traditional Tamang culture, and you may get the chance to witness folk music and dance.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 11,
    title: "Thuman to Briddim",
    overview: "Trek from Thuman to Briddim, a charming village with traditional Tamang houses and an ancient monastery. Enjoy the scenic beauty of the valley and interact with the local Tamang people to learn more about their culture.",
    walkingTime: "6 hours",
    difficulty: "Moderate"
  },
  {
    day: 12,
    title: "Briddim to Syabrubesi",
    overview: "Trek back from Briddim to Syabrubesi, where you will reflect on your journey through the beautiful Langtang region and the Tamang villages.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 13,
    title: "Syabrubesi to Kathmandu",
    overview: "Drive back to Kathmandu, retracing the scenic route you took on the way to Syabrubesi. Enjoy your final views of the Langtang range and the surrounding landscapes.",
    walkingTime: "N/A (driving)",
    difficulty: "Easy"
  },
  {
    day: 14,
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
  "Explore the rich Tamang culture and their traditional way of life",
  "Visit ancient Buddhist monasteries including Kyanjin Gompa",
  "Experience natural hot springs in Tatopani",
  "Enjoy panoramic views of the Langtang Himal range",
  "Trek through beautiful rhododendron and pine forests",
  "Witness traditional Tamang folk music and dance performances",
  "Interact with friendly locals and learn about their customs",
  "Less crowded trekking route compared to Everest and Annapurna"
];

const sampleGalleryImages = [
  {
    src: "/images/trekking/langtang/langtang-3.jpg",
    alt: "Langtang Himal Trek panorama"
  },
  {
    src: "/images/trekking/langtang/langtang-1.jpg",
    alt: "Mountain views along the trek"
  },
  {
    src: "/images/trekking/langtang/langtang-2.jpg",
    alt: "Himalayan landscapes"
  },
  {
    src: "/images/trekking/langtang/langtang-4.jpg",
    alt: "Traditional villages"
  },
  {
    src: "/images/trekking/langtang/langtang-5.jpg",
    alt: "Local culture"
  }
];

const weatherData = [
  { month: "January", temperature: "−10° to 5°C", condition: "snowy" as const, suitable: false },
  { month: "February", temperature: "−7° to 8°C", condition: "snowy" as const, suitable: false },
  { month: "March", temperature: "−2° to 12°C", condition: "mixed" as const, suitable: true },
  { month: "April", temperature: "2° to 15°C", condition: "cloudy" as const, suitable: true },
  { month: "May", temperature: "5° to 18°C", condition: "cloudy" as const, suitable: true },
  { month: "June", temperature: "8° to 20°C", condition: "rainy" as const, suitable: false },
  { month: "July", temperature: "10° to 20°C", condition: "rainy" as const, suitable: false },
  { month: "August", temperature: "10° to 20°C", condition: "rainy" as const, suitable: false },
  { month: "September", temperature: "7° to 18°C", condition: "mixed" as const, suitable: true },
  { month: "October", temperature: "3° to 15°C", condition: "sunny" as const, suitable: true },
  { month: "November", temperature: "−1° to 12°C", condition: "sunny" as const, suitable: true },
  { month: "December", temperature: "−7° to 8°C", condition: "snowy" as const, suitable: false }
];

const culturalHighlights = [
  {
    title: "Tamang Villages",
    description: "Experience the hospitality and culture of the Tamang people in villages like Gatlang, Tatopani, Thuman, and Briddim.",
    icon: Users
  },
  {
    title: "Buddhist Monasteries",
    description: "Visit ancient monasteries such as the ones in Kyanjin Gompa and Briddim to learn about Tamang beliefs and practices.",
    icon: Heart
  },
  {
    title: "Folk Music & Dance",
    description: "If your trek coincides with local celebrations, you may witness traditional Tamang folk performances.",
    icon: Utensils
  }
];

const LangtangHimalTrek = () => {
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
            src="/images/trekking/langtang/langtang-1.jpg"
            alt="Langtang Himal Trek"
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
            Langtang Himal Trek
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 italic mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "Exploring Tamang Culture and the Majestic Himalayas"
          </p>
          
          {/* Key info badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 mr-2" />
              <span>14 Days</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Compass className="w-5 h-5 mr-2" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Mountain className="w-5 h-5 mr-2" />
              <span>3,870m</span>
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
                  The Langtang Himal Trek is an immersive adventure that takes you deep into the heart 
                  of the Langtang Valley, offering not only spectacular mountain vistas but also a 
                  unique cultural experience. This trek is an opportunity to explore the traditions, 
                  customs, and way of life of the Tamang people, the indigenous ethnic group of this 
                  region. The trek includes visits to traditional Tamang villages, ancient Buddhist 
                  monasteries, and an immersion in local Tamang folk music and dance. As you trek 
                  through the Langtang Valley, you will be surrounded by the stunning beauty of the 
                  Langtang Himal, offering some of the most breathtaking views in the region.
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
                  The Langtang Himal Trek offers an incredible opportunity to immerse yourself in 
                  the rich cultural heritage of the Tamang people. During the trek, you will pass 
                  through several Tamang villages, where you will witness their unique way of life 
                  and have the chance to experience their traditional music, dance, and spiritual 
                  practices. You will also visit Buddhist monasteries, such as the one in Briddim, 
                  which are central to Tamang culture. This trek is not just a journey through stunning 
                  landscapes but also a deep cultural exploration.
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
                        <p className="text-heritage-brown/70">14 Days</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mountain className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Difficulty</h4>
                        <p className="text-heritage-brown/70">Moderate</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Compass className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Maximum Altitude</h4>
                        <p className="text-heritage-brown/70">3,870m (Kyanjin Gompa)</p>
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
                        <span className="text-sm text-heritage-brown/80">Warm and waterproof clothing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Hiking boots and trekking poles</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Sleeping bag and comfortable clothes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Personal medications and first aid kit</span>
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

export default LangtangHimalTrek;