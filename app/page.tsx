
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useFarmData } from '@/lib/data';
import LandingPage from '@/components/landing/landing-page';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { AnimalHealthOverview } from '@/components/dashboard/animal-health-overview';
import { LiveMetrics } from '@/components/dashboard/live-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, Calendar, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const { fetchAllData, animals, tasks, isLoading } = useFarmData();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
        <div className="text-center">
          <motion.div
            className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="mt-6 text-xl text-muted-foreground font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading AgroInsight Pro...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Farm Command Center
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Welcome back! Here's your farm's performance overview.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 px-3 py-1">
              <Activity className="h-4 w-4 mr-2" />
              All Systems Operational
            </Badge>
          </div>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-lg font-medium">Loading farm data...</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <AnimalHealthOverview />
            <RecentActivities />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <WeatherWidget />
            <LiveMetrics />
            <AIInsights />
          </div>
        </div>

        {/* Enhanced Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Livestock</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-1">{animals?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active animals in your operation
                </p>
                <Badge variant="secondary" className="mt-2 bg-blue-50 text-blue-700">
                  +5% this month
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
                  <Calendar className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {tasks?.filter(task => task.status === 'pending').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks requiring attention
                </p>
                <Badge variant="secondary" className="mt-2 bg-orange-50 text-orange-700">
                  Due this week
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Health Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {animals?.filter(animal => animal.healthScore < 70).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Animals needing attention
                </p>
                <Badge variant="secondary" className="mt-2 bg-red-50 text-red-700">
                  Requires action
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Performance Score</CardTitle>
                  <Activity className="h-4 w-4 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 mb-1">94%</div>
                <p className="text-xs text-muted-foreground">
                  Overall farm efficiency
                </p>
                <Badge variant="secondary" className="mt-2 bg-emerald-50 text-emerald-700">
                  Excellent
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
