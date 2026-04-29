
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from "framer-motion";
import { Mountain, MapPin, Clock } from "lucide-react";
import "./timeline-custom.css";

interface TimelineDay {
  day: number;
  title: string;
  description: string;
  elevation?: string;
  distance?: string;
  duration?: string;
}

interface VerticalTrekTimelineProps {
  days: TimelineDay[];
  className?: string;
}

export const VerticalTrekTimeline = ({ days, className }: VerticalTrekTimelineProps) => {
  
  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-gray-200";
    
    if (difficulty.includes("Minimal")) {
      return "bg-green-100 text-green-800";
    } else if (difficulty.includes("Moderate")) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };  return (
    <div className={className}>
      <h2 className="text-3xl font-bold text-heritage-brown mb-8 text-center">Trek Journey</h2>
        <VerticalTimeline lineColor="#6A2D91" className="vertical-timeline-custom-line custom-timeline">
        {days.map((day, index) => (          <VerticalTimelineElement
            key={`timeline-day-${day.day}`}
            date={`Day ${day.day}`}
            dateClassName="custom-timeline-date"
            iconStyle={{ background: "#6A2D91", color: "#fff" }}
            icon={<Mountain />}
            contentArrowStyle={{ borderRight: "7px solid #6A2D91" }}
            contentStyle={{ 
              background: "#fff",
              boxShadow: "0 4px 20px rgba(106, 45, 145, 0.2)",
              borderTop: "3px solid #6A2D91"
            }}>
            <div className="trek-day-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl md:text-2xl font-bold text-heritage-brown mb-2">
                  {day.title}
                </h3>
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-heritage-brown/80">
                  {day.elevation && (
                    <div className="flex items-center">
                      <Mountain className="w-4 h-4 mr-1 text-heritage-purple" />
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(day.elevation)}`}>
                        {day.elevation}
                      </span>
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
              </motion.div>
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};
