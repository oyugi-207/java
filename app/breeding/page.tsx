"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Heart, Calendar, Dna, Baby, TrendingUp } from 'lucide-react';
import { useFarmData } from '@/lib/data';
import { BreedingModal } from '@/components/breeding/breeding-modal';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';

export default function BreedingPage() {
  const { animals } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [breedingModalOpen, setBreedingModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const breedingAnimals = animals.filter(animal => 
    animal.gender === 'female' && 
    (animal.status === 'healthy' || animal.status === 'pregnant')
  );

  const filteredAnimals = breedingAnimals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || animal.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const breedingStats = {
    totalFemales: animals.filter(a => a.gender === 'female').length,
    pregnant: animals.filter(a => a.status === 'pregnant').length,
    readyToBreed: animals.filter(a => a.gender === 'female' && a.status === 'healthy').length,
    totalMales: animals.filter(a => a.gender === 'male').length,
  };

  const getPregnancyProgress = (animal: any) => {
    if (animal.status !== 'pregnant') return 0;
    // Mock pregnancy start date (in real app, this would be stored)
    const pregnancyStart = new Date(Date.now() - (Math.random() * 200 + 50) * 24 * 60 * 60 * 1000);
    const daysPassed = differenceInDays(new Date(), pregnancyStart);
    const gestationPeriod = animal.species === 'cow' ? 280 : 
                           animal.species === 'pig' ? 114 : 
                           animal.species === 'sheep' ? 147 : 
                           animal.species === 'goat' ? 150 : 340; // horse
    return Math.min((daysPassed / gestationPeriod) * 100, 100);
  };

  const getExpectedDueDate = (animal: any) => {
    if (animal.status !== 'pregnant') return null;
    const pregnancyStart = new Date(Date.now() - (Math.random() * 200 + 50) * 24 * 60 * 60 * 1000);
    const gestationPeriod = animal.species === 'cow' ? 280 : 
                           animal.species === 'pig' ? 114 : 
                           animal.species === 'sheep' ? 147 : 
                           animal.species === 'goat' ? 150 : 340;
    return new Date(pregnancyStart.getTime() + gestationPeriod * 24 * 60 * 60 * 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Breeding Management</h1>
            <p className="text-muted-foreground">
              Manage breeding programs, track pregnancies, and optimize genetics
            </p>
          </div>
          <Button onClick={() => setBreedingModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Plan Breeding
          </Button>
        </div>

        {/* Breeding Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Females</p>
                  <p className="text-2xl font-bold text-pink-600">{breedingStats.totalFemales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Baby className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pregnant</p>
                  <p className="text-2xl font-bold text-purple-600">{breedingStats.pregnant}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Ready to Breed</p>
                  <p className="text-2xl font-bold text-green-600">{breedingStats.readyToBreed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Dna className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Males</p>
                  <p className="text-2xl font-bold text-blue-600">{breedingStats.totalMales}</p>
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
                  placeholder="Search breeding animals..."
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
                  <SelectItem value="sheep">Sheep</SelectItem>
                  <SelectItem value="goat">Goat</SelectItem>
                  <SelectItem value="horse">Horse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Breeding Animals */}
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
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={animal.image} alt={animal.name} />
                        <AvatarFallback>{animal.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{animal.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {animal.breed} • {animal.species}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={animal.status === 'pregnant' ? 
                        'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300' :
                        'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300'
                      }
                    >
                      {animal.status === 'pregnant' ? 'Pregnant' : 'Available'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="status" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="status">Status</TabsTrigger>
                      <TabsTrigger value="genetics">Genetics</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="status" className="space-y-3 mt-4">
                      {animal.status === 'pregnant' ? (
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Pregnancy Progress</span>
                              <span>{Math.round(getPregnancyProgress(animal))}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getPregnancyProgress(animal)}%` }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Due Date:</span>
                              <div className="font-medium">
                                {getExpectedDueDate(animal) ? 
                                  format(getExpectedDueDate(animal)!, 'MMM dd, yyyy') : 
                                  'Unknown'
                                }
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Days Left:</span>
                              <div className="font-medium">
                                {getExpectedDueDate(animal) ? 
                                  Math.max(0, differenceInDays(getExpectedDueDate(animal)!, new Date())) :
                                  'Unknown'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Age:</span>
                              <div className="font-medium">
                                {format(new Date(animal.birthDate), 'MMM yyyy')}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight:</span>
                              <div className="font-medium">{animal.weight} kg</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Health Score:</span>
                              <div className="font-medium text-green-600">{animal.healthScore}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <div className="font-medium">{animal.location}</div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedAnimal(animal);
                              setBreedingModalOpen(true);
                            }}
                          >
                            Plan Breeding
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="genetics" className="mt-4">
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Mother:</span>
                          <div className="font-medium">
                            {animal.motherId ? 
                              animals.find(a => a.id === animal.motherId)?.name || 'Unknown' :
                              'Not recorded'
                            }
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Father:</span>
                          <div className="font-medium">
                            {animal.fatherId ? 
                              animals.find(a => a.id === animal.fatherId)?.name || 'Unknown' :
                              'Not recorded'
                            }
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Genetic Score:</span>
                          <div className="font-medium text-blue-600">
                            {Math.floor(Math.random() * 20) + 80}%
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="history" className="mt-4">
                      <div className="space-y-2 text-sm">
                        <div className="p-2 border rounded">
                          <div className="font-medium">Previous Breeding</div>
                          <div className="text-muted-foreground">
                            Last bred: {format(new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), 'MMM yyyy')}
                          </div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="font-medium">Offspring Count</div>
                          <div className="text-muted-foreground">
                            Total offspring: {Math.floor(Math.random() * 5) + 1}
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
                No breeding animals found matching your criteria.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BreedingModal
        open={breedingModalOpen}
        onOpenChange={setBreedingModalOpen}
        animal={selectedAnimal}
      />
    </DashboardLayout>
  );
}