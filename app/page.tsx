"use client";

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useData } from '@/lib/data';
import { LandingPage } from '@/components/landing/landing-page';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { AnimalHealthOverview } from '@/components/dashboard/animal-health-overview';
import { LiveMetrics } from '@/components/dashboard/live-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const { fetchAllData, animals, tasks, isLoading } = useData();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading AgroInsight...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Farm Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening on your farm today.
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span>Loading farm data...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <AnimalHealthOverview />
            <RecentActivities />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WeatherWidget />
            <LiveMetrics />
            <AIInsights />
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{animals?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active livestock in your farm
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks?.filter(task => task.status === 'pending').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks requiring attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {animals?.filter(animal => animal.healthScore < 70).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Animals needing health attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks?.filter(task => task.status === 'overdue').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks past due date
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}