
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, PawPrint, Heart, DollarSign, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmData } from '@/lib/data';

export function DashboardStats() {
  const { animals, tasks } = useFarmData();

  const healthyAnimals = animals.filter(animal => animal.status === 'healthy').length;
  const sickAnimals = animals.filter(animal => animal.status === 'sick').length;
  const pregnantAnimals = animals.filter(animal => animal.status === 'pregnant').length;
  const deceasedAnimals = animals.filter(animal => animal.status === 'deceased').length;
  const soldAnimals = animals.filter(animal => animal.status === 'sold').length;
  const activeAlerts = tasks.filter(task => task.priority === 'urgent' && task.status !== 'completed').length;

  const stats = [
    {
      name: 'Total Animals',
      value: animals.length.toString(),
      change: '+12',
      changeType: 'positive',
      icon: PawPrint,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      name: 'Healthy Animals',
      value: healthyAnimals.toString(),
      change: '+5.2%',
      changeType: 'positive',
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/50',
    },
    {
      name: 'Monthly Revenue',
      value: '$47,284',
      change: '+18.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      name: 'Sick Animals',
      value: sickAnimals.toString(),
      change: sickAnimals > 0 ? '+2' : '0',
      changeType: sickAnimals > 0 ? 'negative' : 'positive',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/50',
    },
    {
      name: 'Pregnant',
      value: pregnantAnimals.toString(),
      change: '+3',
      changeType: 'positive',
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/50',
    },
    {
      name: 'Deceased',
      value: deceasedAnimals.toString(),
      change: deceasedAnimals > 0 ? `+${deceasedAnimals}` : '0',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950/50',
    },
    {
      name: 'Sold',
      value: soldAnimals.toString(),
      change: '+12',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Card className="relative overflow-hidden backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
