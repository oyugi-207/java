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
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import { useFarmData, type Task } from '@/lib/data';
import toast from 'react-hot-toast';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['feeding', 'health', 'breeding', 'maintenance', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']),
  assignedTo: z.string().min(1, 'Assigned person is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  animalId: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskModal({ open, onOpenChange, task }: TaskModalProps) {
  const { animals, addTask, updateTask, deleteTask } = useFarmData();
  const isEditing = !!task;

  const form = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'other',
      priority: 'medium',
      status: 'pending',
      assignedTo: '',
      dueDate: '',
      animalId: 'none',
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        type: task.type,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate.slice(0, 16), // Format for datetime-local input
        animalId: task.animalId || 'none',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        type: 'other',
        priority: 'medium',
        status: 'pending',
        assignedTo: '',
        dueDate: '',
        animalId: 'none',
      });
    }
  }, [task, form]);

  const onSubmit = (data: TaskForm) => {
    try {
      const taskData = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
        animalId: data.animalId === 'none' ? undefined : data.animalId,
      };

      if (isEditing && task) {
        updateTask(task.id, taskData);
        toast.success('Task updated successfully');
      } else {
        addTask(taskData);
        toast.success('Task created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      toast.success('Task deleted successfully');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Enter task title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={form.watch('type')} onValueChange={(value) => form.setValue('type', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feeding">Feeding</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="breeding">Breeding</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={form.watch('priority')} onValueChange={(value) => form.setValue('priority', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To *</Label>
              <Input
                id="assignedTo"
                {...form.register('assignedTo')}
                placeholder="Enter person name"
              />
              {form.formState.errors.assignedTo && (
                <p className="text-sm text-red-500">{form.formState.errors.assignedTo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                {...form.register('dueDate')}
              />
              {form.formState.errors.dueDate && (
                <p className="text-sm text-red-500">{form.formState.errors.dueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="animalId">Related Animal (Optional)</Label>
              <Select value={form.watch('animalId')} onValueChange={(value) => form.setValue('animalId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an animal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No animal selected</SelectItem>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.name} ({animal.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Enter task description"
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <div>
              {isEditing && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}