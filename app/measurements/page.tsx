"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Activity, Plus, TrendingUp, Scale, Thermometer, Heart, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmData } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MeasurementsPage() {
  const { animals, addMeasurement } = useFarmData();
  const [measurementModalOpen, setMeasurementModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [newMeasurement, setNewMeasurement] = useState({
    type: 'weight' as 'weight' | 'height' | 'temperature' | 'heart_rate' | 'milk_production',
    value: '',
    unit: 'kg',
    notes: '',
  });

  const getMeasurementIcon = (type: string) => {
    switch (type) {
      case 'weight': return Scale;
      case 'height': return TrendingUp;
      case 'temperature': return Thermometer;
      case 'heart_rate': return Heart;
      case 'milk_production': return Droplets;
      default: return Activity;
    }
  };

  const getMeasurementUnit = (type: string) => {
    switch (type) {
      case 'weight': return 'kg';
      case 'height': return 'cm';
      case 'temperature': return '°C';
      case 'heart_rate': return 'bpm';
      case 'milk_production': return 'liters';
      default: return 'units';
    }
  };

  const handleAddMeasurement = () => {
    if (!selectedAnimal || !newMeasurement.value) {
      toast.error('Please select an animal and enter a value');
      return;
    }

    addMeasurement(selectedAnimal, {
      type: newMeasurement.type,
      value: parseFloat(newMeasurement.value),
      unit: newMeasurement.unit,
      date: new Date().toISOString(),
      notes: newMeasurement.notes,
    });

    setNewMeasurement({
      type: 'weight',
      value: '',
      unit: 'kg',
      notes: '',
    });
    setSelectedAnimal('');
    setMeasurementModalOpen(false);
    toast.success('Measurement recorded successfully');
  };

  const getAnimalMeasurements = (animalId: string, type: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return [];
    
    return animal.measurements
      .filter(m => m.type === type)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Last 10 measurements
  };

  const measurementTypes = [
    { type: 'weight', label: 'Weight', icon: Scale, color: 'text-blue-600' },
    { type: 'height', label: 'Height', icon: TrendingUp, color: 'text-green-600' },
    { type: 'temperature', label: 'Temperature', icon: Thermometer, color: 'text-red-600' },
    { type: 'heart_rate', label: 'Heart Rate', icon: Heart, color: 'text-pink-600' },
    { type: 'milk_production', label: 'Milk Production', icon: Droplets, color: 'text-cyan-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Animal Measurements</h1>
            <p className="text-muted-foreground">
              Track and monitor vital measurements for optimal animal health
            </p>
          </div>
          <Button onClick={() => setMeasurementModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Measurement
          </Button>
        </div>

        {/* Measurement Types */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {measurementTypes.map((type) => {
            const IconComponent = type.icon;
            const totalMeasurements = animals.reduce((sum, animal) => 
              sum + animal.measurements.filter(m => m.type === type.type).length, 0
            );
            
            return (
              <Card key={type.type}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-5 w-5 ${type.color}`} />
                    <div>
                      <p className="text-sm text-muted-foreground">{type.label}</p>
                      <p className={`text-2xl font-bold ${type.color}`}>{totalMeasurements}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Animals with Measurements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {animals.filter(animal => animal.measurements.length > 0).map((animal, index) => (
            <motion.div
              key={animal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <span>{animal.name}</span>
                    <Badge variant="outline">{animal.species}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Latest Measurements */}
                    <div className="grid grid-cols-2 gap-4">
                      {measurementTypes.map((type) => {
                        const measurements = animal.measurements.filter(m => m.type === type.type);
                        const latest = measurements[measurements.length - 1];
                        const IconComponent = type.icon;
                        
                        return (
                          <div key={type.type} className="p-3 border rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <IconComponent className={`h-4 w-4 ${type.color}`} />
                              <span className="text-sm font-medium">{type.label}</span>
                            </div>
                            {latest ? (
                              <div>
                                <div className="text-lg font-bold">
                                  {latest.value} {latest.unit}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(latest.date), 'MMM dd, HH:mm')}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">No data</div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Weight Trend Chart */}
                    {animal.measurements.filter(m => m.type === 'weight').length > 1 && (
                      <div>
                        <h4 className="font-medium mb-3">Weight Trend</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={getAnimalMeasurements(animal.id, 'weight').map(m => ({
                            date: format(new Date(m.date), 'MMM dd'),
                            weight: m.value,
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="weight" 
                              stroke="#22c55e" 
                              strokeWidth={2}
                              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Recent Measurements */}
                    <div>
                      <h4 className="font-medium mb-3">Recent Measurements</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {animal.measurements
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 5)
                          .map((measurement) => {
                            const IconComponent = getMeasurementIcon(measurement.type);
                            return (
                              <div key={measurement.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="h-3 w-3 text-gray-500" />
                                  <span className="capitalize">{measurement.type.replace('_', ' ')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {measurement.value} {measurement.unit}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {format(new Date(measurement.date), 'MMM dd')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {animals.filter(animal => animal.measurements.length > 0).length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Measurements Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start recording measurements to track your animals' health and growth
              </p>
              <Button onClick={() => setMeasurementModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Record First Measurement
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Measurement Modal */}
      <Dialog open={measurementModalOpen} onOpenChange={setMeasurementModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Measurement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="animal">Animal *</Label>
              <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an animal" />
                </SelectTrigger>
                <SelectContent>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.name} ({animal.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Measurement Type *</Label>
              <Select 
                value={newMeasurement.type} 
                onValueChange={(value: any) => {
                  setNewMeasurement(prev => ({ 
                    ...prev, 
                    type: value,
                    unit: getMeasurementUnit(value)
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="height">Height</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="heart_rate">Heart Rate</SelectItem>
                  <SelectItem value="milk_production">Milk Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.1"
                  value={newMeasurement.value}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Enter value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={newMeasurement.unit}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, unit: e.target.value }))}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={newMeasurement.notes}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter any additional notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setMeasurementModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMeasurement}>
                Record Measurement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}