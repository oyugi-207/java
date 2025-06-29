"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWeatherData, type WeatherData } from '@/lib/weather';

export function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherData();
        setWeatherData(data);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !weatherData) {
    return (
      <Card className="glass border-white/20 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <span>Weather Conditions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return Sun;
      case 'cloud': return Cloud;
      case 'cloud-rain': return CloudRain;
      default: return Cloud;
    }
  };

  const CurrentIcon = getWeatherIcon(weatherData.current.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Card className="glass border-white/20 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <span>Weather Conditions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Weather */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CurrentIcon className="h-16 w-16 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {weatherData.current.temperature}°C
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {weatherData.current.condition}
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Humidity</div>
                <div className="font-semibold">{weatherData.current.humidity}%</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
              <Wind className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Wind</div>
                <div className="font-semibold">{weatherData.current.windSpeed} km/h</div>
              </div>
            </div>
          </div>

          {/* 4-Day Forecast */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">4-Day Forecast</h4>
            <div className="space-y-2">
              {weatherData.forecast.map((day, index) => {
                const DayIcon = getWeatherIcon(day.icon);
                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <DayIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {day.day}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {day.high}° / {day.low}°
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {day.condition}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Weather Impact */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center space-x-2 mb-2">
              <Thermometer className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Weather Impact</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {weatherData.current.temperature > 25 
                ? "High temperature - ensure adequate water supply and shade for animals."
                : weatherData.current.temperature < 10
                ? "Cold weather - check heating systems and provide extra bedding."
                : "Optimal conditions for grazing. Consider moving cattle to east pasture for better shelter."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}