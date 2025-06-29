"use client";

import { useState } from 'react';
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

interface VaccinationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: any;
}

export function VaccinationModal({ open, onOpenChange, animal }: VaccinationModalProps) {
  const { animals } = useData();
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [date, setDate] = useState('');
  const [nextDue, setNextDue] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Vaccination recorded successfully');
    onOpenChange(false);
    // Reset form
    setSelectedAnimal('');
    setVaccineName('');
    setDate('');
    setNextDue('');
    setVeterinarian('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Vaccination</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animal">Animal</Label>
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
            <Label htmlFor="vaccineName">Vaccine Name</Label>
            <Input
              id="vaccineName"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              placeholder="Enter vaccine name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date Given</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextDue">Next Due</Label>
              <Input
                id="nextDue"
                type="date"
                value={nextDue}
                onChange={(e) => setNextDue(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinarian">Veterinarian</Label>
            <Input
              id="veterinarian"
              value={veterinarian}
              onChange={(e) => setVeterinarian(e.target.value)}
              placeholder="Enter veterinarian name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter vaccination notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Record Vaccination
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}