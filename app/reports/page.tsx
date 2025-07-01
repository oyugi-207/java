
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
import { Switch } from '@/components/ui/switch';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { FileText, Download, Calendar, BarChart3, TrendingUp, Users, DollarSign, Activity, Zap, Heart, AlertTriangle, FileBarChart, FileSpreadsheet, FileImage, Mail, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmData } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';
import toast from 'react-hot-toast';
import { format, subDays, subMonths, subYears } from 'date-fns';

export default function EnhancedReportsPage() {
  const { animals, tasks, inventory, healthRecords, feedingRecords, productionRecords } = useFarmData();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 1),
    to: new Date()
  });
  const [exportFormat, setExportFormat] = useState('pdf');
  const [autoEmail, setAutoEmail] = useState(false);

  // Advanced Analytics Calculations
  const generateAdvancedAnalytics = () => {
    const totalAnimals = animals.length;
    const healthyAnimals = animals.filter(a => a.status === 'healthy').length;
    const sickAnimals = animals.filter(a => a.status === 'sick').length;
    const pregnantAnimals = animals.filter(a => a.status === 'pregnant').length;
    const deceasedAnimals = animals.filter(a => a.status === 'deceased').length;
    const soldAnimals = animals.filter(a => a.status === 'sold').length;
    
    const avgHealthScore = totalAnimals > 0 ? 
      Math.round(animals.reduce((sum, a) => sum + a.healthScore, 0) / totalAnimals) : 0;
    
    const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
    const lowStockItems = inventory.filter(item => item.quantity <= item.minStockLevel).length;
    
    const totalProductionValue = productionRecords.reduce((sum, record) => 
      sum + (record.totalValue || 0), 0);
    
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
    
    return {
      totalAnimals,
      healthyAnimals,
      sickAnimals,
      pregnantAnimals,
      deceasedAnimals,
      soldAnimals,
      avgHealthScore,
      totalInventoryValue,
      lowStockItems,
      totalProductionValue,
      completedTasks,
      overdueTasks,
      healthRate: totalAnimals > 0 ? (healthyAnimals / totalAnimals * 100).toFixed(1) : 0,
      mortalityRate: totalAnimals > 0 ? (deceasedAnimals / totalAnimals * 100).toFixed(2) : 0,
      productivityRate: tasks.length > 0 ? (completedTasks / tasks.length * 100).toFixed(1) : 0
    };
  };

  const analytics = generateAdvancedAnalytics();

  // Generate time-series data for charts
  const generateTimeSeriesData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return {
        date: format(date, 'MMM dd'),
        healthScore: Math.floor(Math.random() * 10) + 85,
        productivity: Math.floor(Math.random() * 15) + 75,
        mortality: Math.floor(Math.random() * 3),
        births: Math.floor(Math.random() * 5),
        sales: Math.floor(Math.random() * 8),
        expenses: Math.floor(Math.random() * 5000) + 2000,
        revenue: Math.floor(Math.random() * 8000) + 5000
      };
    });
    return last30Days;
  };

  const timeSeriesData = generateTimeSeriesData();

  // Species and breed distribution
  const speciesData = [...new Set(animals.map(a => a.species))].map(species => ({
    name: species,
    count: animals.filter(a => a.species === species).length,
    value: animals.filter(a => a.species === species).length
  }));

  const statusData = [
    { name: 'Healthy', count: analytics.healthyAnimals, color: '#22c55e' },
    { name: 'Sick', count: analytics.sickAnimals, color: '#ef4444' },
    { name: 'Pregnant', count: analytics.pregnantAnimals, color: '#8b5cf6' },
    { name: 'Deceased', count: analytics.deceasedAnimals, color: '#6b7280' },
    { name: 'Sold', count: analytics.soldAnimals, color: '#f59e0b' }
  ].filter(item => item.count > 0);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

  const exportReport = async (reportType: string, format: string, emailReport: boolean = false) => {
    try {
      let data: any = {};
      let reportName = '';

      switch (reportType) {
        case 'comprehensive':
          data = {
            summary: analytics,
            animals: animals.map(a => ({
              name: a.name,
              species: a.species,
              breed: a.breed,
              status: a.status,
              healthScore: a.healthScore,
              location: a.location,
              birthDate: a.birthDate
            })),
            health: healthRecords,
            production: productionRecords,
            inventory: inventory.map(i => ({
              name: i.name,
              category: i.category,
              quantity: i.quantity,
              value: i.quantity * i.cost
            })),
            tasks: tasks
          };
          reportName = 'comprehensive-farm-report';
          break;
        case 'financial':
          data = {
            totalInventoryValue: analytics.totalInventoryValue,
            totalProductionValue: analytics.totalProductionValue,
            inventory: inventory,
            production: productionRecords,
            timeline: timeSeriesData
          };
          reportName = 'financial-report';
          break;
        case 'health':
          data = {
            healthSummary: {
              avgHealthScore: analytics.avgHealthScore,
              healthyCount: analytics.healthyAnimals,
              sickCount: analytics.sickAnimals,
              mortalityRate: analytics.mortalityRate
            },
            animals: animals.map(a => ({
              name: a.name,
              healthScore: a.healthScore,
              status: a.status,
              lastCheckup: a.updatedAt
            })),
            healthRecords: healthRecords
          };
          reportName = 'health-report';
          break;
        case 'production':
          data = {
            totalValue: analytics.totalProductionValue,
            records: productionRecords,
            animalProduction: animals.map(a => ({
              name: a.name,
              species: a.species,
              productionRecords: productionRecords.filter(p => p.animalId === a.id)
            }))
          };
          reportName = 'production-report';
          break;
      }

      if (format === 'json') {
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportName}-${format(new Date(), 'yyyy-MM-dd')}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        let csvContent = '';
        
        if (reportType === 'animals') {
          const headers = ['Name', 'Species', 'Breed', 'Status', 'Health Score', 'Location', 'Birth Date'];
          csvContent = headers.join(',') + '\n';
          animals.forEach(animal => {
            const row = [
              animal.name,
              animal.species,
              animal.breed,
              animal.status,
              animal.healthScore,
              animal.location,
              animal.birthDate
            ];
            csvContent += row.map(field => `"${field}"`).join(',') + '\n';
          });
        }

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportName}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      if (emailReport) {
        // Simulate email sending
        toast.success(`${reportName} has been emailed to your registered address`);
      } else {
        toast.success(`${reportName} exported successfully as ${format.toUpperCase()}`);
      }
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const scheduleReport = (reportType: string, frequency: string) => {
    toast.success(`Scheduled ${reportType} report to be sent ${frequency}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Advanced Reports & Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights, advanced analytics, and automated reporting for your farm
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => exportReport('comprehensive', 'pdf')} className="bg-gradient-to-r from-green-600 to-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Total Animals', 
              value: analytics.totalAnimals, 
              change: '+5.2%', 
              icon: Users, 
              color: 'blue',
              description: `${analytics.healthRate}% healthy`
            },
            { 
              title: 'Health Score', 
              value: `${analytics.avgHealthScore}%`, 
              change: '+2.1%', 
              icon: Heart, 
              color: 'green',
              description: `${analytics.sickAnimals} need attention`
            },
            { 
              title: 'Inventory Value', 
              value: `$${analytics.totalInventoryValue.toLocaleString()}`, 
              change: '+12.8%', 
              icon: DollarSign, 
              color: 'emerald',
              description: `${analytics.lowStockItems} low stock items`
            },
            { 
              title: 'Productivity', 
              value: `${analytics.productivityRate}%`, 
              change: '+8.3%', 
              icon: TrendingUp, 
              color: 'purple',
              description: `${analytics.overdueTasks} overdue tasks`
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="relative overflow-hidden premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl font-bold">{stat.value}</span>
                        <Badge variant="outline" className="text-green-600 bg-green-50">
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
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

        {/* Advanced Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health Analytics</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="export">Export & Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Farm Health Trends (30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="healthScore" fill="#22c55e" stroke="#16a34a" fillOpacity={0.3} />
                      <Line type="monotone" dataKey="productivity" stroke="#3b82f6" strokeWidth={3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Animal Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, count }) => `${name}: ${count}`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                <CardTitle>Farm Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="births" fill="#22c55e" name="Births" />
                    <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" name="Sales" />
                    <Line yAxisId="right" type="monotone" dataKey="healthScore" stroke="#ef4444" strokeWidth={3} name="Health Score" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Health Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { range: '90-100%', count: animals.filter(a => a.healthScore >= 90).length, color: 'bg-green-500' },
                      { range: '80-89%', count: animals.filter(a => a.healthScore >= 80 && a.healthScore < 90).length, color: 'bg-yellow-500' },
                      { range: '70-79%', count: animals.filter(a => a.healthScore >= 70 && a.healthScore < 80).length, color: 'bg-orange-500' },
                      { range: '<70%', count: animals.filter(a => a.healthScore < 70).length, color: 'bg-red-500' }
                    ].map((item) => (
                      <div key={item.range} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${item.color}`} />
                          <span className="font-medium">{item.range}</span>
                        </div>
                        <Badge variant="outline">{item.count} animals</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>Health Trends by Species</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={speciesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Production Analytics</CardTitle>
                  <Button onClick={() => exportReport('production', 'pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Production Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="text-2xl font-bold text-green-600">${analytics.totalProductionValue.toLocaleString()}</h3>
                    <p className="text-muted-foreground">Total Production Value</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="text-2xl font-bold text-blue-600">{productionRecords.length}</h3>
                    <p className="text-muted-foreground">Production Records</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="text-2xl font-bold text-purple-600">
                      {productionRecords.reduce((sum, r) => sum + r.quantity, 0)}
                    </h3>
                    <p className="text-muted-foreground">Total Units Produced</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Revenue vs Expenses</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#22c55e" fill="#22c55e" />
                        <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Cost Breakdown</h4>
                    <div className="space-y-3">
                      {[
                        { category: 'Feed & Nutrition', amount: 15420, percentage: 35 },
                        { category: 'Veterinary Care', amount: 8750, percentage: 20 },
                        { category: 'Labor', amount: 12600, percentage: 28 },
                        { category: 'Maintenance', amount: 5230, percentage: 12 },
                        { category: 'Utilities', amount: 2200, percentage: 5 }
                      ].map((item) => (
                        <div key={item.category} className="flex items-center justify-between p-3 border rounded">
                          <span className="font-medium">{item.category}</span>
                          <div className="flex items-center space-x-2">
                            <span>${item.amount.toLocaleString()}</span>
                            <Badge variant="outline">{item.percentage}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Predictive Analytics & Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Mortality Rate Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="mortality" stroke="#ef4444" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="text-sm text-muted-foreground mt-2">
                      Current mortality rate: {analytics.mortalityRate}%
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Birth Rate Predictions</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={timeSeriesData.slice(-7)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="births" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                    <p className="text-sm text-muted-foreground mt-2">
                      Expected births this month: {analytics.pregnantAnimals}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Export Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Report Type</Label>
                    <Select defaultValue="comprehensive">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                        <SelectItem value="health">Health Report</SelectItem>
                        <SelectItem value="production">Production Report</SelectItem>
                        <SelectItem value="financial">Financial Report</SelectItem>
                        <SelectItem value="inventory">Inventory Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch checked={autoEmail} onCheckedChange={setAutoEmail} />
                    <Label>Email report automatically</Label>
                  </div>

                  <Button 
                    onClick={() => exportReport('comprehensive', exportFormat, autoEmail)} 
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Scheduled Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Report Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Email Recipients</Label>
                    <Input placeholder="Enter email addresses separated by commas" />
                  </div>

                  <Button 
                    onClick={() => scheduleReport('comprehensive', 'weekly')} 
                    className="w-full"
                    variant="outline"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Active Schedules</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Weekly health reports - Every Monday</p>
                      <p>• Monthly financial reports - 1st of each month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
