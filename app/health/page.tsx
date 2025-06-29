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
import { Plus, Search, Heart, AlertTriangle, Calendar, Syringe, Pill, Activity } from 'lucide-react';
import { useData } from '@/lib/data';
import { HealthModal } from '@/components/health/health-modal';
import { VaccinationModal } from '@/components/health/vaccination-modal';
import { TreatmentModal } from '@/components/health/treatment-modal';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function HealthPage() {
  const { animals, healthRecords } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [vaccinationModalOpen, setVaccinationModalOpen] = useState(false);
  const [treatmentModalOpen, setTreatmentModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || animal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const healthStats = {
    healthy: animals.filter(a => a.status === 'healthy').length,
    sick: animals.filter(a => a.status === 'sick').length,
    pregnant: animals.filter(a => a.status === 'pregnant').length,
    quarantine: animals.filter(a => a.status === 'quarantine').length,
    avgHealthScore: animals.length > 0 ? Math.round(animals.reduce((sum, a) => sum + a.healthScore, 0) / animals.length) : 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'sick': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'pregnant': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300';
      case 'quarantine': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAnimalHealthRecords = (animalId: string) => {
    return healthRecords.filter(record => record.animalId === animalId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Health Management</h1>
            <p className="text-muted-foreground">
              Monitor animal health, manage treatments, and track vaccinations
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setVaccinationModalOpen(true)} variant="outline">
              <Syringe className="h-4 w-4 mr-2" />
              Add Vaccination
            </Button>
            <Button onClick={() => setTreatmentModalOpen(true)} variant="outline">
              <Pill className="h-4 w-4 mr-2" />
              Add Treatment
            </Button>
            <Button onClick={() => setHealthModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Health Check
            </Button>
          </div>
        </div>

        {/* Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Healthy</p>
                  <p className="text-2xl font-bold text-green-600">{healthStats.healthy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Sick</p>
                  <p className="text-2xl font-bold text-red-600">{healthStats.sick}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pregnant</p>
                  <p className="text-2xl font-bold text-purple-600">{healthStats.pregnant}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Quarantine</p>
                  <p className="text-2xl font-bold text-yellow-600">{healthStats.quarantine}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Health</p>
                  <p className="text-2xl font-bold text-blue-600">{healthStats.avgHealthScore}%</p>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="pregnant">Pregnant</SelectItem>
                  <SelectItem value="quarantine">Quarantine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Animals Health List */}
        {filteredAnimals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAnimals.map((animal, index) => {
              const animalHealthRecords = getAnimalHealthRecords(animal.id);
              const latestRecord = animalHealthRecords[0];
              
              return (
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
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getHealthScoreColor(animal.healthScore)}`}>
                            {animal.healthScore}%
                          </div>
                          <Badge variant="outline" className={getStatusColor(animal.status)}>
                            {animal.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="records">Records</TabsTrigger>
                          <TabsTrigger value="actions">Actions</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="overview" className="space-y-3 mt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <span className="ml-2 font-medium">{animal.location}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="ml-2 font-medium">{animal.weight} kg</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Age:</span>
                              <span className="ml-2 font-medium">
                                {format(new Date(animal.birthDate), 'MMM yyyy')}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Gender:</span>
                              <span className="ml-2 font-medium capitalize">{animal.gender}</span>
                            </div>
                          </div>
                          
                          {latestRecord && (
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <h4 className="font-medium text-sm mb-2">Latest Health Check</h4>
                              <div className="text-sm space-y-1">
                                <div>Date: {format(new Date(latestRecord.date), 'MMM dd, yyyy')}</div>
                                {latestRecord.temperature && (
                                  <div>Temperature: {latestRecord.temperature}°C</div>
                                )}
                                {latestRecord.veterinarian && (
                                  <div>Vet: {latestRecord.veterinarian}</div>
                                )}
                              </div>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="records" className="mt-4">
                          {animalHealthRecords.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {animalHealthRecords.slice(0, 3).map((record) => (
                                <div key={record.id} className="p-2 border rounded text-sm">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">Health Score: {record.healthScore}%</div>
                                      <div className="text-muted-foreground">
                                        {format(new Date(record.date), 'MMM dd, yyyy')}
                                      </div>
                                      {record.notes && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                          {record.notes.substring(0, 50)}...
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {animalHealthRecords.length > 3 && (
                                <div className="text-sm text-muted-foreground text-center">
                                  +{animalHealthRecords.length - 3} more records
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No health records found</p>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="actions" className="mt-4">
                          <div className="space-y-2">
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setSelectedAnimal(animal);
                                setHealthModalOpen(true);
                              }}
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Record Health Check
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                setSelectedAnimal(animal);
                                setVaccinationModalOpen(true);
                              }}
                            >
                              <Syringe className="h-4 w-4 mr-2" />
                              Add Vaccination
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                setSelectedAnimal(animal);
                                setTreatmentModalOpen(true);
                              }}
                            >
                              <Pill className="h-4 w-4 mr-2" />
                              Add Treatment
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                {animals.length === 0 
                  ? "No animals registered yet. Add your first animal to start tracking health records."
                  : "No animals found matching your criteria."
                }
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <HealthModal
        open={healthModalOpen}
        onOpenChange={setHealthModalOpen}
        animal={selectedAnimal}
      />
      
      <VaccinationModal
        open={vaccinationModalOpen}
        onOpenChange={setVaccinationModalOpen}
        animal={selectedAnimal}
      />
      
      <TreatmentModal
        open={treatmentModalOpen}
        onOpenChange={setTreatmentModalOpen}
        animal={selectedAnimal}
      />
    </DashboardLayout>
  );
}