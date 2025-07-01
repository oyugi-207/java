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
import { Plus, Search, Filter, MoreHorizontal, Heart, Calendar, MapPin, Grid, List, QrCode } from 'lucide-react';
import { useFarmData } from '@/lib/data';
import { AnimalModal } from '@/components/animals/animal-modal';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function AnimalsPage() {
  const { animals } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [animalModalOpen, setAnimalModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || animal.species === speciesFilter;
    const matchesStatus = statusFilter === 'all' || animal.status === statusFilter;
    
    return matchesSearch && matchesSpecies && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'sick': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'pregnant': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300';
      case 'quarantine': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const openAnimalModal = (animal = null) => {
    setSelectedAnimal(animal);
    setAnimalModalOpen(true);
  };

  const generateQRCode = (animal: any) => {
    // Simulate QR code generation
    const qrData = {
      id: animal.id,
      name: animal.name,
      species: animal.species,
    };
    
    // In a real app, this would generate an actual QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    if (ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(animal.name, 10, 20);
      ctx.fillText(animal.species, 10, 40);
    }

    const link = document.createElement('a');
    link.download = `qr-${animal.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Animal Management</h1>
            <p className="text-muted-foreground">
              Manage your livestock with comprehensive tracking and health monitoring
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => openAnimalModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Animal
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Animals</p>
                  <p className="text-2xl font-bold text-blue-600">{animals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Healthy</p>
                  <p className="text-2xl font-bold text-green-600">
                    {animals.filter(a => a.status === 'healthy').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Need Attention</p>
                  <p className="text-2xl font-bold text-red-600">
                    {animals.filter(a => a.status === 'sick' || a.healthScore < 70).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pregnant</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {animals.filter(a => a.status === 'pregnant').length}
                  </p>
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

        {/* Animals Display */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map((animal, index) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
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
                            {animal.breed} • {animal.gender}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            generateQRCode(animal);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Badge variant="outline" className={getStatusColor(animal.status)}>
                          {animal.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent onClick={() => openAnimalModal(animal)}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Health Score</span>
                        </div>
                        <span className="font-semibold">{animal.healthScore}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Age</span>
                        </div>
                        <span className="text-sm">
                          {format(new Date(animal.birthDate), 'MMM yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Location</span>
                        </div>
                        <span className="text-sm">{animal.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Weight</span>
                        <span className="text-sm font-medium">{animal.weight} kg</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Animal</th>
                      <th className="text-left p-4">Species</th>
                      <th className="text-left p-4">Health</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Location</th>
                      <th className="text-left p-4">Weight</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnimals.map((animal, index) => (
                      <motion.tr
                        key={animal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => openAnimalModal(animal)}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={animal.image} alt={animal.name} />
                              <AvatarFallback>{animal.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{animal.name}</div>
                              <div className="text-sm text-muted-foreground">{animal.breed}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 capitalize">{animal.species}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>{animal.healthScore}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusColor(animal.status)}>
                            {animal.status}
                          </Badge>
                        </td>
                        <td className="p-4">{animal.location}</td>
                        <td className="p-4">{animal.weight} kg</td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateQRCode(animal);
                            }}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

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

      <AnimalModal
        open={animalModalOpen}
        onOpenChange={setAnimalModalOpen}
        animal={selectedAnimal}
      />
    </DashboardLayout>
  );
}