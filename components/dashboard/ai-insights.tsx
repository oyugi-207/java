"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const insights = [
  {
    id: 1,
    type: 'prediction',
    priority: 'high',
    title: 'Breeding Opportunity',
    description: 'Bella shows optimal breeding indicators. Consider pairing with Max for genetic diversity.',
    confidence: 94,
    action: 'Schedule breeding consultation',
    icon: TrendingUp,
  },
  {
    id: 2,
    type: 'health',
    priority: 'medium',
    title: 'Feed Optimization',
    description: 'Adjusting protein content by 12% could improve milk production by 8-15%.',
    confidence: 87,
    action: 'Update feeding schedule',
    icon: Lightbulb,
  },
  {
    id: 3,
    type: 'alert',
    priority: 'high',
    title: 'Weather Impact Alert',
    description: 'Upcoming rain may affect pasture quality. Consider moving livestock to covered areas.',
    confidence: 91,
    action: 'Create weather plan',
    icon: AlertCircle,
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
  }
};

export function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <Card className="glass border-white/20 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>AI Insights</span>
            <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
              Powered by AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {insight.title}
                        </h4>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(insight.priority)}`}>
                          {insight.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Confidence:
                          </span>
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            {insight.confidence}%
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {insight.action}
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200/50 dark:border-purple-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100">
                  AI Learning Status
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Model accuracy improving daily
                </p>
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                96.2%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}