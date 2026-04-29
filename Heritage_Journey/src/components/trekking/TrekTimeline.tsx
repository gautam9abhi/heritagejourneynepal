
import { Clock, MapPin, Mountain } from "lucide-react";
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
}

interface TrekTimelineProps {
  days: TimelineDay[];
  className?: string;
}

export const TrekTimeline = ({ days, className }: TrekTimelineProps) => {
  const [activeDay, setActiveDay] = useState<number>(1);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {/* Day selection sidebar */}
      <div className="md:col-span-1 bg-muted rounded-lg p-4">
        <h3 className="text-xl font-bold text-heritage-brown mb-4">Itinerary</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {days.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={cn(
                  "w-full text-left p-3 rounded-md transition-all duration-300",
                  activeDay === day.day
                    ? "bg-heritage-brown text-white shadow-md"
                    : "hover:bg-heritage-brown/10"
                )}
              >
                <div className="flex items-center">
                  <span className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mr-3",
                    activeDay === day.day
                      ? "bg-white text-heritage-brown"
                      : "bg-heritage-brown/10 text-heritage-brown"
                  )}>
                    {day.day}
                  </span>
                  <span className="font-medium">{day.title}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Day details */}
      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
        {days.map((day) => (
          <div
            key={day.day}
            className={cn(
              "transition-opacity duration-500",
              activeDay === day.day ? "block opacity-100" : "hidden opacity-0"
            )}
          >
            <div className="border-l-4 border-heritage-purple pl-4">
              <h3 className="text-xl md:text-2xl font-bold text-heritage-brown mb-2">
                Day {day.day}: {day.title}
              </h3>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-heritage-brown/80">
                {day.elevation && (
                  <div className="flex items-center">
                    <Mountain className="w-4 h-4 mr-1 text-heritage-purple" />
                    <span>{day.elevation}</span>
                  </div>
                )}
                {day.distance && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-heritage-purple" />
                    <span>{day.distance}</span>
                  </div>
                )}
                {day.duration && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-heritage-purple" />
                    <span>{day.duration}</span>
                  </div>
                )}
              </div>
              
              <div className="prose prose-stone max-w-none text-heritage-brown/80">
                <p>{day.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
