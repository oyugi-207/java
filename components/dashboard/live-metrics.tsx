"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const performanceData = [
  { month: 'Jan', health: 92, production: 88, efficiency: 85 },
  { month: 'Feb', health: 94, production: 91, efficiency: 87 },
  { month: 'Mar', health: 96, production: 89, efficiency: 92 },
  { month: 'Apr', health: 95, production: 93, efficiency: 94 },
  { month: 'May', health: 97, production: 95, efficiency: 96 },
  { month: 'Jun', health: 98, production: 97, efficiency: 98 },
];

const realtimeData = [
  { time: '00:00', temperature: 22, humidity: 65, airQuality: 85 },
  { time: '04:00', temperature: 20, humidity: 68, airQuality: 88 },
  { time: '08:00', temperature: 24, humidity: 62, airQuality: 92 },
  { time: '12:00', temperature: 28, humidity: 58, airQuality: 89 },
  { time: '16:00', temperature: 30, humidity: 55, airQuality: 87 },
  { time: '20:00', temperature: 26, humidity: 60, airQuality: 90 },
];

export function LiveMetrics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Trends */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="glass border-white/20 dark:border-gray-700/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span>Performance Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(12px)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="health" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="production" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Environmental Monitoring */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="glass border-white/20 dark:border-gray-700/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Environmental Monitoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="time" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(12px)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stackId="2"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="airQuality"
                  stackId="3"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}