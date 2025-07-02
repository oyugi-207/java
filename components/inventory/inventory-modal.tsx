"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import { useFarmData, type InventoryItem } from '@/lib/data';
import toast from 'react-hot-toast';

const inventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['feed', 'medicine', 'equipment', 'supplies']),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  unit: z.string().min(1, 'Unit is required'),
  minStock: z.number().min(0, 'Minimum stock must be 0 or greater'),
  cost: z.number().min(0, 'Cost must be 0 or greater'),
  supplier: z.string().min(1, 'Supplier is required'),
  location: z.string().min(1, 'Location is required'),
  expiryDate: z.string().optional(),
});

type InventoryForm = z.infer<typeof inventorySchema>;

interface InventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: InventoryItem | null;
}

export function InventoryModal({ open, onOpenChange, item }: InventoryModalProps) {
  const { addInventoryItem, updateInventoryItem, deleteInventoryItem } = useFarmData();
  const isEditing = !!item;

  const form = useForm<InventoryForm>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: '',
      category: 'feed',
      quantity: 0,
      unit: '',
      minStock: 0,
      cost: 0,
      supplier: '',
      location: '',
      expiryDate: '',
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        minStock: item.minStock,
        cost: item.cost,
        supplier: item.supplier,
        location: item.location,
        expiryDate: item.expiryDate || '',
      });
    } else {
      form.reset({
        name: '',
        category: 'feed',
        quantity: 0,
        unit: '',
        minStock: 0,
        cost: 0,
        supplier: '',
        location: '',
        expiryDate: '',
      });
    }
  }, [item, form]);

  const onSubmit = (data: InventoryForm) => {
    try {
      const itemData = {
        ...data,
        expiryDate: data.expiryDate || undefined,
      };

      if (isEditing && item) {
        updateInventoryItem(item.id, itemData);
        toast.success('Inventory item updated successfully');
      } else {
        addInventoryItem(itemData);
        toast.success('Inventory item added successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save inventory item');
    }
  };

  const handleDelete = () => {
    if (item && window.confirm('Are you sure you want to delete this inventory item?')) {
      deleteInventoryItem(item.id);
      toast.success('Inventory item deleted successfully');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit ${item?.name}` : 'Add Inventory Item'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter item name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={form.watch('category')} onValueChange={(value) => form.setValue('category', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feed">Feed</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                {...form.register('quantity', { valueAsNumber: true })}
                placeholder="Enter quantity"
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                {...form.register('unit')}
                placeholder="kg, liters, pieces, etc."
              />
              {form.formState.errors.unit && (
                <p className="text-sm text-red-500">{form.formState.errors.unit.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">Minimum Stock *</Label>
              <Input
                id="minStock"
                type="number"
                step="0.01"
                {...form.register('minStock', { valueAsNumber: true })}
                placeholder="Enter minimum stock level"
              />
              {form.formState.errors.minStock && (
                <p className="text-sm text-red-500">{form.formState.errors.minStock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Unit Cost *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                {...form.register('cost', { valueAsNumber: true })}
                placeholder="Enter cost per unit"
              />
              {form.formState.errors.cost && (
                <p className="text-sm text-red-500">{form.formState.errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Input
                id="supplier"
                {...form.register('supplier')}
                placeholder="Enter supplier name"
              />
              {form.formState.errors.supplier && (
                <p className="text-sm text-red-500">{form.formState.errors.supplier.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...form.register('location')}
                placeholder="Enter storage location"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                {...form.register('expiryDate')}
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <div>
              {isEditing && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Item
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}