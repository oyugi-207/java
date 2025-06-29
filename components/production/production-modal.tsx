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

const productionRecordSchema = z.object({
  animalId: z.string().min(1, 'Please select an animal'),
  productType: z.enum(['milk', 'eggs', 'meat', 'wool', 'honey', 'cheese']),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  quality: z.enum(['excellent', 'good', 'fair', 'poor']),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

type ProductionRecordForm = z.infer<typeof productionRecordSchema>;

interface ProductionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: any;
}

export function ProductionModal({ open, onOpenChange, animal }: ProductionModalProps) {
  const { animals, addProductionRecord } = useData();

  const form = useForm<ProductionRecordForm>({
    resolver: zodResolver(productionRecordSchema),
    defaultValues: {
      animalId: animal?.id || '',
      productType: 'milk',
      quantity: 0,
      unit: 'liters',
      quality: 'good',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const getUnitsForProduct = (productType: string) => {
    switch (productType) {
      case 'milk': return ['liters', 'gallons', 'ml'];
      case 'eggs': return ['pieces', 'dozen', 'kg'];
      case 'meat': return ['kg', 'lbs', 'grams'];
      case 'wool': return ['kg', 'lbs', 'fleece'];
      case 'honey': return ['kg', 'liters', 'jars'];
      case 'cheese': return ['kg', 'wheels', 'blocks'];
      default: return ['kg', 'liters', 'pieces'];
    }
  };

  const onSubmit = (data: ProductionRecordForm) => {
    try {
      addProductionRecord({
        ...data,
        notes: data.notes || '',
      });
      
      toast.success('Production record added successfully');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to add production record');
    }
  };

  const selectedProductType = form.watch('productType');
  const availableUnits = getUnitsForProduct(selectedProductType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Production</DialogTitle>
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
            <Label htmlFor="productType">Product Type *</Label>
            <Select value={form.watch('productType')} onValueChange={(value) => {
              form.setValue('productType', value as any);
              // Reset unit when product type changes
              const units = getUnitsForProduct(value);
              form.setValue('unit', units[0]);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="milk">Milk</SelectItem>
                <SelectItem value="eggs">Eggs</SelectItem>
                <SelectItem value="meat">Meat</SelectItem>
                <SelectItem value="wool">Wool</SelectItem>
                <SelectItem value="honey">Honey</SelectItem>
                <SelectItem value="cheese">Cheese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                {...form.register('quantity', { valueAsNumber: true })}
                placeholder="0.0"
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={form.watch('unit')} onValueChange={(value) => form.setValue('unit', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quality">Quality *</Label>
              <Select value={form.watch('quality')} onValueChange={(value) => form.setValue('quality', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                {...form.register('date')}
              />
              {form.formState.errors.date && (
                <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Enter production notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Record Production
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}