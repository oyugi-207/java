"use client";

import { useState } from 'react';
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
import { useData } from '@/lib/data';
import toast from 'react-hot-toast';
import { addDays, format } from 'date-fns';

const breedingRecordSchema = z.object({
  femaleId: z.string().min(1, 'Please select a female animal'),
  maleId: z.string().min(1, 'Please select a male animal'),
  breedingDate: z.string().min(1, 'Breeding date is required'),
  method: z.enum(['natural', 'ai', 'embryo']),
  notes: z.string().optional(),
});

type BreedingRecordForm = z.infer<typeof breedingRecordSchema>;

interface BreedingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: any;
}

export function BreedingModal({ open, onOpenChange, animal }: BreedingModalProps) {
  const { animals, addBreedingRecord, updateAnimal } = useData();

  const femaleAnimals = animals.filter(a => a.gender === 'female' && (a.status === 'healthy' || a.status === 'pregnant'));
  const maleAnimals = animals.filter(a => a.gender === 'male' && a.status === 'healthy');

  const form = useForm<BreedingRecordForm>({
    resolver: zodResolver(breedingRecordSchema),
    defaultValues: {
      femaleId: animal?.gender === 'female' ? animal.id : '',
      maleId: animal?.gender === 'male' ? animal.id : '',
      breedingDate: format(new Date(), 'yyyy-MM-dd'),
      method: 'natural',
      notes: '',
    },
  });

  const calculateDueDate = (breedingDate: string, species: string) => {
    const gestationPeriods: Record<string, number> = {
      cow: 280,
      pig: 114,
      sheep: 147,
      goat: 150,
      horse: 340,
      chicken: 21,
    };
    
    const days = gestationPeriods[species] || 280;
    return addDays(new Date(breedingDate), days);
  };

  const onSubmit = (data: BreedingRecordForm) => {
    try {
      const femaleAnimal = animals.find(a => a.id === data.femaleId);
      const expectedDueDate = femaleAnimal ? calculateDueDate(data.breedingDate, femaleAnimal.species) : null;
      
      addBreedingRecord({
        ...data,
        expectedDueDate: expectedDueDate?.toISOString(),
        status: 'completed',
        notes: data.notes || '',
      });

      // Update female animal status to pregnant
      if (femaleAnimal) {
        updateAnimal(data.femaleId, { status: 'pregnant' });
      }
      
      toast.success('Breeding record created successfully');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to create breeding record');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Plan Breeding</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="femaleId">Female Animal *</Label>
            <Select value={form.watch('femaleId')} onValueChange={(value) => form.setValue('femaleId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select female animal" />
              </SelectTrigger>
              <SelectContent>
                {femaleAnimals.map((animal) => (
                  <SelectItem key={animal.id} value={animal.id}>
                    {animal.name} ({animal.species} - {animal.breed})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.femaleId && (
              <p className="text-sm text-red-500">{form.formState.errors.femaleId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maleId">Male Animal *</Label>
            <Select value={form.watch('maleId')} onValueChange={(value) => form.setValue('maleId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select male animal" />
              </SelectTrigger>
              <SelectContent>
                {maleAnimals.map((animal) => (
                  <SelectItem key={animal.id} value={animal.id}>
                    {animal.name} ({animal.species} - {animal.breed})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.maleId && (
              <p className="text-sm text-red-500">{form.formState.errors.maleId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="breedingDate">Breeding Date *</Label>
            <Input
              id="breedingDate"
              type="date"
              {...form.register('breedingDate')}
            />
            {form.formState.errors.breedingDate && (
              <p className="text-sm text-red-500">{form.formState.errors.breedingDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Breeding Method *</Label>
            <Select value={form.watch('method')} onValueChange={(value) => form.setValue('method', value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="natural">Natural Breeding</SelectItem>
                <SelectItem value="ai">Artificial Insemination</SelectItem>
                <SelectItem value="embryo">Embryo Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.watch('femaleId') && form.watch('breedingDate') && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Expected Due Date:</strong>{' '}
                {(() => {
                  const female = animals.find(a => a.id === form.watch('femaleId'));
                  if (female) {
                    const dueDate = calculateDueDate(form.watch('breedingDate'), female.species);
                    return format(dueDate, 'MMM dd, yyyy');
                  }
                  return 'Unknown';
                })()}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Enter breeding notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Breeding Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}