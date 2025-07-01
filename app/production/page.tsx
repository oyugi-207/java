
"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, TrendingUp, Milk, Egg, Beef, Package, Calendar, Download, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmData } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ProductionModal } from '@/components/production/production-modal';
import toast from 'react-hot-toast';
import { format, subDays, subMonths } from 'date-fns';

export default function EnhancedProductionPage() {
  const { animals, productionRecords } = useFarmData();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedAnimal, setSelectedAnimal] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [productionModalOpen, setProductionModalOpen] = useState(false);

  // Enhanced production analytics
  const generateProductionAnalytics = () => {
    const totalProduction = productionRecords.reduce((sum, record) => sum + record.quantity, 0);
    const totalValue = productionRecords.reduce((sum, record) => sum + (record.totalValue || 0), 0);
    
    const productionByType = productionRecords.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + record.quantity;
      return acc;
    }, {} as Record<string, number>);

    const productionByAnimal = animals.map(animal => {
      const animalProduction = productionRecords.filter(r => r.animalId === animal.id);
      const quantity = animalProduction.reduce((sum, r) => sum + r.quantity, 0);
      const value = animalProduction.reduce((sum, r) => sum + (r.totalValue || 0), 0);
      
      return {
        animalId: animal.id,
        animalName: animal.name,
        species: animal.species,
        breed: animal.breed,
        quantity,
        value,
        recordCount: animalProduction.length,
        avgDailyProduction: quantity / 30, // Assuming 30-day period
        efficiency: animal.species === 'cattle' ? quantity / 500 : quantity / 100 // Efficiency ratio
      };
    }).filter(item => item.quantity > 0);

    // Monthly production trends
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = subMonths(new Date(), 11 - i);
      const monthRecords = productionRecords.filter(record => {
        const recordDate = new Date(record.createdAt);
        return recordDate.getMonth() === month.getMonth() && 
               recordDate.getFullYear() === month.getFullYear();
      });
      
      return {
        month: format(month, 'MMM'),
        milk: monthRecords.filter(r => r.type === 'milk').reduce((sum, r) => sum + r.quantity, 0),
        eggs: monthRecords.filter(r => r.type === 'eggs').reduce((sum, r) => sum + r.quantity, 0),
        meat: monthRecords.filter(r => r.type === 'meat').reduce((sum, r) => sum + r.quantity, 0),
        wool: monthRecords.filter(r => r.type === 'wool').reduce((sum, r) => sum + r.quantity, 0),
        totalValue: monthRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0)
      };
    });

    return {
      totalProduction,
      totalValue,
      productionByType,
      productionByAnimal,
      monthlyData,
      averageProductivity: totalProduction / animals.length,
      topProducers: productionByAnimal.slice(0, 5).sort((a, b) => b.quantity - a.quantity)
    };
  };

  const analytics = generateProductionAnalytics();

  // Production forecast based on trends
  const generateForecast = () => {
    const lastMonthData = analytics.monthlyData.slice(-3);
    const avgGrowth = lastMonthData.length > 1 ? 
      (lastMonthData[lastMonthData.length - 1].totalValue - lastMonthData[0].totalValue) / lastMonthData.length : 0;
    
    return Array.from({ length: 6 }, (_, i) => {
      const futureMonth = new Date();
      futureMonth.setMonth(futureMonth.getMonth() + i + 1);
      
      const lastValue = analytics.monthlyData[analytics.monthlyData.length - 1]?.totalValue || 0;
      const projectedValue = lastValue + (avgGrowth * (i + 1));
      
      return {
        month: format(futureMonth, 'MMM'),
        projected: Math.max(0, projectedValue),
        confidence: Math.max(60, 95 - (i * 8)) // Decreasing confidence over time
      };
    });
  };

  const forecastData = generateForecast();

  const filteredRecords = productionRecords.filter(record => {
    const matchesAnimal = selectedAnimal === 'all' || record.animalId === selectedAnimal;
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesAnimal && matchesType;
  });

  const getProductionIcon = (type: string) => {
    switch (type) {
      case 'milk': return Milk;
      case 'eggs': return Egg;
      case 'meat': return Beef;
      case 'wool': return Package;
      default: return Package;
    }
  };

  const exportProductionReport = () => {
    const reportData = {
      summary: analytics,
      records: filteredRecords,
      forecast: forecastData,
      generatedAt: new Date().toISOString()
    };

    const jsonData = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `production-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Production report exported successfully');
  };

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Production Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive tracking and analytics for all farm production activities
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportProductionReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={() => setProductionModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Production
            </Button>
          </div>
        </div>

        {/* Production Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Production',
              value: `${analytics.totalProduction.toLocaleString()} units`,
              change: '+12.5%',
              icon: TrendingUp,
              color: 'green'
            },
            {
              title: 'Production Value',
              value: `$${analytics.totalValue.toLocaleString()}`,
              change: '+18.3%',
              icon: BarChart3,
              color: 'blue'
            },
            {
              title: 'Active Producers',
              value: analytics.productionByAnimal.length.toString(),
              change: '+2',
              icon: Package,
              color: 'purple'
            },
            {
              title: 'Avg Productivity',
              value: `${analytics.averageProductivity.toFixed(1)} units/animal`,
              change: '+5.7%',
              icon: TrendingUp,
              color: 'emerald'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{stat.value}</span>
                        <Badge variant="outline" className="text-green-600 bg-green-50">
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-950/50`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="animal-select">Filter by Animal</Label>
                <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
                  <SelectTrigger id="animal-select">
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Animals</SelectItem>
                    {animals.map(animal => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.name} ({animal.species})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Label htmlFor="type-select">Filter by Production Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger id="type-select">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="milk">Milk</SelectItem>
                    <SelectItem value="eggs">Eggs</SelectItem>
                    <SelectItem value="meat">Meat</SelectItem>
                    <SelectItem value="wool">Wool</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="animals">By Animal</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Production Trends (12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="milk" stackId="1" stroke="#22c55e" fill="#22c55e" />
                      <Area type="monotone" dataKey="eggs" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                      <Area type="monotone" dataKey="meat" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                      <Area type="monotone" dataKey="wool" stackId="1" stroke="#ef4444" fill="#ef4444" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Production by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.productionByType).map(([type, quantity]) => ({
                          name: type,
                          value: quantity
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {Object.entries(analytics.productionByType).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Production Value Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalValue" stroke="#22c55e" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Top Performing Animals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topProducers.map((producer, index) => (
                      <div key={producer.animalId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-950/50 rounded-full">
                            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{producer.animalName}</h4>
                            <p className="text-sm text-muted-foreground">{producer.species} • {producer.breed}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{producer.quantity} units</p>
                          <p className="text-sm text-muted-foreground">${producer.value.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Production Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analytics.topProducers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="animalName" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="efficiency" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.productionByAnimal.map((animal, index) => (
                <motion.div
                  key={animal.animalId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="premium-card hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{animal.animalName}</span>
                        <Badge variant="outline">{animal.species}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Production:</span>
                          <span className="font-semibold">{animal.quantity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Value:</span>
                          <span className="font-semibold">${animal.value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Records:</span>
                          <span className="font-semibold">{animal.recordCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Daily Avg:</span>
                          <span className="font-semibold">{animal.avgDailyProduction.toFixed(1)} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Efficiency:</span>
                          <Badge variant="outline" className={
                            animal.efficiency > 0.8 ? 'text-green-600' : 
                            animal.efficiency > 0.5 ? 'text-yellow-600' : 'text-red-600'
                          }>
                            {(animal.efficiency * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Production Forecast (Next 6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="projected" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Projected Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {forecastData.slice(0, 3).map((forecast, index) => (
                    <div key={forecast.month} className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold">{forecast.month}</h4>
                      <p className="text-2xl font-bold text-green-600">${forecast.projected.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{forecast.confidence}% confidence</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Production Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Animal</th>
                        <th className="text-left p-4">Type</th>
                        <th className="text-left p-4">Quantity</th>
                        <th className="text-left p-4">Quality</th>
                        <th className="text-left p-4">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.slice(0, 20).map((record, index) => {
                        const animal = animals.find(a => a.id === record.animalId);
                        const IconComponent = getProductionIcon(record.type);
                        
                        return (
                          <motion.tr
                            key={record.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <td className="p-4">
                              {format(new Date(record.createdAt), 'MMM dd, yyyy')}
                            </td>
                            <td className="p-4">
                              {animal ? `${animal.name} (${animal.species})` : 'Unknown'}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <IconComponent className="h-4 w-4" />
                                <span className="capitalize">{record.type}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              {record.quantity} {record.unit}
                            </td>
                            <td className="p-4">
                              <Badge variant="outline">
                                {record.qualityGrade || 'Standard'}
                              </Badge>
                            </td>
                            <td className="p-4 font-semibold">
                              ${(record.totalValue || 0).toLocaleString()}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ProductionModal
        open={productionModalOpen}
        onOpenChange={setProductionModalOpen}
      />
    </DashboardLayout>
  );
}
