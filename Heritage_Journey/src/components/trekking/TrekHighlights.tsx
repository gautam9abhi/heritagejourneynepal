
import { Check } from "lucide-react";

interface TrekHighlightsProps {
  highlights: string[];
}

export const TrekHighlights = ({ highlights }: TrekHighlightsProps) => {
  return (
    <div className="bg-heritage-light rounded-lg p-6 shadow-md">
      <h3 className="text-2xl font-bold text-heritage-brown mb-4">Trek Highlights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="mt-0.5 bg-heritage-purple text-white p-1 rounded-full flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-heritage-brown/80">{highlight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
