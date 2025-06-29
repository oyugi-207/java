"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Calendar, BarChart3, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const quickActions = [
  {
    label: 'Add Animal',
    icon: Plus,
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Register new animal',
  },
  {
    label: 'Health Check',
    icon: Search,
    color: 'bg-blue-500 hover:bg-blue-600',
    description: 'Quick health assessment',
  },
  {
    label: 'Schedule Task',
    icon: Calendar,
    color: 'bg-purple-500 hover:bg-purple-600',
    description: 'Create new task',
  },
  {
    label: 'View Reports',
    icon: BarChart3,
    color: 'bg-orange-500 hover:bg-orange-600',
    description: 'Generate analytics',
  },
  {
    label: 'Alerts',
    icon: Bell,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Check notifications',
  },
  {
    label: 'Settings',
    icon: Settings,
    color: 'bg-gray-500 hover:bg-gray-600',
    description: 'Farm preferences',
  },
];

export function QuickActions() {
  return (
    <Card className="glass border-white/20 dark:border-gray-700/20">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className={`${action.color} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group`}
                  size="lg"
                >
                  <IconComponent className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-semibold">{action.label}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}