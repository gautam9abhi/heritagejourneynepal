
import { Cloud, CloudRain, Cloud as CloudIcon, Snowflake, Sun } from "lucide-react";

interface WeatherMonth {
  month: string;
  temperature: string;
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "mixed";
  suitable: boolean;
}

interface TrekWeatherProps {
  months: WeatherMonth[];
}

export const TrekWeather = ({ months }: TrekWeatherProps) => {
  const getWeatherIcon = (condition: WeatherMonth["condition"]) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-6 h-6 text-amber-500" />;
      case "cloudy":
        return <CloudIcon className="w-6 h-6 text-gray-500" />;
      case "rainy":
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case "snowy":
        return <Snowflake className="w-6 h-6 text-blue-300" />;
      case "mixed":
        return <Cloud className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <div className="bg-heritage-purple text-white p-4">
        <h3 className="text-xl font-bold text-white">Best Time to Trek</h3>
        <p className="text-white/80 text-sm">Monthly weather conditions and suitability</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-heritage-purple/10">
            <tr>
              <th className="py-3 px-4 text-left text-heritage-brown">Month</th>
              <th className="py-3 px-4 text-left text-heritage-brown">Temp</th>
              <th className="py-3 px-4 text-left text-heritage-brown">Conditions</th>
              <th className="py-3 px-4 text-left text-heritage-brown">Recommended</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {months.map((month, index) => (
              <tr 
                key={index} 
                className={
                  month.suitable 
                    ? "bg-green-50" 
                    : "bg-white"
                }
              >
                <td className="py-3 px-4 text-heritage-brown font-medium">{month.month}</td>
                <td className="py-3 px-4 text-heritage-brown/80">{month.temperature}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {getWeatherIcon(month.condition)}
                    <span className="ml-2 text-heritage-brown/80">{month.condition}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span 
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      month.suitable 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {month.suitable ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
