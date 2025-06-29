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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Heart, Dna, FileText, Plus, Trash2, QrCode, Nfc, Tag, Microchip } from 'lucide-react';
import { useData, type Animal } from '@/lib/data';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const animalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.enum(['cow', 'pig', 'chicken', 'sheep', 'goat', 'horse']),
  breed: z.string().min(1, 'Breed is required'),
  gender: z.enum(['male', 'female']),
  birthDate: z.string().min(1, 'Birth date is required'),
  weight: z.number().min(1, 'Weight must be greater than 0'),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
  motherId: z.string().optional(),
  fatherId: z.string().optional(),
  rfidTag: z.string().optional(),
  earTag: z.string().optional(),
  microchipId: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  supplier: z.string().optional(),
  insurance: z.string().optional(),
  veterinarian: z.string().optional(),
  color: z.string().optional(),
  markings: z.string().optional(),
  registrationNumber: z.string().optional(),
  previousOwner: z.string().optional(),
  medicalHistory: z.string().optional(),
});

type AnimalForm = z.infer<typeof animalSchema>;

interface AnimalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: Animal | null;
}

export function AnimalModal({ open, onOpenChange, animal }: AnimalModalProps) {
  const { animals, addAnimal, updateAnimal, deleteAnimal } = useData();
  const [activeTab, setActiveTab] = useState('basic');
  const isEditing = !!animal;

  const form = useForm<AnimalForm>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      name: '',
      species: 'cow',
      breed: '',
      gender: 'female',
      birthDate: '',
      weight: 0,
      location: '',
      notes: '',
      motherId: 'none',
      fatherId: 'none',
      rfidTag: '',
      earTag: '',
      microchipId: '',
      purchaseDate: '',
      purchasePrice: 0,
      supplier: '',
      insurance: '',
      veterinarian: '',
      color: '',
      markings: '',
      registrationNumber: '',
      previousOwner: '',
      medicalHistory: '',
    },
  });

  useEffect(() => {
    if (animal) {
      form.reset({
        name: animal.name,
        species: animal.species,
        breed: animal.breed,
        gender: animal.gender,
        birthDate: animal.birthDate,
        weight: animal.weight,
        location: animal.location,
        notes: animal.notes,
        motherId: animal.motherId || 'none',
        fatherId: animal.fatherId || 'none',
        rfidTag: animal.rfidTag || '',
        earTag: animal.earTag || '',
        microchipId: animal.microchipId || '',
        purchaseDate: '',
        purchasePrice: 0,
        supplier: '',
        insurance: '',
        veterinarian: '',
        color: '',
        markings: '',
        registrationNumber: '',
        previousOwner: '',
        medicalHistory: '',
      });
    } else {
      form.reset({
        name: '',
        species: 'cow',
        breed: '',
        gender: 'female',
        birthDate: '',
        weight: 0,
        location: '',
        notes: '',
        motherId: 'none',
        fatherId: 'none',
        rfidTag: '',
        earTag: '',
        microchipId: '',
        purchaseDate: '',
        purchasePrice: 0,
        supplier: '',
        insurance: '',
        veterinarian: '',
        color: '',
        markings: '',
        registrationNumber: '',
        previousOwner: '',
        medicalHistory: '',
      });
    }
  }, [animal, form]);

  const onSubmit = (data: AnimalForm) => {
    try {
      const processedData = {
        ...data,
        motherId: data.motherId === 'none' ? undefined : data.motherId,
        fatherId: data.fatherId === 'none' ? undefined : data.fatherId,
        rfidTag: data.rfidTag || undefined,
        earTag: data.earTag || undefined,
        microchipId: data.microchipId || undefined,
        purchasePrice: data.purchasePrice || undefined,
        purchaseDate: data.purchaseDate || undefined,
        supplier: data.supplier || undefined,
        insurance: data.insurance || undefined,
        veterinarian: data.veterinarian || undefined,
        color: data.color || undefined,
        markings: data.markings || undefined,
        registrationNumber: data.registrationNumber || undefined,
        previousOwner: data.previousOwner || undefined,
        medicalHistory: data.medicalHistory || undefined,
      };

      if (isEditing && animal) {
        updateAnimal(animal.id, {
          ...processedData,
          healthScore: animal.healthScore,
          status: animal.status,
          image: animal.image,
          vaccinations: animal.vaccinations,
          treatments: animal.treatments,
          measurements: animal.measurements,
        });
        toast.success('Animal updated successfully');
      } else {
        addAnimal({
          ...processedData,
          healthScore: 95,
          status: 'healthy',
          vaccinations: [],
          treatments: [],
          measurements: [],
        });
        toast.success('Animal added successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save animal');
    }
  };

  const handleDelete = () => {
    if (animal && window.confirm('Are you sure you want to delete this animal?')) {
      deleteAnimal(animal.id);
      toast.success('Animal deleted successfully');
      onOpenChange(false);
    }
  };

  const generateQRCode = () => {
    if (!animal) return;
    
    const qrData = {
      id: animal.id,
      name: animal.name,
      species: animal.species,
      rfidTag: animal.rfidTag,
      earTag: animal.earTag,
    };

    // Create QR code content
    const qrContent = JSON.stringify(qrData);
    
    // Create a downloadable QR code (simplified version)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    if (ctx) {
      // Simple QR-like pattern
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(animal.name, 10, 20);
      ctx.fillText(animal.species, 10, 40);
      ctx.fillText(`ID: ${animal.id.slice(0, 8)}`, 10, 60);
      if (animal.rfidTag) ctx.fillText(`RFID: ${animal.rfidTag}`, 10, 80);
      if (animal.earTag) ctx.fillText(`Ear: ${animal.earTag}`, 10, 100);
    }

    const link = document.createElement('a');
    link.download = `qr-${animal.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('QR code downloaded');
  };

  const potentialParents = animals.filter(a => 
    a.id !== animal?.id && 
    a.species === form.watch('species')
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit ${animal?.name}` : 'Add New Animal'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="identification">ID & Tags</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="breeding">Breeding</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
          </TabsList>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Enter animal name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Species *</Label>
                  <Select value={form.watch('species')} onValueChange={(value) => form.setValue('species', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cow">Cow</SelectItem>
                      <SelectItem value="pig">Pig</SelectItem>
                      <SelectItem value="chicken">Chicken</SelectItem>
                      <SelectItem value="sheep">Sheep</SelectItem>
                      <SelectItem value="goat">Goat</SelectItem>
                      <SelectItem value="horse">Horse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed *</Label>
                  <Input
                    id="breed"
                    {...form.register('breed')}
                    placeholder="Enter breed"
                  />
                  {form.formState.errors.breed && (
                    <p className="text-sm text-red-500">{form.formState.errors.breed.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={form.watch('gender')} onValueChange={(value) => form.setValue('gender', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
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
                  />
                  {form.formState.errors.birthDate && (
                    <p className="text-sm text-red-500">{form.formState.errors.birthDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    {...form.register('weight', { valueAsNumber: true })}
                    placeholder="Enter weight"
                  />
                  {form.formState.errors.weight && (
                    <p className="text-sm text-red-500">{form.formState.errors.weight.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    {...form.register('location')}
                    placeholder="Enter current location"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    {...form.register('purchaseDate')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    {...form.register('purchasePrice', { valueAsNumber: true })}
                    placeholder="Enter purchase price"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    {...form.register('supplier')}
                    placeholder="Enter supplier name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="veterinarian">Primary Veterinarian</Label>
                  <Input
                    id="veterinarian"
                    {...form.register('veterinarian')}
                    placeholder="Enter veterinarian name"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="identification" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rfidTag" className="flex items-center space-x-2">
                    <Nfc className="h-4 w-4" />
                    <span>RFID Tag</span>
                  </Label>
                  <Input
                    id="rfidTag"
                    {...form.register('rfidTag')}
                    placeholder="Enter RFID tag number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="earTag" className="flex items-center space-x-2">
                    <Tag className="h-4 w-4" />
                    <span>Ear Tag</span>
                  </Label>
                  <Input
                    id="earTag"
                    {...form.register('earTag')}
                    placeholder="Enter ear tag number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="microchipId" className="flex items-center space-x-2">
                    <Microchip className="h-4 w-4" />
                    <span>Microchip ID</span>
                  </Label>
                  <Input
                    id="microchipId"
                    {...form.register('microchipId')}
                    placeholder="Enter microchip ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    {...form.register('registrationNumber')}
                    placeholder="Enter registration number"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="insurance">Insurance Policy</Label>
                  <Input
                    id="insurance"
                    {...form.register('insurance')}
                    placeholder="Enter insurance policy number"
                  />
                </div>
              </div>

              {isEditing && animal && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <QrCode className="h-5 w-5 text-blue-500" />
                      <span>Quick Identification</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={generateQRCode}>
                        <QrCode className="h-4 w-4 mr-2" />
                        Generate QR Code
                      </Button>
                      <Button type="button" variant="outline">
                        <Nfc className="h-4 w-4 mr-2" />
                        Print RFID Label
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="physical" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color/Coat</Label>
                  <Input
                    id="color"
                    {...form.register('color')}
                    placeholder="Enter color description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="markings">Markings</Label>
                  <Input
                    id="markings"
                    {...form.register('markings')}
                    placeholder="Enter distinctive markings"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="previousOwner">Previous Owner</Label>
                  <Input
                    id="previousOwner"
                    {...form.register('previousOwner')}
                    placeholder="Enter previous owner information"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              {isEditing && animal ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <span>Health Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Health Score</Label>
                          <div className="text-2xl font-bold text-green-600">
                            {animal.healthScore}%
                          </div>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Badge className="mt-1">{animal.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      {...form.register('medicalHistory')}
                      placeholder="Enter medical history and notes..."
                      rows={4}
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Vaccinations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {animal.vaccinations.length > 0 ? (
                        <div className="space-y-3">
                          {animal.vaccinations.map((vaccination) => (
                            <div key={vaccination.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{vaccination.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Given: {format(new Date(vaccination.date), 'MMM dd, yyyy')}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Next due: {format(new Date(vaccination.nextDue), 'MMM dd, yyyy')}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  {vaccination.veterinarian}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No vaccinations recorded</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Treatments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {animal.treatments.length > 0 ? (
                        <div className="space-y-3">
                          {animal.treatments.map((treatment) => (
                            <div key={treatment.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{treatment.condition}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Medication: {treatment.medication}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(treatment.startDate), 'MMM dd, yyyy')} - 
                                    {format(new Date(treatment.endDate), 'MMM dd, yyyy')}
                                  </p>
                                </div>
                                <Badge variant={treatment.status === 'completed' ? 'default' : 'secondary'}>
                                  {treatment.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No treatments recorded</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    Health records will be available after the animal is created
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      {...form.register('medicalHistory')}
                      placeholder="Enter medical history and notes..."
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="breeding" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motherId">Mother</Label>
                  <Select value={form.watch('motherId')} onValueChange={(value) => form.setValue('motherId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mother" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No mother selected</SelectItem>
                      {potentialParents.filter(a => a.gender === 'female').map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name} ({parent.breed})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherId">Father</Label>
                  <Select value={form.watch('fatherId')} onValueChange={(value) => form.setValue('fatherId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select father" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No father selected</SelectItem>
                      {potentialParents.filter(a => a.gender === 'male').map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name} ({parent.breed})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isEditing && animal && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Dna className="h-5 w-5 text-purple-500" />
                      <span>Lineage Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {animal.motherId && (
                        <div>
                          <Label>Mother</Label>
                          <p className="text-sm">
                            {animals.find(a => a.id === animal.motherId)?.name || 'Unknown'}
                          </p>
                        </div>
                      )}
                      {animal.fatherId && (
                        <div>
                          <Label>Father</Label>
                          <p className="text-sm">
                            {animals.find(a => a.id === animal.fatherId)?.name || 'Unknown'}
                          </p>
                        </div>
                      )}
                      {!animal.motherId && !animal.fatherId && (
                        <p className="text-muted-foreground">No lineage information available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="records" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes & Additional Information</Label>
                <Textarea
                  id="notes"
                  {...form.register('notes')}
                  placeholder="Enter any additional notes about this animal..."
                  rows={6}
                />
              </div>

              {isEditing && animal && animal.measurements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Measurements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {animal.measurements
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((measurement) => (
                          <div key={measurement.id} className="flex justify-between items-center p-2 border rounded">
                            <span className="capitalize">{measurement.type.replace('_', ' ')}</span>
                            <span className="font-medium">
                              {measurement.value} {measurement.unit}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(measurement.date), 'MMM dd')}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <Separator className="my-6" />

            <div className="flex justify-between">
              <div>
                {isEditing && (
                  <Button type="button" variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Animal
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Animal' : 'Add Animal'}
                </Button>
              </div>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}