export interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

export async function getWeatherData(): Promise<WeatherData> {
  // Simulate API call with mock data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    current: {
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      icon: 'sun'
    },
    forecast: [
      { day: 'Today', high: 26, low: 18, condition: 'Partly Cloudy', icon: 'cloud' },
      { day: 'Tomorrow', high: 28, low: 20, condition: 'Sunny', icon: 'sun' },
      { day: 'Friday', high: 23, low: 16, condition: 'Rainy', icon: 'cloud-rain' },
      { day: 'Saturday', high: 25, low: 17, condition: 'Partly Cloudy', icon: 'cloud' },
    ]
  };
}