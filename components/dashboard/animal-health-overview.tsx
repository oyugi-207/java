
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, AlertTriangle, Activity, TrendingUp, Shield, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmAnimals, useDataStore } from '@/lib/data';

export function AnimalHealthOverview() {
  const animals = useFarmAnimals();

  const healthStats = animals.reduce(
    (acc, animal) => {
      if (animal.healthScore >= 90) acc.excellent++;
      else if (animal.healthScore >= 75) acc.good++;
      else if (animal.healthScore >= 60) acc.fair++;
      else acc.poor++;
      
      // Status counting
      if (animal.status === 'healthy') acc.healthy++;
      else if (animal.status === 'sick') acc.sick++;
      else if (animal.status === 'pregnant') acc.pregnant++;
      else if (animal.status === 'quarantine') acc.quarantine++;
      
      return acc;
    },
    { 
      excellent: 0, 
      good: 0, 
      fair: 0, 
      poor: 0,
      healthy: 0,
      sick: 0,
      pregnant: 0,
      quarantine: 0
    }
  );

  const totalAnimals = animals.length;
  const avgHealthScore = totalAnimals > 0 
    ? Math.round(animals.reduce((sum, animal) => sum + animal.healthScore, 0) / totalAnimals)
    : 0;

  const criticalAnimals = animals.filter(animal => animal.healthScore < 60).length;
  const needsAttention = animals.filter(animal => 
    animal.status === 'sick' || 
    animal.healthScore < 70 || 
    animal.status === 'quarantine'
  ).length;

  const healthDistribution = [
    { 
      label: 'Excellent (90%+)', 
      count: healthStats.excellent, 
      color: 'bg-green-500',
      percentage: totalAnimals > 0 ? (healthStats.excellent / totalAnimals) * 100 : 0
    },
    { 
      label: 'Good (75-89%)', 
      count: healthStats.good, 
      color: 'bg-emerald-500',
      percentage: totalAnimals > 0 ? (healthStats.good / totalAnimals) * 100 : 0
    },
    { 
      label: 'Fair (60-74%)', 
      count: healthStats.fair, 
      color: 'bg-yellow-500',
      percentage: totalAnimals > 0 ? (healthStats.fair / totalAnimals) * 100 : 0
    },
    { 
      label: 'Poor (<60%)', 
      count: healthStats.poor, 
      color: 'bg-red-500',
      percentage: totalAnimals > 0 ? (healthStats.poor / totalAnimals) * 100 : 0
    }
  ];

  return (
    <Card className="premium-card hover:shadow-farm transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg">
              <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="farm-subheading">Animal Health Overview</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {criticalAnimals > 0 ? (
              <Badge variant="destructive" className="health-critical">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {criticalAnimals} Critical
              </Badge>
            ) : needsAttention > 0 ? (
              <Badge variant="outline" className="health-warning">
                <Shield className="h-4 w-4 mr-1" />
                {needsAttention} Need Attention
              </Badge>
            ) : (
              <Badge variant="outline" className="health-excellent">
                <Activity className="h-4 w-4 mr-1" />
                All Healthy
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800/50"
        >
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-300">Average Health Score</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-green-800 dark:text-green-200">
                {avgHealthScore}%
              </span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-600 dark:text-green-400 mb-1">
              {totalAnimals} Total Animals
            </p>
            <Progress 
              value={avgHealthScore} 
              className="w-20 h-2 bg-green-100 dark:bg-green-900/50"
            />
          </div>
        </motion.div>

        {/* Health Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800 dark:text-gray-200">Health Distribution</h4>
          <div className="space-y-2">
            {healthDistribution.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.count}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {item.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Healthy</span>
              <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                {healthStats.healthy}
              </span>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Pregnant</span>
              <span className="text-lg font-bold text-purple-800 dark:text-purple-200">
                {healthStats.pregnant}
              </span>
            </div>
          </div>
          
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Sick</span>
              <span className="text-lg font-bold text-red-800 dark:text-red-200">
                {healthStats.sick}
              </span>
            </div>
          </div>
          
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Quarantine</span>
              <span className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                {healthStats.quarantine}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {needsAttention > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Action Required
                </span>
              </div>
              <span className="text-xs text-orange-600 dark:text-orange-400">
                {needsAttention} animals need attention
              </span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
