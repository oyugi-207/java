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
import { Plus, Search, Utensils, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useData } from '@/lib/data';
import { FeedingModal } from '@/components/feeding/feeding-modal';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function FeedingPage() {
  const { animals } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [feedingModalOpen, setFeedingModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || animal.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const feedingStats = {
    totalAnimals: animals.length,
    dailyFeedCost: Math.round(animals.length * 15.5),
    avgFeedConversion: 2.8,
    feedingSchedules: animals.length * 3, // 3 meals per day
  };

  const getFeedingSchedule = (species: string) => {
    const schedules = {
      cow: ['06:00', '12:00', '18:00'],
      pig: ['07:00', '13:00', '19:00'],
      chicken: ['06:30', '12:30', '17:30'],
      sheep: ['07:30', '14:00', '18:30'],
      goat: ['07:00', '13:30', '18:00'],
      horse: ['06:00', '12:00', '18:00'],
    };
    return schedules[species as keyof typeof schedules] || ['07:00', '13:00', '19:00'];
  };

  const getFeedType = (species: string) => {
    const feedTypes = {
      cow: 'Hay, Grain, Silage',
      pig: 'Pig Feed, Vegetables',
      chicken: 'Layer Feed, Scratch',
      sheep: 'Grass, Hay, Grain',
      goat: 'Hay, Browse, Grain',
      horse: 'Hay, Oats, Pasture',
    };
    return feedTypes[species as keyof typeof feedTypes] || 'Mixed Feed';
  };

  const getDailyFeedAmount = (animal: any) => {
    const baseAmount = animal.weight * 0.025; // 2.5% of body weight
    return Math.round(baseAmount * 10) / 10;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feeding Management</h1>
            <p className="text-muted-foreground">
              Manage feeding schedules, track consumption, and optimize nutrition
            </p>
          </div>
          <Button onClick={() => setFeedingModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feeding Record
          </Button>
        </div>

        {/* Feeding Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Animals</p>
                  <p className="text-2xl font-bold text-green-600">{feedingStats.totalAnimals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Daily Feed Cost</p>
                  <p className="text-2xl font-bold text-blue-600">${feedingStats.dailyFeedCost}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Feed Conversion</p>
                  <p className="text-2xl font-bold text-orange-600">{feedingStats.avgFeedConversion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Daily Schedules</p>
                  <p className="text-2xl font-bold text-purple-600">{feedingStats.feedingSchedules}</p>
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
                  placeholder="Search animals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Species</SelectItem>
                  <SelectItem value="cow">Cow</SelectItem>
                  <SelectItem value="pig">Pig</SelectItem>
                  <SelectItem value="chicken">Chicken</SelectItem>
                  <SelectItem value="sheep">Sheep</SelectItem>
                  <SelectItem value="goat">Goat</SelectItem>
                  <SelectItem value="horse">Horse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feeding Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAnimals.map((animal, index) => (
            <motion.div
              key={animal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{animal.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {animal.breed} • {animal.species} • {animal.weight} kg
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300">
                      {getDailyFeedAmount(animal)} kg/day
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="schedule" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="schedule">Schedule</TabsTrigger>
                      <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="schedule" className="space-y-3 mt-4">
                      <div className="space-y-2">
                        {getFeedingSchedule(animal.species).map((time, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{time}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {(getDailyFeedAmount(animal) / 3).toFixed(1)} kg
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setSelectedAnimal(animal);
                          setFeedingModalOpen(true);
                        }}
                      >
                        Record Feeding
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="nutrition" className="mt-4">
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Feed Type:</span>
                          <div className="font-medium">{getFeedType(animal.species)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Daily Amount:</span>
                          <div className="font-medium">{getDailyFeedAmount(animal)} kg</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cost per Day:</span>
                          <div className="font-medium">${(getDailyFeedAmount(animal) * 2.5).toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Protein Content:</span>
                          <div className="font-medium">{Math.floor(Math.random() * 10) + 15}%</div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="history" className="mt-4">
                      <div className="space-y-2 text-sm">
                        <div className="p-2 border rounded">
                          <div className="flex justify-between">
                            <span>Last Fed:</span>
                            <span className="font-medium">
                              {format(new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000), 'HH:mm')}
                            </span>
                          </div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="flex justify-between">
                            <span>Weekly Consumption:</span>
                            <span className="font-medium">
                              {(getDailyFeedAmount(animal) * 7).toFixed(1)} kg
                            </span>
                          </div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="flex justify-between">
                            <span>Feed Efficiency:</span>
                            <span className="font-medium text-green-600">
                              {(Math.random() * 0.5 + 2.5).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAnimals.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                No animals found matching your criteria.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <FeedingModal
        open={feedingModalOpen}
        onOpenChange={setFeedingModalOpen}
        animal={selectedAnimal}
      />
    </DashboardLayout>
  );
}