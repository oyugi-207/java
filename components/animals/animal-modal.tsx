
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, QrCode, Download, Heart, MapPin, Scale, Ruler, DollarSign, Shield, Stethoscope, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Animal, useFarmAnimals, useDataStore } from '@/lib/data';

const animalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().min(1, 'Breed is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.enum(['male', 'female']),
  motherId: z.string().optional(),
  fatherId: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  weight: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  status: z.enum(['active', 'sold', 'deceased', 'sick', 'healthy', 'pregnant', 'quarantine', 'for_sale']),
  healthScore: z.number().min(0).max(100),
  qrCode: z.string().optional(),
  rfidTag: z.string().optional(),
  earTag: z.string().optional(),
  microchipId: z.string().optional(),
  color: z.string().optional(),
  markings: z.string().optional(),
  purpose: z.enum(['dairy', 'meat', 'breeding', 'pets', 'work', 'other']),
  acquisitionDate: z.string().optional(),
  acquisitionCost: z.number().min(0).optional(),
  currentValue: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
  insurance: z.boolean().optional(),
  insuranceProvider: z.string().optional(),
  veterinarian: z.string().optional(),
  feedType: z.string().optional(),
  feedSchedule: z.string().optional(),
  medicalHistory: z.string().optional(),
  notes: z.string().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface AnimalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: Animal;
}

export function AnimalModal({ open, onOpenChange, animal }: AnimalModalProps) {
  const animals = useFarmAnimals();
  const { addAnimal, updateAnimal } = useDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const isEditing = !!animal;

  const form = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      birthDate: '',
      gender: 'female',
      location: '',
      weight: undefined,
      height: undefined,
      status: 'healthy',
      healthScore: 100,
      purpose: 'other',
      insurance: false,
      qrCode: '',
      rfidTag: '',
      earTag: '',
      microchipId: '',
      color: '',
      markings: '',
      acquisitionDate: '',
      acquisitionCost: undefined,
      currentValue: undefined,
      insuranceProvider: '',
      veterinarian: '',
      feedType: '',
      feedSchedule: '',
      medicalHistory: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (animal && isEditing) {
      form.reset({
        name: animal.name,
        species: animal.species,
        breed: animal.breed,
        birthDate: animal.birthDate,
        gender: animal.gender,
        motherId: animal.motherId || '',
        fatherId: animal.fatherId || '',
        location: animal.location,
        weight: animal.weight,
        height: animal.height,
        status: animal.status,
        healthScore: animal.healthScore,
        qrCode: animal.qrCode || '',
        rfidTag: animal.rfidTag || '',
        earTag: animal.earTag || '',
        microchipId: animal.microchipId || '',
        color: animal.color || '',
        markings: animal.markings || '',
        purpose: animal.purpose,
        acquisitionDate: animal.acquisitionDate || '',
        acquisitionCost: animal.acquisitionCost,
        currentValue: animal.currentValue,
        insurance: animal.insurance || false,
        insuranceProvider: animal.insuranceProvider || '',
        veterinarian: animal.veterinarian || '',
        feedType: animal.feedType || '',
        feedSchedule: animal.feedSchedule || '',
        medicalHistory: animal.medicalHistory || '',
        notes: animal.notes || '',
      });
    } else {
      form.reset();
    }
  }, [animal, isEditing, form]);

  const onSubmit = async (data: AnimalFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && animal) {
        await updateAnimal(animal.id, data);
        toast.success('Animal updated successfully');
      } else {
        await addAnimal(data);
        toast.success('Animal added successfully');
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving animal:', error);
      toast.error('Failed to save animal');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = () => {
    if (!animal) return;

    const qrData = {
      id: animal.id,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      rfidTag: animal.rfidTag,
      earTag: animal.earTag,
      farmUrl: window.location.origin,
    };

    const qrContent = JSON.stringify(qrData);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    
    if (ctx) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      
      ctx.fillText(animal.name, 150, 40);
      ctx.font = '14px Arial';
      ctx.fillText(`${animal.species} - ${animal.breed}`, 150, 60);
      ctx.fillText(`ID: ${animal.id.slice(0, 8)}`, 150, 80);
      if (animal.rfidTag) ctx.fillText(`RFID: ${animal.rfidTag}`, 150, 100);
      if (animal.earTag) ctx.fillText(`Ear Tag: ${animal.earTag}`, 150, 120);
      
      // Simple QR-like pattern
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(50 + i * 20, 140 + j * 15, 15, 10);
          }
        }
      }
    }

    const link = document.createElement('a');
    link.download = `qr-${animal.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('QR code downloaded');
  };

  const potentialParents = animals.filter(a => 
    a.id !== animal?.id && 
    a.species === form.watch('species') &&
    a.status !== 'deceased'
  );

  const getStatusColor = (status: string) => {
    const colors = {
      healthy: 'status-healthy',
      sick: 'status-sick',
      pregnant: 'status-pregnant',
      quarantine: 'status-quarantine',
      active: 'status-active',
      sold: 'status-sold',
      deceased: 'status-deceased',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="farm-subheading">
              {isEditing ? `Edit ${animal?.name}` : 'Add New Animal'}
            </span>
            {isEditing && animal && (
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(animal.status)}>
                  {animal.status}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateQRCode}
                  className="no-print"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="identification">ID & Tags</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="breeding">Breeding</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-green-600" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      className="farm-input"
                      placeholder="Enter animal name"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="species">Species *</Label>
                    <Select value={form.watch('species')} onValueChange={(value) => form.setValue('species', value)}>
                      <SelectTrigger className="farm-select">
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cattle">Cattle</SelectItem>
                        <SelectItem value="sheep">Sheep</SelectItem>
                        <SelectItem value="goat">Goat</SelectItem>
                        <SelectItem value="pig">Pig</SelectItem>
                        <SelectItem value="chicken">Chicken</SelectItem>
                        <SelectItem value="horse">Horse</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed *</Label>
                    <Input
                      id="breed"
                      {...form.register('breed')}
                      className="farm-input"
                      placeholder="Enter breed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={form.watch('gender')} onValueChange={(value) => form.setValue('gender', value as 'male' | 'female')}>
                      <SelectTrigger className="farm-select">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...form.register('birthDate')}
                      className="farm-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      {...form.register('location')}
                      className="farm-input"
                      placeholder="e.g., Barn A, Field 3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      {...form.register('color')}
                      className="farm-input"
                      placeholder="e.g., Brown, Black & White"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="markings">Markings</Label>
                    <Input
                      id="markings"
                      {...form.register('markings')}
                      className="farm-input"
                      placeholder="Distinctive markings"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={form.watch('purpose')} onValueChange={(value) => form.setValue('purpose', value as any)}>
                      <SelectTrigger className="farm-select">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                        <SelectItem value="breeding">Breeding</SelectItem>
                        <SelectItem value="pets">Pets</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as any)}>
                      <SelectTrigger className="farm-select">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthy">Healthy</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="sick">Sick</SelectItem>
                        <SelectItem value="pregnant">Pregnant</SelectItem>
                        <SelectItem value="quarantine">Quarantine</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="deceased">Deceased</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="identification" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-blue-600" />
                    <span>Identification & Tags</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="earTag">Ear Tag</Label>
                    <Input
                      id="earTag"
                      {...form.register('earTag')}
                      className="farm-input"
                      placeholder="Ear tag number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rfidTag">RFID Tag</Label>
                    <Input
                      id="rfidTag"
                      {...form.register('rfidTag')}
                      className="farm-input"
                      placeholder="RFID tag number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="microchipId">Microchip ID</Label>
                    <Input
                      id="microchipId"
                      {...form.register('microchipId')}
                      className="farm-input"
                      placeholder="Microchip identifier"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qrCode">QR Code</Label>
                    <Input
                      id="qrCode"
                      {...form.register('qrCode')}
                      className="farm-input"
                      placeholder="QR code data"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5 text-red-600" />
                    <span>Health Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="healthScore">Health Score (0-100)</Label>
                      <Input
                        id="healthScore"
                        type="number"
                        min="0"
                        max="100"
                        {...form.register('healthScore', { valueAsNumber: true })}
                        className="farm-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        {...form.register('weight', { valueAsNumber: true })}
                        className="farm-input"
                        placeholder="Weight in kg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        {...form.register('height', { valueAsNumber: true })}
                        className="farm-input"
                        placeholder="Height in cm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="veterinarian">Veterinarian</Label>
                    <Input
                      id="veterinarian"
                      {...form.register('veterinarian')}
                      className="farm-input"
                      placeholder="Primary veterinarian"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      {...form.register('medicalHistory')}
                      className="farm-input min-h-[100px]"
                      placeholder="Medical history, treatments, vaccinations..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breeding" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                    <span>Breeding Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="motherId">Mother</Label>
                    <Select value={form.watch('motherId')} onValueChange={(value) => form.setValue('motherId', value)}>
                      <SelectTrigger className="farm-select">
                        <SelectValue placeholder="Select mother" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {potentialParents
                          .filter(a => a.gender === 'female')
                          .map((animal) => (
                            <SelectItem key={animal.id} value={animal.id}>
                              {animal.name} ({animal.breed})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherId">Father</Label>
                    <Select value={form.watch('fatherId')} onValueChange={(value) => form.setValue('fatherId', value)}>
                      <SelectTrigger className="farm-select">
                        <SelectValue placeholder="Select father" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {potentialParents
                          .filter(a => a.gender === 'male')
                          .map((animal) => (
                            <SelectItem key={animal.id} value={animal.id}>
                              {animal.name} ({animal.breed})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span>Financial Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                      <Input
                        id="acquisitionDate"
                        type="date"
                        {...form.register('acquisitionDate')}
                        className="farm-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="acquisitionCost">Acquisition Cost</Label>
                      <Input
                        id="acquisitionCost"
                        type="number"
                        step="0.01"
                        {...form.register('acquisitionCost', { valueAsNumber: true })}
                        className="farm-input"
                        placeholder="Purchase price"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentValue">Current Value</Label>
                      <Input
                        id="currentValue"
                        type="number"
                        step="0.01"
                        {...form.register('currentValue', { valueAsNumber: true })}
                        className="farm-input"
                        placeholder="Current estimated value"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Input
                        id="insuranceProvider"
                        {...form.register('insuranceProvider')}
                        className="farm-input"
                        placeholder="Insurance company"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={form.watch('insurance')}
                      onCheckedChange={(checked) => form.setValue('insurance', checked)}
                    />
                    <Label className="text-sm">Animal is insured</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Utensils className="h-5 w-5 text-orange-600" />
                    <span>Care & Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="feedType">Feed Type</Label>
                      <Input
                        id="feedType"
                        {...form.register('feedType')}
                        className="farm-input"
                        placeholder="Type of feed"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedSchedule">Feed Schedule</Label>
                      <Input
                        id="feedSchedule"
                        {...form.register('feedSchedule')}
                        className="farm-input"
                        placeholder="e.g., 3x daily, morning/evening"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      {...form.register('notes')}
                      className="farm-input min-h-[120px]"
                      placeholder="Any additional notes, behaviors, special care instructions..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="farm-button"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update Animal' : 'Add Animal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
