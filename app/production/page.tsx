"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Milk, Beef, Egg, School as Wool, TrendingUp, Calendar } from 'lucide-react';
import { useData } from '@/lib/data';
import { ProductionModal } from '@/components/production/production-modal';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function ProductionPage() {
  const { animals, productionRecords } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [productionModalOpen, setProductionModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const filteredRecords = productionRecords.filter(record => {
    const animal = animals.find(a => a.id === record.animalId);
    const matchesSearch = animal?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || record.productType === typeFilter;
    return matchesSearch && matchesType;
  });

  const productionStats = {
    totalRecords: productionRecords.length,
    totalMilk: productionRecords.filter(r => r.productType === 'milk').reduce((sum, r) => sum + r.quantity, 0),
    totalEggs: productionRecords.filter(r => r.productType === 'eggs').reduce((sum, r) => sum + r.quantity, 0),
    totalMeat: productionRecords.filter(r => r.productType === 'meat').reduce((sum, r) => sum + r.quantity, 0),
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'milk': return Milk;
      case 'eggs': return Egg;
      case 'meat': return Beef;
      case 'wool': return Wool;
      default: return TrendingUp;
    }
  };

  const getProductColor = (type: string) => {
    switch (type) {
      case 'milk': return 'text-blue-600';
      case 'eggs': return 'text-yellow-600';
      case 'meat': return 'text-red-600';
      case 'wool': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const productionTrends = [
    { month: 'Jan', milk: 2400, eggs: 1800, meat: 450 },
    { month: 'Feb', milk: 2600, eggs: 1900, meat: 520 },
    { month: 'Mar', milk: 2800, eggs: 2100, meat: 480 },
    { month: 'Apr', milk: 3000, eggs: 2200, meat: 600 },
    { month: 'May', milk: 3200, eggs: 2300, meat: 580 },
    { month: 'Jun', milk: 3400, eggs: 2400, meat: 650 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Production Management</h1>
            <p className="text-muted-foreground">
              Track and analyze animal production outputs including milk, eggs, meat, and more
            </p>
          </div>
          <Button onClick={() => setProductionModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Production
          </Button>
        </div>

        {/* Production Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Milk className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Milk</p>
                  <p className="text-2xl font-bold text-blue-600">{productionStats.totalMilk}L</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Egg className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Eggs</p>
                  <p className="text-2xl font-bold text-yellow-600">{productionStats.totalEggs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Beef className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Meat</p>
                  <p className="text-2xl font-bold text-red-600">{productionStats.totalMeat}kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Records</p>
                  <p className="text-2xl font-bold text-green-600">{productionStats.totalRecords}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by animal name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="milk">Milk</SelectItem>
                  <SelectItem value="eggs">Eggs</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="wool">Wool</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Production Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="animals">By Animal</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Production Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={productionTrends}>
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
                    <Line type="monotone" dataKey="milk" stroke="#3b82f6" strokeWidth={3} name="Milk (L)" />
                    <Line type="monotone" dataKey="eggs" stroke="#f59e0b" strokeWidth={3} name="Eggs" />
                    <Line type="monotone" dataKey="meat" stroke="#ef4444" strokeWidth={3} name="Meat (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Production Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={productionTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="milk" fill="#3b82f6" name="Milk (L)" />
                    <Bar dataKey="eggs" fill="#f59e0b" name="Eggs" />
                    <Bar dataKey="meat" fill="#ef4444" name="Meat (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <div className="space-y-4">
              {filteredRecords.map((record, index) => {
                const animal = animals.find(a => a.id === record.animalId);
                const ProductIcon = getProductIcon(record.productType);
                
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              <ProductIcon className={`h-6 w-6 ${getProductColor(record.productType)}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{animal?.name}</h3>
                              <p className="text-muted-foreground">
                                {record.quantity} {record.unit} of {record.productType}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(record.date), 'MMM dd, yyyy HH:mm')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-2">
                              {record.productType}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              Quality: {record.quality}
                            </p>
                          </div>
                        </div>
                        {record.notes && (
                          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm">{record.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((animal, index) => {
                const animalRecords = productionRecords.filter(r => r.animalId === animal.id);
                const totalProduction = animalRecords.reduce((sum, r) => sum + r.quantity, 0);
                
                return (
                  <motion.div
                    key={animal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{animal.name}</span>
                          <Badge variant="outline">{animal.species}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Records:</span>
                            <span className="font-semibold">{animalRecords.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Production:</span>
                            <span className="font-semibold">{totalProduction}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedAnimal(animal);
                              setProductionModalOpen(true);
                            }}
                          >
                            Record Production
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ProductionModal
        open={productionModalOpen}
        onOpenChange={setProductionModalOpen}
        animal={selectedAnimal}
      />
    </DashboardLayout>
  );
}