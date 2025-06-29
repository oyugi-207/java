"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Heart, PawPrint, Utensils, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const activities = [
  {
    id: 1,
    type: 'health',
    title: 'Health check completed',
    description: 'Bella - Routine vaccination administered',
    time: '2 hours ago',
    user: 'Dr. Sarah Johnson',
    userImage: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150',
    icon: Heart,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
  },
  {
    id: 2,
    type: 'breeding',
    title: 'Breeding scheduled',
    description: 'Max and Luna - Artificial insemination planned',
    time: '4 hours ago',
    user: 'John Smith',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    icon: PawPrint,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50',
  },
  {
    id: 3,
    type: 'feeding',
    title: 'Feed distribution',
    description: 'Morning feed completed for sector A',
    time: '6 hours ago',
    user: 'Mike Wilson',
    userImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    icon: Utensils,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
  },
  {
    id: 4,
    type: 'task',
    title: 'Maintenance completed',
    description: 'Water system inspection and repair',
    time: '8 hours ago',
    user: 'Emma Davis',
    userImage: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
  },
  {
    id: 5,
    type: 'alert',
    title: 'Alert resolved',
    description: 'Temperature sensor back online',
    time: '12 hours ago',
    user: 'System',
    userImage: null,
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/50',
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'health': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
    case 'breeding': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300';
    case 'feeding': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300';
    case 'task': return 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300';
    case 'alert': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
  }
};

export function RecentActivities() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <Card className="glass border-white/20 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Recent Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 custom-scrollbar max-h-96 overflow-y-auto">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className={`${activity.bgColor} ${activity.color} p-2 rounded-full flex-shrink-0`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {activity.title}
                      </h4>
                      <Badge variant="outline" className={`text-xs ${getTypeColor(activity.type)}`}>
                        {activity.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {activity.userImage && (
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={activity.userImage} alt={activity.user} />
                            <AvatarFallback>{activity.user[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.user}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}