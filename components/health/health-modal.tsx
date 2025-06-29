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

const healthRecordSchema = z.object({
  animalId: z.string().min(1, 'Please select an animal'),
  healthScore: z.number().min(0).max(100, 'Health score must be between 0 and 100'),
  temperature: z.number().optional(),
  weight: z.number().optional(),
  notes: z.string().min(1, 'Notes are required'),
  veterinarian: z.string().optional(),
});

type HealthRecordForm = z.infer<typeof healthRecordSchema>;

interface HealthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: any;
}

export function HealthModal({ open, onOpenChange, animal }: HealthModalProps) {
  const { animals, addHealthRecord } = useData();

  const form = useForm<HealthRecordForm>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      animalId: animal?.id || '',
      healthScore: 95,
      temperature: undefined,
      weight: undefined,
      notes: '',
      veterinarian: '',
    },
  });

  const onSubmit = (data: HealthRecordForm) => {
    try {
      addHealthRecord({
        ...data,
        date: new Date().toISOString(),
        temperature: data.temperature || undefined,
        weight: data.weight || undefined,
        veterinarian: data.veterinarian || undefined,
      });
      
      toast.success('Health check recorded successfully');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to record health check');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Health Check</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animalId">Animal *</Label>
            <Select value={form.watch('animalId')} onValueChange={(value) => form.setValue('animalId', value)}>
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
            {form.formState.errors.animalId && (
              <p className="text-sm text-red-500">{form.formState.errors.animalId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthScore">Health Score (%) *</Label>
              <Input
                id="healthScore"
                type="number"
                min="0"
                max="100"
                {...form.register('healthScore', { valueAsNumber: true })}
                placeholder="95"
              />
              {form.formState.errors.healthScore && (
                <p className="text-sm text-red-500">{form.formState.errors.healthScore.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                {...form.register('temperature', { valueAsNumber: true })}
                placeholder="38.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              {...form.register('weight', { valueAsNumber: true })}
              placeholder="Enter current weight"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinarian">Veterinarian</Label>
            <Input
              id="veterinarian"
              {...form.register('veterinarian')}
              placeholder="Dr. Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes *</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Enter health check observations..."
              rows={3}
            />
            {form.formState.errors.notes && (
              <p className="text-sm text-red-500">{form.formState.errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Record Health Check
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}