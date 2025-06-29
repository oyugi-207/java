"use client";

import { useAuth } from '@/lib/auth';
import { LandingPage } from '@/components/landing/landing-page';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { LiveMetrics } from '@/components/dashboard/live-metrics';
import { AnimalHealthOverview } from '@/components/dashboard/animal-health-overview';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, Calendar, Bell, Leaf, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '@/lib/data';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { animals, tasks } = useData();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const urgentTasks = tasks.filter(task => task.priority === 'urgent' && task.status !== 'completed');
  const healthAlerts = animals.filter(animal => animal.healthScore < 70 || animal.status === 'sick');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 p-8 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  AgroInsight Dashboard
                </h1>
                <p className="text-emerald-100 text-lg">
                  Welcome back! Here's your farm overview for today.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-white" />
                  <div>
                    <p className="text-emerald-100">Farm Performance</p>
                    <p className="text-2xl font-bold">Excellent</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-8 w-8 text-white" />
                  <div>
                    <p className="text-emerald-100">Active Alerts</p>
                    <p className="text-2xl font-bold">{urgentTasks.length + healthAlerts.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-white" />
                  <div>
                    <p className="text-emerald-100">Today's Tasks</p>
                    <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {(urgentTasks.length > 0 || healthAlerts.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-300">
                  <Bell className="h-5 w-5" />
                  <span>Urgent Attention Required</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urgentTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                  ))}
                  {healthAlerts.slice(0, 2).map(animal => (
                    <div key={animal.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border">
                      <div>
                        <h4 className="font-medium">Health Alert: {animal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Health score: {animal.healthScore}% - {animal.status}
                        </p>
                      </div>
                      <Badge variant="destructive">Health</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <LiveMetrics />
            <AnimalHealthOverview />
            
            {/* Farm Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  <span>Today's Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '06:00', activity: 'Morning feeding - Cattle Barn A', status: 'completed' },
                    { time: '08:30', activity: 'Health check - Bella (Cow)', status: 'completed' },
                    { time: '10:00', activity: 'Vaccination - Pig Group B', status: 'in-progress' },
                    { time: '14:00', activity: 'Breeding consultation - Luna', status: 'pending' },
                    { time: '16:30', activity: 'Feed inventory check', status: 'pending' },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-muted-foreground w-16">
                          {activity.time}
                        </div>
                        <div>
                          <p className="font-medium">{activity.activity}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          activity.status === 'completed' ? 'default' :
                          activity.status === 'in-progress' ? 'secondary' : 'outline'
                        }
                        className={
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {activity.status.replace('-', ' ')}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <WeatherWidget />
            <AIInsights />
            <RecentActivities />
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Feed Efficiency</span>
                    <span className="font-semibold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Milk Production</span>
                    <span className="font-semibold text-blue-600">+12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Breeding Success</span>
                    <span className="font-semibold text-purple-600">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cost per Animal</span>
                    <span className="font-semibold text-orange-600">$45.20</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}