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

const feedingRecordSchema = z.object({
  animalId: z.string().min(1, 'Please select an animal'),
  feedType: z.string().min(1, 'Please select feed type'),
  amount: z.number().min(0.1, 'Amount must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  feedingTime: z.string().min(1, 'Feeding time is required'),
  cost: z.number().min(0, 'Cost must be 0 or greater'),
  notes: z.string().optional(),
});

type FeedingRecordForm = z.infer<typeof feedingRecordSchema>;

interface FeedingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: any;
}

export function FeedingModal({ open, onOpenChange, animal }: FeedingModalProps) {
  const { animals, addFeedingRecord } = useFarmData();

  const form = useForm<FeedingRecordForm>({
    resolver: zodResolver(feedingRecordSchema),
    defaultValues: {
      animalId: animal?.id || '',
      feedType: '',
      amount: 0,
      unit: 'kg',
      feedingTime: new Date().toTimeString().slice(0, 5),
      cost: 0,
      notes: '',
    },
  });

  const onSubmit = (data: FeedingRecordForm) => {
    try {
      addFeedingRecord({
        ...data,
        notes: data.notes || '',
      });
      
      toast.success('Feeding record added successfully');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to add feeding record');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Feeding</DialogTitle>
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

          <div className="space-y-2">
            <Label htmlFor="feedType">Feed Type *</Label>
            <Select value={form.watch('feedType')} onValueChange={(value) => form.setValue('feedType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select feed type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hay">Hay</SelectItem>
                <SelectItem value="grain">Grain</SelectItem>
                <SelectItem value="silage">Silage</SelectItem>
                <SelectItem value="pellets">Pellets</SelectItem>
                <SelectItem value="mixed">Mixed Feed</SelectItem>
                <SelectItem value="supplements">Supplements</SelectItem>
                <SelectItem value="pasture">Pasture</SelectItem>
                <SelectItem value="concentrate">Concentrate</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.feedType && (
              <p className="text-sm text-red-500">{form.formState.errors.feedType.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                {...form.register('amount', { valueAsNumber: true })}
                placeholder="5.0"
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={form.watch('unit')} onValueChange={(value) => form.setValue('unit', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                  <SelectItem value="liters">liters</SelectItem>
                  <SelectItem value="gallons">gallons</SelectItem>
                  <SelectItem value="bales">bales</SelectItem>
                  <SelectItem value="scoops">scoops</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedingTime">Feeding Time *</Label>
              <Input
                id="feedingTime"
                type="time"
                {...form.register('feedingTime')}
              />
              {form.formState.errors.feedingTime && (
                <p className="text-sm text-red-500">{form.formState.errors.feedingTime.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                {...form.register('cost', { valueAsNumber: true })}
                placeholder="12.50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Enter feeding notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Record Feeding
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}