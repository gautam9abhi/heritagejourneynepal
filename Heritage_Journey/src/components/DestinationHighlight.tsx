import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  ArrowRight, MapPin, Mountain, Utensils, Hotel, 
  Calendar, Languages, Plane, Camera, Info, 
  Menu, Clock, Thermometer, Currency
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Destination = {
  id: string;
  name: string;
  image: string;
  description: string;
  content?: {
    attractions: string[];
    adventure: string[];
    culture: string[];
    food: string[];
    accommodation: string;
    safety: string;
    bestTimeToVisit: string;
    visa: string;
    language: string;
    currency: string;
    transportation: string;
    permits: string;
    healthAndSafety: string;
    photography: string;
  };
};

interface SeasonInfo {
  name: string;
  months: string[];
  weather: string;
  activities: string[];
  rating: number;
}

const seasons: { [key: string]: SeasonInfo[] } = {
  nepal: [
    {
      name: 'Spring',
      months: ['March', 'April', 'May'],
      weather: 'Mild temperatures, clear skies',
      activities: ['Trekking', 'Cultural Tours', 'Wildlife Safari'],
      rating: 5
    },
    {
      name: 'Summer/Monsoon',
      months: ['June', 'July', 'August'],
      weather: 'Warm and rainy',
      activities: ['Cultural visits', 'City tours'],
      rating: 3
    },
    {
      name: 'Autumn',
      months: ['September', 'October', 'November'],
      weather: 'Clear skies, perfect visibility',
      activities: ['Trekking', 'Festivals', 'Photography'],
      rating: 5
    },
    {
      name: 'Winter',
      months: ['December', 'January', 'February'],
      weather: 'Cold in mountains, mild in lowlands',
      activities: ['Winter treks', 'Cultural tours'],
      rating: 4
    }
  ],
  tibet: [
    {
      name: 'Spring',
      months: ['April', 'May'],
      weather: 'Mild temperatures, occasional wind',
      activities: ['Cultural tours', 'Monastery visits'],
      rating: 4
    },
    {
      name: 'Summer',
      months: ['June', 'July', 'August'],
      weather: 'Warm days, occasional rain',
      activities: ['Trekking', 'Festivals', 'Photography'],
      rating: 5
    },
    {
      name: 'Autumn',
      months: ['September', 'October'],
      weather: 'Clear skies, cooling temperatures',
      activities: ['Trekking', 'Photography', 'Cultural tours'],
      rating: 5
    },
    {
      name: 'Winter',
      months: ['November', 'December', 'January', 'February', 'March'],
      weather: 'Cold, possible snow',
      activities: ['Winter photography', 'City tours'],
      rating: 3
    }
  ]
};

const destinations: Destination[] = [
  {
    id: 'nepal',
    name: 'Nepal',
    image: 'kathmandu_highlight.jpg',
    description: 'Explore the breathtaking mountains and rich cultural heritage',
    content: {
      attractions: [
        'Mount Everest',
        'Kathmandu Durbar Square',
        'Bhaktapur Durbar Square',
        'Patan Durbar Square',
        'Pashupatinath Temple',
        'Swayambhunath Stupa (Monkey Temple)',
        'Boudhanath Stupa',
        'Chitwan National Park',
        'Pokhara'
      ],
      adventure: [
        'Trekking',
        'Hiking',
        'Mountaineering',
        'White-water rafting',
        'Kayaking',
        'Bungee jumping',
        'Paragliding',
        'Mountain biking'
      ],
      culture: [
        'Dashain Festival',
        'Tihar Festival',
        'Holi Festival',
        'Nepali New Year'
      ],
      food: [
        'Dal Bhat (rice and lentil soup)',
        'Momos (dumplings)',
        'Thakali cuisine',
        'Newari cuisine'
      ],
      accommodation: 'Options range from budget guesthouses to luxury hotels, including tea houses during treks, boutique hotels, and resorts in Pokhara.',
      safety: 'Nepal is generally safe for travelers. Travel with guides in remote areas and carry sufficient cash.',
      bestTimeToVisit: 'September to November and March to May offer pleasant weather and clear mountain views.',
      visa: 'Visitors need to obtain a visa prior to arrival or on arrival at Tribhuvan International Airport.',
      language: 'Nepali is the official language, but English is widely spoken in tourist areas.',
      currency: 'Nepalese Rupee (NPR). Major credit cards accepted in tourist areas, but carry cash for remote locations.',
      transportation: 'Options include private cars, buses, taxis, and domestic flights. Remote areas may have limited accessibility.',
      permits: 'Trekking permits required for popular areas like Everest Base Camp and Annapurna Circuit.',
      healthAndSafety: 'Be aware of altitude sickness risks and maintain food/water hygiene. Take appropriate safety measures during activities.',
      photography: 'Rich photography opportunities. Always ask permission before photographing people.'
    }
  },
  {
    id: 'tibet',
    name: 'Tibet',
    image: 'tibet.jpg',
    description: 'Experience the mystical land of monasteries and stunning landscapes',
    content: {
      attractions: [
        'Potala Palace',
        'Jokhang Temple',
        'Norbulingka Palace',
        'Yamdrok Lake',
        'Mount Kailash',
        'Tashilhunpo Monastery',
        'Sera Monastery',
        'Barkhor Street',
        'Tibetan Plateau'
      ],
      adventure: [
        'Everest Base Camp Trek',
        'Monastery Exploration',
        'Mountain Biking',
        'Horseback Riding',
        'Tibetan Plateau Hiking',
        'Meditation Retreats',
        'Sacred Sites Visits',
        'High-Altitude Lake Tours'
      ],
      culture: [
        'Losar (Tibetan New Year)',
        'Saga Dawa Festival',
        'Monlam Prayer Festival',
        'Thangka Painting',
        'Tibetan Music',
        'Traditional Crafts'
      ],
      food: [
        'Tsampa (roasted barley flour)',
        'Momos (dumplings)',
        'Thukpa (noodle soup)',
        'Butter Tea (Po Cha)',
        'Yak Meat Dishes',
        'Traditional Dairy Products'
      ],
      accommodation: 'Options include basic guesthouses, monastery stays, luxury hotels, eco-friendly resorts, and local Tibetan homestays. Various choices available depending on your preferred experience.',
      safety: 'Generally safe for tourists, but preparation for high-altitude conditions is crucial. Follow local regulations and stay informed about the political situation.',
      bestTimeToVisit: 'May to October offers milder weather and better accessibility to remote areas. Winter months can be extremely cold with limited access.',
      visa: 'Special Tibet Travel Permit required, obtainable only through registered Chinese travel agencies. Chinese visa needed before Tibet permit application.',
      language: 'Tibetan is the official language, with Mandarin Chinese widely used in cities. English is less common in remote areas.',
      currency: 'Chinese Yuan (CNY). Credit cards accepted in major cities, but cash is recommended for remote areas where ATMs are scarce.',
      transportation: 'Access via flights to Lhasa, then trains, private cars, or buses within Tibet. Some areas require special transportation arrangements through licensed agencies.',
      permits: 'Tibet Travel Permit mandatory, with additional permits required for restricted areas like Mount Kailash and border regions. All travel must be arranged through licensed agencies.',
      healthAndSafety: 'Altitude sickness precautions essential. Stay hydrated, avoid initial strenuous activity, and maintain food/water hygiene. Consult doctor before travel if concerned.',
      photography: 'Rich photography opportunities of landscapes and culture. Always seek permission for photographing people and respect restrictions at religious sites.'
    }
  }
];

const DestinationHighlight = () => {
  const [activeDestination, setActiveDestination] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [visitorCount, setVisitorCount] = useState(0);
  const [attractionCount, setAttractionCount] = useState(0);

  useEffect(() => {
    if (selectedDestination && isDialogOpen) {
      const visitors = selectedDestination.id === 'nepal' ? 1200000 : 800000;
      const attractions = selectedDestination.content?.attractions.length || 0;
      
      const visitorInterval = setInterval(() => {
        setVisitorCount(prev => {
          const next = prev + 50000;
          if (next >= visitors) {
            clearInterval(visitorInterval);
            return visitors;
          }
          return next;
        });
      }, 50);

      const attractionInterval = setInterval(() => {
        setAttractionCount(prev => {
          const next = prev + 1;
          if (next >= attractions) {
            clearInterval(attractionInterval);
            return attractions;
          }
          return next;
        });
      }, 200);

      return () => {
        clearInterval(visitorInterval);
        clearInterval(attractionInterval);
      };
    }
  }, [selectedDestination, isDialogOpen]);

  const handleViewMore = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsDialogOpen(true);
    setVisitorCount(0);
    setAttractionCount(0);
    setActiveTab('overview');
  };

  return (
    <>
      <section className="py-12 relative overflow-hidden">
        <div className="container-custom">
          <h2 className="section-title text-center mb-8">Explore Our Destinations</h2>
          <p className="section-subtitle text-center">
            Discover the beauty and culture of the Himalayan region
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 relative z-10">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="relative h-[400px] overflow-hidden rounded-lg group"
                onMouseEnter={() => setActiveDestination(destination.id)}
                onMouseLeave={() => setActiveDestination(null)}
              >
                <div 
                  className={cn(
                    "absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out",
                    activeDestination === destination.id ? "scale-110 blur-[2px]" : "scale-100"
                  )}
                  style={{ backgroundImage: `url(${destination.image})` }}
                />
                
                <div 
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-heritage-brown/80 via-heritage-brown/40 to-transparent transition-opacity duration-500",
                    activeDestination === destination.id ? "opacity-90" : "opacity-40"
                  )}
                />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white transition-all duration-500 z-10">
                  <h3 
                    className={cn(
                      "text-6xl font-extrabold mb-6 transition-all duration-500 text-white font-serif tracking-wider transform",
                      activeDestination === destination.id 
                        ? "translate-y-0 opacity-100 scale-110" 
                        : "translate-y-8 opacity-0 scale-95"
                    )}
                  >
                    {destination.name}
                  </h3>
                  <p 
                    className={cn(
                      "mb-4 transition-all duration-500 opacity-0 transform translate-y-4 text-center max-w-md",
                      activeDestination === destination.id ? "opacity-100 translate-y-0" : ""
                    )}
                  >
                    {destination.description}
                  </p>
                  <div 
                    className={cn(
                      "transition-all duration-500 opacity-0 transform translate-y-4",
                      activeDestination === destination.id ? "opacity-100 translate-y-0" : ""
                    )}
                  >
                    <Button 
                      variant="outline" 
                      className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-heritage-brown transition-all duration-300"
                      onClick={() => handleViewMore(destination)}
                    >
                      View More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          {selectedDestination?.content && (
            <>
              <div className="relative h-[300px] overflow-hidden">
                <img
                  src={selectedDestination.image}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <h2 className="text-4xl font-bold mb-4 text-white">{selectedDestination.name}</h2>
                  <p className="text-white/90 text-2xl font-semibold font-serif tracking-wide max-w-3xl mx-auto leading-relaxed">
                    {selectedDestination.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-heritage-brown/5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-heritage-brown">{visitorCount.toLocaleString()}</div>
                  <div className="text-sm text-heritage-brown/70">Annual Visitors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-heritage-brown">{attractionCount}</div>
                  <div className="text-sm text-heritage-brown/70">Major Attractions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-heritage-brown">
                    {selectedDestination.content.culture.length}
                  </div>
                  <div className="text-sm text-heritage-brown/70">Cultural Festivals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-heritage-brown">
                    {selectedDestination.content.adventure.length}
                  </div>
                  <div className="text-sm text-heritage-brown/70">Adventures</div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
                <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
                  <TabsTrigger 
                    value="overview"
                    className="data-[state=active]:bg-heritage-brown data-[state=active]:text-white"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="attractions"
                    className="data-[state=active]:bg-heritage-brown data-[state=active]:text-white"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Attractions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="planning"
                    className="data-[state=active]:bg-heritage-brown data-[state=active]:text-white"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Planning
                  </TabsTrigger>
                  <TabsTrigger 
                    value="culture"
                    className="data-[state=active]:bg-heritage-brown data-[state=active]:text-white"
                  >
                    <Menu className="h-4 w-4 mr-2" />
                    Culture
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-heritage-brown flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Best Times to Visit
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {seasons[selectedDestination.id].map((season) => (
                        <Card key={season.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-heritage-brown">{season.name}</h4>
                              <div className="flex">
                                {Array.from({ length: season.rating }).map((_, i) => (
                                  <div 
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-heritage-purple mr-1"
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-heritage-brown/70 space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{season.months.join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4" />
                                <span>{season.weather}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-heritage-brown">Essential Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Languages className="h-5 w-5 text-heritage-purple mt-1" />
                          <div>
                            <div className="font-medium text-heritage-brown">Language</div>
                            <p className="text-sm text-heritage-brown/70">{selectedDestination.content.language}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Currency className="h-5 w-5 text-heritage-purple mt-1" />
                          <div>
                            <div className="font-medium text-heritage-brown">Currency</div>
                            <p className="text-sm text-heritage-brown/70">{selectedDestination.content.currency}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Plane className="h-5 w-5 text-heritage-purple mt-1" />
                          <div>
                            <div className="font-medium text-heritage-brown">Visa Requirements</div>
                            <p className="text-sm text-heritage-brown/70">{selectedDestination.content.visa}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-heritage-brown">Travel Tips</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Hotel className="h-5 w-5 text-heritage-purple mt-1" />
                          <div>
                            <div className="font-medium text-heritage-brown">Accommodation</div>
                            <p className="text-sm text-heritage-brown/70">{selectedDestination.content.accommodation}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Camera className="h-5 w-5 text-heritage-purple mt-1" />
                          <div>
                            <div className="font-medium text-heritage-brown">Photography</div>
                            <p className="text-sm text-heritage-brown/70">{selectedDestination.content.photography}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attractions" className="mt-6 space-y-6 animate-fade-in">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-heritage-brown flex items-center gap-2 mb-6">
                      <MapPin className="h-5 w-5" />
                      <span>Must-Visit Attractions</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedDestination.content.attractions.map((attraction, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-heritage-brown/5">
                              <img
                                src={`/images/destinations/${selectedDestination.id}/${index + 1}.jpg`}
                                alt={attraction}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <h4 className="font-semibold text-heritage-brown mb-2">{attraction}</h4>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-heritage-brown flex items-center gap-2">
                      <Mountain className="h-5 w-5" />
                      Adventure Activities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedDestination.content.adventure.map((activity, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-heritage-brown/10"
                        >
                          <h4 className="font-medium text-heritage-brown">{activity}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="planning" className="mt-6 space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-semibold text-heritage-brown">Transportation</h3>
                        <p className="text-heritage-brown/70">{selectedDestination.content.transportation}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-semibold text-heritage-brown">Required Permits</h3>
                        <p className="text-heritage-brown/70">{selectedDestination.content.permits}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-semibold text-heritage-brown">Health & Safety</h3>
                        <p className="text-heritage-brown/70">{selectedDestination.content.healthAndSafety}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-semibold text-heritage-brown">Safety Information</h3>
                        <p className="text-heritage-brown/70">{selectedDestination.content.safety}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="culture" className="mt-6 space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-heritage-brown">Cultural Festivals</h3>
                      <div className="space-y-4">
                        {selectedDestination.content.culture.map((festival, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-heritage-brown/10"
                          >
                            <h4 className="font-medium text-heritage-brown mb-2">{festival}</h4>
                            <Badge variant="outline" className="text-heritage-purple">
                              Cultural Event
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-heritage-brown flex items-center gap-2">
                        <Utensils className="h-5 w-5" />
                        Local Cuisine
                      </h3>
                      <div className="space-y-4">
                        {selectedDestination.content.food.map((dish, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-heritage-brown/10"
                          >
                            <h4 className="font-medium text-heritage-brown mb-2">{dish}</h4>
                            <Badge variant="outline" className="text-heritage-purple">
                              Traditional Dish
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DestinationHighlight;
