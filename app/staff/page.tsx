"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Users, Clock, Award, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { StaffModal } from '@/components/staff/staff-modal';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'worker' | 'veterinarian' | 'supervisor';
  department: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'on-leave';
  hireDate: string;
  permissions: string[];
  hoursWorked: number;
  performance: number;
  location: string;
}

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@farm.com',
      role: 'manager',
      department: 'Operations',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'active',
      hireDate: '2020-01-15',
      permissions: ['manage_animals', 'view_reports', 'manage_staff'],
      hoursWorked: 160,
      performance: 95,
      location: 'Main Farm',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@farm.com',
      role: 'veterinarian',
      department: 'Health',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'active',
      hireDate: '2019-03-20',
      permissions: ['manage_health', 'view_animals', 'create_treatments'],
      hoursWorked: 140,
      performance: 98,
      location: 'Veterinary Clinic',
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@farm.com',
      role: 'worker',
      department: 'Feeding',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'active',
      hireDate: '2021-06-10',
      permissions: ['manage_feeding', 'view_animals'],
      hoursWorked: 170,
      performance: 87,
      location: 'Feed Storage',
    },
  ]);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const staffStats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    avgPerformance: Math.round(staff.reduce((sum, s) => sum + s.performance, 0) / staff.length),
    totalHours: staff.reduce((sum, s) => sum + s.hoursWorked, 0),
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300';
      case 'veterinarian': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'supervisor': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300';
      case 'worker': return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage team members, roles, permissions, and track performance
            </p>
          </div>
          <Button onClick={() => setStaffModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Staff Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold text-blue-600">{staffStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{staffStats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Performance</p>
                  <p className="text-2xl font-bold text-purple-600">{staffStats.avgPerformance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold text-orange-600">{staffStats.totalHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="veterinarian">Veterinarian</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="worker">Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant="outline" className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Department:</span>
                            <div className="font-medium">{member.department}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <div className="font-medium">{member.location}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Hours:</span>
                            <div className="font-medium">{member.hoursWorked}h</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Performance:</span>
                            <div className="font-medium text-green-600">{member.performance}%</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-muted-foreground">
                            Hired: {format(new Date(member.hireDate), 'MMM dd, yyyy')}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-muted-foreground">{member.phone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Performance Score</span>
                            <span>{member.performance}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${member.performance}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Hours:</span>
                            <div className="font-medium">{member.hoursWorked}h</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Efficiency:</span>
                            <div className="font-medium">{Math.round(member.performance * 0.9)}%</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStaff.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Mon-Fri: 8:00 AM - 5:00 PM</div>
                        <div className="text-sm text-muted-foreground">{member.hoursWorked}h this month</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <div className="space-y-4">
              {filteredStaff.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                      <Badge variant="outline" className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {member.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <StaffModal
        open={staffModalOpen}
        onOpenChange={setStaffModalOpen}
        staff={selectedStaff}
      />
    </DashboardLayout>
  );
}