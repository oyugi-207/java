
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Save, Phone, Mail, MapPin, Calendar, DollarSign, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data';

const staffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  role: z.enum(['admin', 'manager', 'supervisor', 'worker', 'veterinarian']),
  status: z.enum(['active', 'inactive', 'on_leave', 'terminated']),
  hireDate: z.string().min(1, 'Hire date is required'),
  salary: z.number().min(0).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  department: z.string().optional(),
  skills: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: any;
}

export function StaffModal({ open, onOpenChange, staff }: StaffModalProps) {
  const { addStaffMember, updateStaffMember } = useDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);

  const isEditing = !!staff;

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'worker',
      status: 'active',
      hireDate: '',
      salary: undefined,
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      department: '',
      skills: [],
      certifications: [],
      notes: '',
    },
  });

  const availableSkills = [
    'Animal Handling', 'Feeding', 'Milking', 'Breeding', 'Health Monitoring',
    'Equipment Operation', 'Maintenance', 'Record Keeping', 'First Aid',
    'Veterinary Assistance', 'Organic Farming', 'Crop Management'
  ];

  const availableCertifications = [
    'Animal Welfare', 'Organic Certification', 'First Aid', 'CPR',
    'Heavy Equipment', 'Pesticide Application', 'Food Safety',
    'Veterinary Assistant', 'Farm Safety', 'Quality Assurance'
  ];

  useEffect(() => {
    if (staff && isEditing) {
      form.reset({
        name: staff.name,
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role,
        status: staff.status,
        hireDate: staff.hireDate,
        salary: staff.salary,
        address: staff.address || '',
        emergencyContact: staff.emergencyContact || '',
        emergencyPhone: staff.emergencyPhone || '',
        department: staff.department || '',
        skills: staff.skills || [],
        certifications: staff.certifications || [],
        notes: staff.notes || '',
      });
      setSelectedSkills(staff.skills || []);
      setSelectedCertifications(staff.certifications || []);
    } else {
      form.reset();
      setSelectedSkills([]);
      setSelectedCertifications([]);
    }
  }, [staff, isEditing, form]);

  const generateEmployeeId = () => {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const onSubmit = async (data: StaffFormData) => {
    setIsLoading(true);
    try {
      const staffData = {
        ...data,
        skills: selectedSkills,
        certifications: selectedCertifications,
        employeeId: isEditing ? staff.employeeId : generateEmployeeId(),
        departments: data.department ? [data.department] : [],
        avatar: staff?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      };

      if (isEditing && staff) {
        await updateStaffMember(staff.id, staffData);
        toast.success('Staff member updated successfully');
      } else {
        await addStaffMember(staffData);
        toast.success('Staff member added successfully');
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast.error('Failed to save staff member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleCertificationToggle = (certification: string) => {
    setSelectedCertifications(prev =>
      prev.includes(certification)
        ? prev.filter(c => c !== certification)
        : [...prev, certification]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="farm-subheading">
              {isEditing ? `Edit ${staff?.name}` : 'Add New Staff Member'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="skills">Skills & Certs</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      className="farm-input"
                      placeholder="Enter full name"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={form.watch('role')} onValueChange={(value) => form.setValue('role', value as any)}>
                      <SelectTrigger className="farm-select">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="worker">Worker</SelectItem>
                        <SelectItem value="veterinarian">Veterinarian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as any)}>
                      <SelectTrigger className="farm-select">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      {...form.register('department')}
                      className="farm-input"
                      placeholder="e.g., Livestock, Crops, Maintenance"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register('email')}
                        className="farm-input"
                        placeholder="Enter email address"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        {...form.register('phone')}
                        className="farm-input"
                        placeholder="Enter phone number"
                      />
                      {form.formState.errors.phone && (
                        <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      {...form.register('address')}
                      className="farm-input"
                      placeholder="Enter home address"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        {...form.register('emergencyContact')}
                        className="farm-input"
                        placeholder="Emergency contact name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                      <Input
                        id="emergencyPhone"
                        {...form.register('emergencyPhone')}
                        className="farm-input"
                        placeholder="Emergency contact phone"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span>Employment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Hire Date *</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      {...form.register('hireDate')}
                      className="farm-input"
                    />
                    {form.formState.errors.hireDate && (
                      <p className="text-sm text-red-500">{form.formState.errors.hireDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Monthly Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      step="0.01"
                      {...form.register('salary', { valueAsNumber: true })}
                      className="farm-input"
                      placeholder="Enter monthly salary"
                    />
                  </div>

                  {isEditing && staff?.employeeId && (
                    <div className="space-y-2">
                      <Label>Employee ID</Label>
                      <div className="p-2 bg-gray-100 rounded-md">
                        <code className="text-sm">{staff.employeeId}</code>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span>Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {availableSkills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <Label htmlFor={`skill-${skill}`} className="text-sm">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Badge className="h-5 w-5 text-blue-600" />
                      <span>Certifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {availableCertifications.map((certification) => (
                        <div key={certification} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cert-${certification}`}
                            checked={selectedCertifications.includes(certification)}
                            onCheckedChange={() => handleCertificationToggle(certification)}
                          />
                          <Label htmlFor={`cert-${certification}`} className="text-sm">
                            {certification}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    {...form.register('notes')}
                    className="farm-input min-h-[100px]"
                    placeholder="Any additional notes about the staff member..."
                  />
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
              {isLoading ? 'Saving...' : isEditing ? 'Update Staff' : 'Add Staff'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
