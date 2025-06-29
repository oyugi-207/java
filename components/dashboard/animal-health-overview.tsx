"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmAnimals } from '@/lib/data';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'health-excellent';
    case 'sick': return 'health-critical';
    case 'pregnant': return 'health-good';
    case 'quarantine': return 'health-warning';
    default: return 'health-good';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return CheckCircle;
    case 'sick': return AlertTriangle;
    case 'pregnant': return TrendingUp;
    case 'quarantine': return AlertTriangle;
    default: return Activity;
  }
};

export function AnimalHealthOverview() {
  const animals = useFarmAnimals();

  // Show first 4 animals for the overview
  const displayAnimals = animals.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card className="glass border-white/20 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Animal Health Overview</span>
            <Badge variant="secondary" className="ml-auto">
              Live Monitoring
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {displayAnimals.length > 0 ? (
              displayAnimals.map((animal, index) => {
                const StatusIcon = getStatusIcon(animal.status);
                return (
                  <motion.div
                    key={animal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-primary/50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={animal.image} alt={animal.name} />
                      <AvatarFallback>{animal.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {animal.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {animal.species} • {animal.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`h-4 w-4 ${getStatusColor(animal.status).replace('bg-', 'text-').replace('border-', 'text-').split(' ')[0]}`} />
                            <span className="font-semibold text-lg">
                              {animal.healthScore}%
                            </span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(animal.status)} text-xs`}
                          >
                            {animal.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress 
                          value={animal.healthScore} 
                          className="h-2"
                        />
                      </div>
                      
                      {animal.status !== 'healthy' && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge 
                            variant="destructive" 
                            className="text-xs flex items-center space-x-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            <span>
                              {animal.status === 'sick' ? 'Requires attention' :
                               animal.status === 'pregnant' ? 'Expecting' :
                               animal.status === 'quarantine' ? 'In quarantine' : 'Monitor closely'}
                            </span>
                          </Badge>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Animals Yet</h3>
                <p className="text-sm">Add your first animal to start monitoring health data</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}