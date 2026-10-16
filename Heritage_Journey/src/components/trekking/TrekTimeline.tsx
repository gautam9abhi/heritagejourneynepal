import { Clock, MapPin, Mountain, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TimelineDay {
  day: number;
  title: string;
  description: string;
  elevation?: string;
  distance?: string;
  duration?: string;
  highlights?: string[];        // New: Optional highlights
}

interface TrekTimelineProps {
  days: TimelineDay[];
  className?: string;
  trekName?: string;            // Added for better context
}

export const TrekTimeline = ({ 
  days, 
  className,
  trekName = "Trek" 
}: TrekTimelineProps) => {
  
  const [activeDay, setActiveDay] = useState<number>(1);

  const activeDayData = days.find(day => day.day === activeDay);

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-heritage-brown">
          Detailed Itinerary
        </h2>
        <p className="text-heritage-brown/70 text-sm md:text-base">
          {days.length} Days • {trekName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar - Day List */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xl font-semibold text-heritage-brown mb-5 flex items-center gap-2">
              <Mountain className="w-5 h-5 text-heritage-purple" />
              Itinerary Overview
            </h3>

            <ScrollArea className="h-[520px] pr-3">
              <div className="space-y-2">
                {days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveDay(day.day)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-all duration-300 group",
                      activeDay === day.day
                        ? "bg-heritage-brown text-white shadow-md"
                        : "hover:bg-gray-50 border border-transparent hover:border-gray-200"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-full text-base font-semibold transition-colors",
                          activeDay === day.day
                            ? "bg-white text-heritage-brown"
                            : "bg-gray-100 text-heritage-brown group-hover:bg-heritage-brown/10"
                        )}>
                          {day.day}
                        </div>
                        <div>
                          <p className="font-medium leading-tight">
                            {day.title}
                          </p>
                          <p className="text-xs opacity-75 mt-0.5">
                            Day {day.day}
                          </p>
                        </div>
                      </div>
                      <ChevronRight 
                        className={cn(
                          "w-5 h-5 transition-transform",
                          activeDay === day.day ? "opacity-100" : "opacity-30 group-hover:opacity-60"
                        )} 
                      />
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content - Day Details */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
            {activeDayData && (
              <div className="space-y-8">
                {/* Day Header */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-heritage-purple/10 text-heritage-purple px-4 py-1.5 rounded-full text-sm font-medium mb-3">
                    Day {activeDayData.day}
                  </div>
                  <h3 className="text-3xl font-bold text-heritage-brown leading-tight">
                    {activeDayData.title}
                  </h3>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeDayData.elevation && (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                      <Mountain className="w-8 h-8 text-heritage-purple" />
                      <div>
                        <p className="text-xs text-gray-500">Elevation</p>
                        <p className="font-semibold text-heritage-brown">{activeDayData.elevation}</p>
                      </div>
                    </div>
                  )}

                  {activeDayData.distance && (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                      <MapPin className="w-8 h-8 text-heritage-purple" />
                      <div>
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="font-semibold text-heritage-brown">{activeDayData.distance}</p>
                      </div>
                    </div>
                  )}

                  {activeDayData.duration && (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                      <Clock className="w-8 h-8 text-heritage-purple" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-semibold text-heritage-brown">{activeDayData.duration}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="prose prose-stone max-w-none text-[17px] leading-relaxed text-heritage-brown/80">
                  <p>{activeDayData.description}</p>
                </div>

                {/* Highlights (if provided) */}
                {activeDayData.highlights && activeDayData.highlights.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-heritage-brown mb-3">Highlights of the Day</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeDayData.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-heritage-brown/80">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-heritage-purple flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};