"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { animals, tasks, inventory, healthRecords, feedingRecords } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const generateReport = (type: string, format: 'pdf' | 'csv' | 'excel') => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'animals':
        data = animals.map(animal => ({
          Name: animal.name,
          Species: animal.species,
          Breed: animal.breed,
          Gender: animal.gender,
          'Birth Date': animal.birthDate,
          'Health Score': animal.healthScore,
          Status: animal.status,
          Location: animal.location,
          Weight: animal.weight,
        }));
        filename = 'animals-report';
        break;
      case 'health':
        data = healthRecords.map(record => ({
          'Animal ID': record.animalId,
          Date: record.date,
          'Health Score': record.healthScore,
          Temperature: record.temperature || 'N/A',
          Weight: record.weight || 'N/A',
          Veterinarian: record.veterinarian || 'N/A',
          Notes: record.notes,
        }));
        filename = 'health-report';
        break;
      case 'feeding':
        data = feedingRecords.map(record => ({
          'Animal ID': record.animalId,
          'Feed Type': record.feedType,
          Amount: record.amount,
          Unit: record.unit,
          'Feeding Time': record.feedingTime,
          Cost: record.cost,
          Date: record.createdAt,
        }));
        filename = 'feeding-report';
        break;
      case 'inventory':
        data = inventory.map(item => ({
          Name: item.name,
          Category: item.category,
          Quantity: item.quantity,
          Unit: item.unit,
          'Min Stock': item.minStock,
          Cost: item.cost,
          Supplier: item.supplier,
          Location: item.location,
          'Expiry Date': item.expiryDate || 'N/A',
        }));
        filename = 'inventory-report';
        break;
      case 'tasks':
        data = tasks.map(task => ({
          Title: task.title,
          Description: task.description,
          Type: task.type,
          Priority: task.priority,
          Status: task.status,
          'Assigned To': task.assignedTo,
          'Due Date': task.dueDate,
          'Created At': task.createdAt,
        }));
        filename = 'tasks-report';
        break;
    }

    if (format === 'csv') {
      const csvContent = [
        Object.keys(data[0] || {}).join(','),
        ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported as CSV`);
    } else {
      toast.success(`${format.toUpperCase()} export started for ${type} report`);
    }
  };

  const animalStats = {
    total: animals.length,
    healthy: animals.filter(a => a.status === 'healthy').length,
    avgHealthScore: animals.length > 0 ? Math.round(animals.reduce((sum, a) => sum + a.healthScore, 0) / animals.length) : 0,
    species: [...new Set(animals.map(a => a.species))].length,
  };

  const speciesData = [...new Set(animals.map(a => a.species))].map(species => ({
    name: species,
    count: animals.filter(a => a.species === species).length,
  }));

  const healthTrendData = [
    { month: 'Jan', avgHealth: 92 },
    { month: 'Feb', avgHealth: 94 },
    { month: 'Mar', avgHealth: 96 },
    { month: 'Apr', avgHealth: 95 },
    { month: 'May', avgHealth: 97 },
    { month: 'Jun', avgHealth: animalStats.avgHealthScore },
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Generate comprehensive reports and export farm data
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Animals</p>
                  <p className="text-2xl font-bold text-blue-600">{animalStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Health Score</p>
                  <p className="text-2xl font-bold text-green-600">{animalStats.avgHealthScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {tasks.filter(t => t.status !== 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="animals">Animals</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgHealth" stroke="#22c55e" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Species Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={speciesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, count }) => `${name}: ${count}`}
                      >
                        {speciesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Animal Reports</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => generateReport('animals', 'csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => generateReport('animals', 'pdf')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {speciesData.map((species, index) => (
                      <motion.div
                        key={species.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium capitalize">{species.name}</h4>
                                <p className="text-2xl font-bold">{species.count}</p>
                              </div>
                              <Badge variant="outline">
                                {((species.count / animalStats.total) * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Health Reports</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => generateReport('health', 'csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => generateReport('health', 'pdf')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Health Score Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[
                          { range: '90-100%', count: animals.filter(a => a.healthScore >= 90).length },
                          { range: '80-89%', count: animals.filter(a => a.healthScore >= 80 && a.healthScore < 90).length },
                          { range: '70-79%', count: animals.filter(a => a.healthScore >= 70 && a.healthScore < 80).length },
                          { range: '<70%', count: animals.filter(a => a.healthScore < 70).length },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Health Status Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { status: 'Healthy', count: animals.filter(a => a.status === 'healthy').length, color: 'text-green-600' },
                          { status: 'Sick', count: animals.filter(a => a.status === 'sick').length, color: 'text-red-600' },
                          { status: 'Pregnant', count: animals.filter(a => a.status === 'pregnant').length, color: 'text-purple-600' },
                          { status: 'Quarantine', count: animals.filter(a => a.status === 'quarantine').length, color: 'text-yellow-600' },
                        ].map((item) => (
                          <div key={item.status} className="flex items-center justify-between p-3 border rounded">
                            <span className="font-medium">{item.status}</span>
                            <span className={`font-bold ${item.color}`}>{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm text-muted-foreground">Inventory Value</h4>
                      <p className="text-2xl font-bold text-green-600">
                        ${inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm text-muted-foreground">Feed Costs (Monthly)</h4>
                      <p className="text-2xl font-bold text-orange-600">
                        ${feedingRecords.reduce((sum, record) => sum + record.cost, 0).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm text-muted-foreground">Health Records</h4>
                      <p className="text-2xl font-bold text-blue-600">{healthRecords.length}</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Animals Report', description: 'Complete animal database with health scores', type: 'animals' },
                { title: 'Health Records', description: 'All health checks and veterinary records', type: 'health' },
                { title: 'Feeding Records', description: 'Feed consumption and cost tracking', type: 'feeding' },
                { title: 'Inventory Report', description: 'Current stock levels and valuations', type: 'inventory' },
                { title: 'Tasks Report', description: 'All tasks and their completion status', type: 'tasks' },
                { title: 'Breeding Records', description: 'Breeding history and genetic tracking', type: 'breeding' },
              ].map((report, index) => (
                <motion.div
                  key={report.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateReport(report.type, 'csv')}
                        >
                          CSV
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateReport(report.type, 'pdf')}
                        >
                          PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateReport(report.type, 'excel')}
                        >
                          Excel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}