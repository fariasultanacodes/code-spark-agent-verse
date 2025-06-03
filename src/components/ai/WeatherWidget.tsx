
import React from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets } from 'lucide-react';

interface WeatherWidgetProps {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

const WeatherWidget = ({ location, temperature, condition, humidity, windSpeed }: WeatherWidgetProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'snowy':
        return <Snowflake className="w-8 h-8 text-blue-200" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg text-white max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{location}</h3>
          <p className="text-3xl font-bold">{temperature}°C</p>
        </div>
        {getWeatherIcon(condition)}
      </div>
      
      <p className="text-sm opacity-90 mb-4 capitalize">{condition}</p>
      
      <div className="flex justify-between text-sm">
        <div className="flex items-center space-x-1">
          <Droplets className="w-4 h-4" />
          <span>{humidity}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Wind className="w-4 h-4" />
          <span>{windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
