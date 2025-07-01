
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmData } from '@/lib/data';

export function AnimalHealthOverview() {
  const { animals } = useFarmData();

  const healthStats = animals.reduce(
    (acc, animal) => {
      if (animal.healthScore >= 90) acc.excellent++;
      else if (animal.healthScore >= 75) acc.good++;
      else if (animal.healthScore >= 60) acc.fair++;
      else acc.poor++;
      return acc;
    },
    { excellent: 0, good: 0, fair: 0, poor: 0 }
  );

  const totalAnimals = animals.length;
  const avgHealthScore = totalAnimals > 0 
    ? Math.round(animals.reduce((sum, animal) => sum + animal.healthScore, 0) / totalAnimals)
    : 0;

  const criticalAnimals = animals.filter(animal => animal.healthScore < 60).length;

  const healthData = [
    { label: 'Excellent', count: healthStats.excellent, color: 'bg-emerald-500', percentage: (healthStats.excellent / totalAnimals) * 100 },
    { label: 'Good', count: healthStats.good, color: 'bg-green-500', percentage: (healthStats.good / totalAnimals) * 100 },
    { label: 'Fair', count: healthStats.fair, color: 'bg-yellow-500', percentage: (healthStats.fair / totalAnimals) * 100 },
    { label: 'Needs Attention', count: healthStats.poor, color: 'bg-red-500', percentage: (healthStats.poor / totalAnimals) * 100 },
  ];

  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-white/20 dark:border-gray-700/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-950/50 rounded-lg">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <span>Animal Health Overview</span>
          </CardTitle>
          <Badge 
            variant={criticalAnimals > 0 ? "destructive" : "secondary"}
            className={criticalAnimals > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}
          >
            {criticalAnimals > 0 ? (
              <>
                <AlertTriangle className="h-4 w-4 mr-1" />
                {criticalAnimals} Critical
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-1" />
                All Healthy
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Average Health Score</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{avgHealthScore}%</p>
          </div>
          <div className="flex items-center text-emerald-600">
            <TrendingUp className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">+5% vs last month</span>
          </div>
        </div>

        {/* Health Distribution */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Health Distribution</h4>
          {healthData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.count} animals
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-2"
                style={{
                  background: `linear-gradient(to right, ${item.color.replace('bg-', '')} 0%, ${item.color.replace('bg-', '')} ${item.percentage}%, #e5e7eb ${item.percentage}%, #e5e7eb 100%)`
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Recent Health Alerts */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white">Recent Health Events</h4>
          <div className="space-y-2">
            {animals
              .filter(animal => animal.healthScore < 75)
              .slice(0, 3)
              .map((animal, index) => (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">{animal.name || `Animal #${animal.tagId}`}</p>
                      <p className="text-xs text-gray-500">Health Score: {animal.healthScore}%</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {animal.species}
                  </Badge>
                </motion.div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
