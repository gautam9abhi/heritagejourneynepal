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
    overview: "Arrive in Kathmandu and transfer to your hotel. Spend the day exploring the city's temples, shrines, and bustling markets.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 2,
    title: "Kathmandu to Lukla and Trek to Phakding",
    overview: "Take an early morning flight from Kathmandu to Lukla, a small town in the Everest region. From there, trek to Phakding, a scenic village along the Dudh Kosi River.",
    walkingTime: "3-4 hours",
    difficulty: "Easy"
  },
  {
    day: 3,
    title: "Trek to Namche Bazaar",
    overview: "Trek from Phakding to Namche Bazaar, the gateway to the Khumbu region. This Sherpa town offers stunning views of the surrounding mountains and is a perfect place to witness the local culture.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 4,
    title: "Acclimatization Day in Namche Bazaar",
    overview: "Spend the day in Namche Bazaar to acclimatize. Visit the local Sherpa Museum, explore the market, and enjoy views of Everest, Lhotse, and Ama Dablam.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 5,
    title: "Trek to Tengboche",
    overview: "Trek from Namche Bazaar to Tengboche, passing through beautiful forests of rhododendron and juniper. Tengboche offers stunning views of Mount Everest, Ama Dablam, and other peaks. Visit the Tengboche Monastery, the largest in the region.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 6,
    title: "Trek to Dingboche",
    overview: "Trek from Tengboche to Dingboche, a village nestled in a valley surrounded by spectacular mountain views. This is a quiet village where you can relax and enjoy the beauty of the Khumbu region.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 7,
    title: "Acclimatization Day in Dingboche",
    overview: "Spend the day acclimatizing in Dingboche. You can take a hike to nearby hills for better views of Everest, Lhotse, and Makalu. This helps your body adjust to the higher altitude.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 8,
    title: "Trek to Lobuche",
    overview: "Trek from Dingboche to Lobuche, a small settlement near the Khumbu Glacier. Along the way, enjoy amazing views of several Himalayan peaks, including Everest, Pumori, and Nuptse.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 9,
    title: "Trek to Gorak Shep and Everest Base Camp",
    overview: "Trek from Lobuche to Gorak Shep, a small village located at the foot of Kala Patthar. After lunch, continue to Everest Base Camp, a breathtaking site surrounded by towering Himalayan peaks. Celebrate the accomplishment of reaching the base camp of the world's highest mountain.",
    walkingTime: "7-8 hours",
    difficulty: "Challenging"
  },
  {
    day: 10,
    title: "Hike to Kala Patthar and Trek to Pheriche",
    overview: "Early in the morning, hike to Kala Patthar for a stunning sunrise view of Mount Everest and the surrounding peaks. Afterward, descend to Pheriche, a beautiful village at a lower altitude.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 11,
    title: "Trek to Namche Bazaar",
    overview: "Trek from Pheriche to Namche Bazaar, retracing your steps through the scenic route and passing through beautiful villages and forests.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 12,
    title: "Trek to Lukla",
    overview: "Trek from Namche Bazaar back to Lukla. This will be your last day on the trail, and you can enjoy the final views of the Everest region.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 13,
    title: "Fly Back to Kathmandu",
    overview: "Take an early morning flight from Lukla back to Kathmandu. After arriving in Kathmandu, transfer to your hotel and relax. Spend the rest of the day exploring the city or shopping for souvenirs.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 14,
    title: "Departure",
    overview: "Transfer to the airport for your departure flight back home.",
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
  "Stand at the base of the world's highest mountain",
  "Experience traditional Sherpa culture in Namche Bazaar",
  "Panoramic sunrise views from Kala Patthar (5,545m)",
  "Visit Tengboche Monastery, the largest in the Khumbu region",
  "Trek through the iconic Khumbu Glacier",
  "Breathtaking views of Everest, Lhotse, Nuptse, and Ama Dablam",
  "Scenic flight to Lukla, the gateway to Everest",
  "Immerse yourself in the rich Sherpa culture and spirituality"
];

const sampleGalleryImages = [
  {
    src: "/images/trekking/ebc/everest-1.jpg",
    alt: "Everest Base Camp Trek panorama"
  },
  {
    src: "/images/trekking/ebc/everest-2.jpg",
    alt: "Mountain views along the trek"
  },
  {
    src: "/images/trekking/ebc/everest-3.jpg",
    alt: "Himalayan landscapes"
  },
  {
    src: "/images/trekking/ebc/everest-4.jpg",
    alt: "Traditional villages"
  },
  {
    src: "/images/trekking/ebc/everest-5.jpg",
    alt: "Local culture"
  }
];

const weatherData = [
  { month: "January", temperature: "−15° to 0°C", condition: "snowy" as const, suitable: false },
  { month: "February", temperature: "−12° to 2°C", condition: "snowy" as const, suitable: false },
  { month: "March", temperature: "−10° to 7°C", condition: "mixed" as const, suitable: true },
  { month: "April", temperature: "−5° to 10°C", condition: "cloudy" as const, suitable: true },
  { month: "May", temperature: "0° to 15°C", condition: "cloudy" as const, suitable: true },
  { month: "June", temperature: "5° to 17°C", condition: "rainy" as const, suitable: false },
  { month: "July", temperature: "7° to 18°C", condition: "rainy" as const, suitable: false },
  { month: "August", temperature: "7° to 18°C", condition: "rainy" as const, suitable: false },
  { month: "September", temperature: "2° to 15°C", condition: "mixed" as const, suitable: true },
  { month: "October", temperature: "−3° to 12°C", condition: "sunny" as const, suitable: true },
  { month: "November", temperature: "−8° to 8°C", condition: "sunny" as const, suitable: true },
  { month: "December", temperature: "−12° to 3°C", condition: "snowy" as const, suitable: false }
];

const culturalHighlights = [
  {
    title: "Sherpa Villages",
    description: "Experience the traditional way of life in villages like Namche Bazaar and Dingboche.",
    icon: Users
  },
  {
    title: "Tengboche Monastery",
    description: "Visit the largest monastery in the Khumbu region and witness the Sherpas' spiritual connection to Everest.",
    icon: Heart
  },
  {
    title: "Local Cuisine",
    description: "Enjoy authentic Sherpa dishes such as dal bhat, sherpa stew, and yak cheese.",
    icon: Utensils
  }
];

const EverestBaseCampTrek = () => {
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
            src="/images/trekking/ebc/everest-3.jpg"
            alt="Everest Base Camp Trek"
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
            Everest Base Camp Trek
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 italic mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "Journey to The Roof of The World"
          </p>
          
          {/* Key info badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 mr-2" />
              <span>14 Days</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Compass className="w-5 h-5 mr-2" />
              <span>Moderate to Challenging</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Mountain className="w-5 h-5 mr-2" />
              <span>5,364m</span>
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
                  The Everest Base Camp Trek is a thrilling adventure that not only challenges you physically 
                  but also immerses you in the rich Sherpa culture. As you make your way to the base camp of the 
                  world's tallest mountain, you will encounter traditional Sherpa villages like Namche Bazaar 
                  and Dingboche, where you can interact with the locals and experience their way of life. 
                  The trek also offers visits to stunning monasteries such as Tengboche, the largest in the 
                  region, where you will witness the deep spiritual connection the Sherpa people share with 
                  the mountains. This journey combines awe-inspiring natural beauty with an enriching cultural 
                  experience, making it one of the most iconic treks in the world.
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
                  The Everest Base Camp Trek offers an extraordinary opportunity to immerse yourself 
                  in the rich culture and spirituality of the Sherpa people. Along the way, you will 
                  visit ancient monasteries, traditional Sherpa villages, and interact with locals 
                  who have a deep spiritual connection with the mountains.
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
                        <p className="text-heritage-brown/70">Moderate to Challenging</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Compass className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">Maximum Altitude</h4>
                        <p className="text-heritage-brown/70">5,364m (Everest Base Camp)</p>
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
                        <span className="text-sm text-heritage-brown/80">Thermal layers for extreme cold</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Waterproof jacket and pants</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">High-quality hiking boots</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">✓</span>
                        <span className="text-sm text-heritage-brown/80">Down jacket and sleeping bag (-20°C)</span>
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

export default EverestBaseCampTrek;