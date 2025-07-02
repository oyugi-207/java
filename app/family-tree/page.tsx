"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TreePine, Users, Heart, Dna, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFarmData } from '@/lib/data';
import { motion } from 'framer-motion';

export default function FamilyTreePage() {
  const { animals } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = selectedSpecies === 'all' || animal.species === selectedSpecies;
    return matchesSearch && matchesSpecies;
  });

  const getChildren = (parentId: string) => {
    return animals.filter(animal => animal.motherId === parentId || animal.fatherId === parentId);
  };

  const getParents = (animal: any) => {
    const mother = animal.motherId ? animals.find(a => a.id === animal.motherId) : null;
    const father = animal.fatherId ? animals.find(a => a.id === animal.fatherId) : null;
    return { mother, father };
  };

  const renderAnimalNode = (animal: any, level: number = 0) => {
    const children = getChildren(animal.id);
    const { mother, father } = getParents(animal);
    
    const getStatusColor = (status: string) => {
      const colors = {
        healthy: 'bg-green-100 text-green-800',
        sick: 'bg-red-100 text-red-800',
        pregnant: 'bg-purple-100 text-purple-800',
        sold: 'bg-yellow-100 text-yellow-800',
        deceased: 'bg-gray-100 text-gray-800',
        active: 'bg-blue-100 text-blue-800',
        quarantine: 'bg-orange-100 text-orange-800'
      };
      return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const calculateAge = (birthDate: string) => {
      const birth = new Date(birthDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - birth.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) return `${diffDays} days`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
      return `${Math.floor(diffDays / 365)} years`;
    };
    
    return (
      <motion.div
        key={animal.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.1, duration: 0.5 }}
        className={`ml-${level * 8}`}
      >
        <Card 
          className={`mb-4 cursor-pointer transition-all duration-200 ${
            selectedAnimal === animal.id ? 'ring-2 ring-emerald-500 shadow-lg' : 'hover:shadow-md'
          } ${animal.status === 'deceased' ? 'opacity-75 bg-gray-50' : ''}`}
          onClick={() => setSelectedAnimal(selectedAnimal === animal.id ? null : animal.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={animal.image} alt={animal.name} />
                <AvatarFallback className={animal.status === 'deceased' ? 'bg-gray-200' : ''}>
                  {animal.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <h3 className="font-semibold text-lg">{animal.name}</h3>
                  <Badge variant="outline">{animal.species}</Badge>
                  <Badge variant="outline">{animal.gender}</Badge>
                  <Badge className={getStatusColor(animal.status)}>
                    {animal.status}
                  </Badge>
                  {animal.id.startsWith('AID-') && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      ID: {animal.id}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {animal.breed} • Age: {calculateAge(animal.birthDate)} • Born: {new Date(animal.birthDate).toLocaleDateString()}
                </p>
                
                {/* Financial Information */}
                {(animal.acquisitionCost || animal.salePrice || animal.currentValue) && (
                  <div className="flex items-center space-x-4 mt-1 text-xs">
                    {animal.acquisitionCost && (
                      <span className="text-green-600">
                        Bought: ${animal.acquisitionCost.toLocaleString()}
                      </span>
                    )}
                    {animal.salePrice && (
                      <span className="text-yellow-600">
                        Sold: ${animal.salePrice.toLocaleString()}
                      </span>
                    )}
                    {animal.currentValue && (
                      <span className="text-blue-600">
                        Value: ${animal.currentValue.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-4 mt-2 flex-wrap">
                  {mother && (
                    <span className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                      ♀ Mother: {mother.name}
                    </span>
                  )}
                  {father && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      ♂ Father: {father.name}
                    </span>
                  )}
                  {children.length > 0 && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      👶 Children: {children.length}
                    </span>
                  )}
                  {animal.healthScore && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      animal.healthScore >= 80 ? 'text-green-600 bg-green-50' : 
                      animal.healthScore >= 60 ? 'text-yellow-600 bg-yellow-50' : 
                      'text-red-600 bg-red-50'
                    }`}>
                      ❤️ Health: {animal.healthScore}%
                    </span>
                  )}
                </div>

                {/* Additional Details */}
                {selectedAnimal === animal.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong>Location:</strong> {animal.location}
                      </div>
                      <div>
                        <strong>Purpose:</strong> {animal.purpose}
                      </div>
                      {animal.weight && (
                        <div>
                          <strong>Weight:</strong> {animal.weight} kg
                        </div>
                      )}
                      {animal.rfidTag && (
                        <div>
                          <strong>RFID:</strong> {animal.rfidTag}
                        </div>
                      )}
                      {animal.earTag && (
                        <div>
                          <strong>Ear Tag:</strong> {animal.earTag}
                        </div>
                      )}
                      {animal.acquisitionDate && (
                        <div>
                          <strong>Acquired:</strong> {new Date(animal.acquisitionDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {animal.notes && (
                      <div className="text-xs">
                        <strong>Notes:</strong> {animal.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {selectedAnimal === animal.id && children.length > 0 && (
          <div className="ml-8 border-l-2 border-emerald-200 pl-4">
            <h4 className="font-medium text-sm text-emerald-600 mb-2 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Offspring ({children.length}):
            </h4>
            {children.map(child => renderAnimalNode(child, level + 1))}
          </div>
        )}
      </motion.div>
    );
  };

  const rootAnimals = animals.filter(animal => !animal.motherId && !animal.fatherId);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
              <TreePine className="h-8 w-8 text-emerald-600" />
              <span>Family Tree</span>
            </h1>
            <p className="text-muted-foreground">
              Visualize genetic relationships and breeding lineages
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
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
                <TreePine className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Root Animals</p>
                  <p className="text-2xl font-bold text-green-600">{rootAnimals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Breeding Pairs</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {animals.filter(a => a.motherId || a.fatherId).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Dna className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Generations</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
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
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
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

        {/* Family Tree Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Genetic Lineage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAnimals.length > 0 ? (
                filteredAnimals.map(animal => renderAnimalNode(animal))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No animals found matching your criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}