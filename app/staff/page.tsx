"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Search, Filter, UserCheck, UserX, Calendar, DollarSign, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { StaffModal } from '@/components/staff/staff-modal';
import { useDataStore } from '@/lib/data';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function StaffPage() {
  const { staff } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300';
      case 'worker': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'veterinarian': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300';
      case 'supervisor': return 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      case 'terminated': return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const openStaffModal = (member = null) => {
    setSelectedStaff(member);
    setStaffModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage your farm workers, supervisors, and staff members
            </p>
          </div>
          <Button onClick={() => openStaffModal()} className="farm-button">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold text-blue-600">{staff.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {staff.filter(s => s.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserX className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-red-600">
                    {staff.filter(s => s.status === 'inactive').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Payroll</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${staff.reduce((total, s) => total + (s.salary || 0), 0).toLocaleString()}
                  </p>
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
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 farm-input"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48 farm-select">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="veterinarian">Veterinarian</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 farm-select">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Grid */}
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Employee ID: {member.employeeId}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent onClick={() => openStaffModal(member)}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{member.phone || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{member.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Hired</span>
                      </div>
                      <span className="text-sm">
                        {member.hireDate ? format(new Date(member.hireDate), 'MMM yyyy') : 'N/A'}
                      </span>
                    </div>

                    {member.salary && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Salary</span>
                        </div>
                        <span className="text-sm font-medium">
                          ${member.salary.toLocaleString()}/mo
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Departments</span>
                      <div className="flex gap-1">
                        {member.departments?.slice(0, 2).map((dept, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {dept}
                          </Badge>
                        ))}
                        {member.departments?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.departments.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                No staff members found matching your criteria.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <StaffModal
        open={staffModalOpen}
        onOpenChange={setStaffModalOpen}
        staff={selectedStaff}
      />
    </DashboardLayout>
  );
}