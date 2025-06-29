"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart3, TrendingUp, Activity, Target, Download, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useData } from '@/lib/data';

const performanceData = [
  { month: 'Jan', health: 92, production: 88, efficiency: 85, growth: 78 },
  { month: 'Feb', health: 94, production: 91, efficiency: 87, growth: 82 },
  { month: 'Mar', health: 96, production: 89, efficiency: 92, growth: 85 },
  { month: 'Apr', health: 95, production: 93, efficiency: 94, growth: 88 },
  { month: 'May', health: 97, production: 95, efficiency: 96, growth: 91 },
  { month: 'Jun', health: 98, production: 97, efficiency: 98, growth: 94 },
];

const productionData = [
  { week: 'Week 1', milk: 2400, eggs: 1800, meat: 450 },
  { week: 'Week 2', milk: 2600, eggs: 1900, meat: 520 },
  { week: 'Week 3', milk: 2800, eggs: 2100, meat: 480 },
  { week: 'Week 4', milk: 3000, eggs: 2200, meat: 600 },
];

const healthMetrics = [
  { category: 'Vaccination Rate', value: 98 },
  { category: 'Disease Prevention', value: 95 },
  { category: 'Nutrition Score', value: 92 },
  { category: 'Exercise Level', value: 88 },
  { category: 'Stress Level', value: 85 },
  { category: 'Recovery Rate', value: 93 },
];

export default function AnalyticsPage() {
  const { animals } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const analyticsStats = {
    totalAnimals: animals.length,
    avgHealthScore: Math.round(animals.reduce((sum, a) => sum + a.healthScore, 0) / animals.length),
    productionEfficiency: 94,
    growthRate: 12.5,
  };

  const speciesDistribution = animals.reduce((acc, animal) => {
    acc[animal.species] = (acc[animal.species] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const speciesData = Object.entries(speciesDistribution).map(([species, count]) => ({
    species: species.charAt(0).toUpperCase() + species.slice(1),
    count,
    percentage: Math.round((count / animals.length) * 100),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
            <p className="text-muted-foreground">
              Comprehensive insights and performance analytics for your farm operations
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>

        {/* Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Animals</p>
                  <p className="text-2xl font-bold text-blue-600">{analyticsStats.totalAnimals}</p>
                  <div className="flex items-center text-xs text-blue-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2% growth
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Health Score</p>
                  <p className="text-2xl font-bold text-green-600">{analyticsStats.avgHealthScore}%</p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.1% improvement
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Production Efficiency</p>
                  <p className="text-2xl font-bold text-purple-600">{analyticsStats.productionEfficiency}%</p>
                  <div className="flex items-center text-xs text-purple-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.7% increase
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                  <p className="text-2xl font-bold text-orange-600">{analyticsStats.growthRate}%</p>
                  <div className="flex items-center text-xs text-orange-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.3% vs target
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="health">Health Metrics</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trends */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            backdropFilter: 'blur(12px)',
                          }}
                        />
                        <Line type="monotone" dataKey="health" stroke="#22c55e" strokeWidth={2} />
                        <Line type="monotone" dataKey="production" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="efficiency" stroke="#8b5cf6" strokeWidth={2} />
                        <Line type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Performance Radar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Current Performance Radar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={healthMetrics}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Performance"
                          dataKey="value"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthMetrics.map((metric, index) => (
                <motion.div
                  key={metric.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">{metric.category}</h4>
                          <Badge variant="outline">{metric.value}%</Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Production Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="week" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(12px)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="milk"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="eggs"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="meat"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { range: '90-100%', count: animals.filter(a => a.healthScore >= 90).length },
                      { range: '80-89%', count: animals.filter(a => a.healthScore >= 80 && a.healthScore < 90).length },
                      { range: '70-79%', count: animals.filter(a => a.healthScore >= 70 && a.healthScore < 80).length },
                      { range: '60-69%', count: animals.filter(a => a.healthScore >= 60 && a.healthScore < 70).length },
                      { range: '<60%', count: animals.filter(a => a.healthScore < 60).length },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="range" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'Healthy', count: animals.filter(a => a.status === 'healthy').length, color: 'bg-green-500' },
                      { status: 'Pregnant', count: animals.filter(a => a.status === 'pregnant').length, color: 'bg-purple-500' },
                      { status: 'Sick', count: animals.filter(a => a.status === 'sick').length, color: 'bg-red-500' },
                      { status: 'Quarantine', count: animals.filter(a => a.status === 'quarantine').length, color: 'bg-yellow-500' },
                    ].map((item, index) => (
                      <div key={item.status} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`} />
                          <span className="font-medium">{item.status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{item.count}</span>
                          <Badge variant="outline">
                            {((item.count / animals.length) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Species Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {speciesData.map((species, index) => (
                      <motion.div
                        key={species.species}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500" />
                          <span className="font-medium">{species.species}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{species.count}</span>
                          <Badge variant="outline">{species.percentage}%</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { age: '0-1 years', count: Math.floor(animals.length * 0.3) },
                      { age: '1-3 years', count: Math.floor(animals.length * 0.4) },
                      { age: '3-5 years', count: Math.floor(animals.length * 0.2) },
                      { age: '5+ years', count: Math.floor(animals.length * 0.1) },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="age" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}