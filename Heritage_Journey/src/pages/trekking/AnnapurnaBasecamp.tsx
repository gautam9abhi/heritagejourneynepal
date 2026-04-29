
import { useRef, useState, useEffect } from 'react';  
import { Utensils, Mountain, Clock, Calendar, ArrowUpRight, Users, Compass, BookOpen, MapPin, Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VerticalTrekTimeline } from '@/components/trekking/VerticalTrekTimeline';
import { TrekHighlights } from '@/components/trekking/TrekHighlights';
import { TrekGallery } from '@/components/trekking/TrekGallery';
import { TrekWeather } from '@/components/trekking/TrekWeather';

interface DayItinerary {
  day: number;
  title: string;
  overview: string;
  walkingTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

const itinerary: DayItinerary[] = [
  {
    day: 1,
    title: "Arrival in Kathmandu",
    overview: "Arrive in Kathmandu and transfer to your hotel. Spend the rest of the day exploring the city.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 2,
    title: "Drive to Pokhara",
    overview: "Enjoy the scenic drive from Kathmandu to Pokhara (6-7 hours). Take in views of the countryside, rivers, and hills along the way.",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 3,
    title: "Trek to Tikhedhunga",
    overview: "Drive to Nayapul (1.5 hours) and start trekking to Tikhedhunga (1,540m). The trek is 4-5 hours long, passing through Birethanti.",
    walkingTime: "4-5 hours",
    difficulty: "Easy"
  },
  {
    day: 4,
    title: "Trek to Ghorepani",
    overview: "Trek from Tikhedhunga to Ghorepani (2,850m). Expect a 6-7 hour trek, including a steep climb with around 3,000 steps.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 5,
    title: "Trek to Tadapani",
    overview: "Wake up early to hike to Poon Hill (3,210m) to witness the sunrise over the Annapurna and Dhaulagiri ranges. Continue to Tadapani (2,610m).",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 6,
    title: "Trek to Chhomrong",
    overview: "Trek to Chhomrong (2,170m), located at the base of the Annapurna Sanctuary. The trek is 5-6 hours, with a steep descent followed by a steep climb.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 7,
    title: "Trek to Dovan",
    overview: "Trek from Chhomrong to Dovan (2,600m), a small village located in a beautiful valley.",
    walkingTime: "6-7 hours",
    difficulty: "Moderate"
  },
  {
    day: 8,
    title: "Trek to Deurali",
    overview: "Trek to Deurali (3,200m), a small village located at the base of the Machhapuchhre (Fishtail) Mountain.",
    walkingTime: "4-5 hours",
    difficulty: "Moderate"
  },
  {
    day: 9,
    title: "Trek to Annapurna Base Camp",
    overview: "Trek to Annapurna Base Camp (4,130m), surrounded by towering peaks like Annapurna South, Machhapuchhre, and Hiunchuli.",
    walkingTime: "5-6 hours",
    difficulty: "Challenging"
  },
  {
    day: 10,
    title: "Trek to Bamboo",
    overview: "After a sunrise view at Annapurna Base Camp, trek back to Bamboo (2,310m).",
    walkingTime: "7-8 hours",
    difficulty: "Moderate"
  },
  {
    day: 11,
    title: "Trek to Jhinu Danda",
    overview: "Trek to Jhinu Danda (1,780m), famous for its natural hot springs.",
    walkingTime: "5-6 hours",
    difficulty: "Moderate"
  },
  {
    day: 12,
    title: "Trek to Nayapul and Drive to Pokhara",
    overview: "Trek back to Nayapul (3-4 hours), then drive back to Pokhara (1.5 hours).",
    walkingTime: "3-4 hours",
    difficulty: "Easy"
  },
  {
    day: 13,
    title: "Drive to Kathmandu",
    overview: "Drive from Pokhara to Kathmandu (6-7 hours).",
    walkingTime: "N/A",
    difficulty: "Easy"
  },
  {
    day: 14,
    title: "Departure from Kathmandu",
    overview: "Transfer to the airport for your flight home.",
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

const sampleHighlights = [
  "Spectacular panoramic views of the Annapurna mountain range",
  "Sunrise view from Poon Hill overlooking the Himalayas",
  "Diverse landscapes from lush forests to alpine meadows",
  "Cultural immersion in traditional Gurung and Magar villages",
  "Natural hot springs in Jhinu Danda to relax tired muscles",
  "Reaching the iconic Annapurna Base Camp at 4,130m",
  "Walking through beautiful rhododendron forests (in bloom during spring)",
  "Views of numerous peaks over 7,000m including Annapurna I"
];

const sampleGalleryImages = [
  {
    src: "/images/trekking/abc/annapurna-base-camp.jpg",
    alt: "Annapurna Base Camp"
  },
  {
    src: "/images/trekking/abc/abc-2.jpg",
    alt: "Mountain views along the trek"
  },
  {
    src: "/images/trekking/abc/abc-3.jpg",
    alt: "Himalayan landscapes"
  },
  {
    src: "/images/trekking/abc/abc-4.jpg",
    alt: "Traditional villages"
  },
  {
    src: "/images/trekking/abc/abc-5.jpg",
    alt: "Local culture"
  }
];

const sampleWeatherData = [
  { month: "January", temperature: "−5° to 10°C", condition: "snowy" as const, suitable: false },
  { month: "February", temperature: "−3° to 12°C", condition: "snowy" as const, suitable: false },
  { month: "March", temperature: "0° to 15°C", condition: "mixed" as const, suitable: true },
  { month: "April", temperature: "5° to 17°C", condition: "cloudy" as const, suitable: true },
  { month: "May", temperature: "7° to 20°C", condition: "cloudy" as const, suitable: true },
  { month: "June", temperature: "10° to 22°C", condition: "rainy" as const, suitable: false },
  { month: "July", temperature: "12° to 22°C", condition: "rainy" as const, suitable: false },
  { month: "August", temperature: "12° to 22°C", condition: "rainy" as const, suitable: false },
  { month: "September", temperature: "10° to 20°C", condition: "mixed" as const, suitable: true },
  { month: "October", temperature: "5° to 18°C", condition: "sunny" as const, suitable: true },
  { month: "November", temperature: "0° to 15°C", condition: "sunny" as const, suitable: true },
  { month: "December", temperature: "−3° to 12°C", condition: "snowy" as const, suitable: false }
];

const culturalHighlights = [
  {
    title: "Ghandruk Village",
    description: "A traditional Gurung village known for its stunning mountain views and culture.",
    icon: Users
  },
  {
    title: "Monasteries & Temples",
    description: "Experience the spirituality of the region through local temples and shrines.",
    icon: Heart
  },
  {
    title: "Local Food",
    description: "Taste authentic Nepali dishes like dal bhat, momos, and sweet Newari treats.",
    icon: Utensils
  }
];

const AnnapurnaBaseCamp = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const overviewRef = useRef<HTMLDivElement>(null);

  const scrollToOverview = () => {
    overviewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-100';
      case 'Moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Challenging':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout>
      {/* Hero Section with Parallax Effect */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/trekking/abc/annapurna-base-camp.jpg"
            alt="Annapurna Base Camp"
            className="w-full h-full object-cover transform scale-110 animate-[slow-pan_30s_ease-in-out_infinite_alternate]"
            style={{ transformOrigin: "center center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>

        <div className="container-custom relative z-10 text-center text-white py-32">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            Annapurna Base Camp Trek
          </h1>
          <p
            className="text-xl md:text-2xl text-white/90 italic mb-8 animate-fade-in"
            style={{
              animationDelay: "0.2s",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            "Into the Shadow of Giants"
          </p>

          {/* Key info badges */}
          <div
            className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
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
              <span>4,130m</span>
            </div>
            <div className="flex items-center bg-white/80 text-black px-4 py-2 rounded-full">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Mar-May, Sep-Nov</span>
            </div>
          </div>          <div
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
            <div className="lg:col-span-2">              {/* Overview Section */}
              <div ref={overviewRef} className="prose prose-lg max-w-none mb-12 scroll-mt-24">
                <h2 className="text-3xl font-bold text-heritage-brown mb-6">
                  Trek Overview
                </h2>
                <p className="text-heritage-brown/80 leading-relaxed">
                  The Annapurna Base Camp Trek is one of the most iconic and
                  accessible treks in Nepal. This trek takes you through lush
                  forests, traditional villages, and scenic terraces,
                  culminating at the stunning Annapurna Base Camp, surrounded by
                  snow-capped peaks. Along the way, you'll experience the
                  culture of ethnic groups such as the Gurungs, Magars, and
                  Thakalis, whose hospitality and heritage make this journey
                  unforgettable.
                </p>
              </div>

              {/* Trek Gallery */}
              <div className="mb-16">
                <TrekGallery images={sampleGalleryImages} />
              </div>

              {/* Trek Highlights Section */}
              <div className="mb-16">
                <TrekHighlights highlights={sampleHighlights} />
              </div>

              {/* Itinerary Section - NEW VERTICAL TIMELINE */}
              <div className="bg-white rounded-lg p-6 shadow-md mb-16">
                <h2 className="text-3xl font-bold text-heritage-brown mb-6">
                  Daily Itinerary
                </h2>
                <VerticalTrekTimeline days={timelineData} />
              </div>

              {/* Weather Information */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-heritage-brown mb-6">
                  Weather & Best Time to Visit
                </h2>
                <TrekWeather months={sampleWeatherData} />
              </div>

              {/* Cultural Section */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-3xl font-bold text-heritage-brown mb-6">
                  Cultural Immersion
                </h2>
                <p className="text-heritage-brown/80 mb-8">
                  Experience the rich cultural heritage of Nepal as you pass
                  through traditional Gurung, Magar, and Thakali villages along
                  the Annapurna trail. Visit ancient Buddhist monasteries, like
                  the one in Ghandruk, and meet the warm, welcoming people of
                  the region.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {culturalHighlights.map((highlight, index) => {
                    const Icon = highlight.icon;
                    return (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="w-12 h-12 bg-heritage-purple/10 rounded-full flex items-center justify-center mb-4">
                            <Icon className="h-6 w-6 text-heritage-purple" />
                          </div>
                          <h3 className="font-semibold text-heritage-brown mb-2">
                            {highlight.title}
                          </h3>
                          <p className="text-heritage-brown/70 text-sm">
                            {highlight.description}
                          </p>
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
                        <h4 className="font-medium text-heritage-brown">
                          Duration
                        </h4>
                        <p className="text-heritage-brown/70">12-14 Days</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mountain className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">
                          Difficulty
                        </h4>
                        <p className="text-heritage-brown/70">Moderate</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Compass className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">
                          Maximum Altitude
                        </h4>
                        <p className="text-heritage-brown/70">
                          4,130m (Annapurna Base Camp)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-heritage-purple shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-heritage-brown">
                          Best Time to Trek
                        </h4>
                        <p className="text-heritage-brown/70">
                          March - May, September - November
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* What to Pack Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-heritage-brown mb-4">
                      What to Pack
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">
                          ✓
                        </span>
                        <span className="text-sm text-heritage-brown/80">
                          Layers of clothing
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">
                          ✓
                        </span>
                        <span className="text-sm text-heritage-brown/80">
                          Waterproof jacket and pants
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">
                          ✓
                        </span>
                        <span className="text-sm text-heritage-brown/80">
                          Sturdy hiking boots
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-heritage-purple text-white rounded-full mr-2 flex-shrink-0 mt-1">
                          ✓
                        </span>
                        <span className="text-sm text-heritage-brown/80">
                          Sleeping bag (rated for 0°C)
                        </span>
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

export default AnnapurnaBaseCamp;
