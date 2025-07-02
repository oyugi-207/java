"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Calendar, User, Clock, CheckCircle2 } from 'lucide-react';
import { useFarmData} from '@/lib/data';
import { TaskModal } from '@/components/tasks/task-modal';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function TasksPage() {
  const { tasks, updateTask } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const openTaskModal = (task = null) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const toggleTaskStatus = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateTask(taskId, { status: newStatus });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
            <p className="text-muted-foreground">
              Organize and track farm operations and activities
            </p>
          </div>
          <Button onClick={() => openTaskModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="feeding">Feeding</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="breeding">Breeding</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskStatus(task.id, task.status)}
                        className="mt-1"
                      >
                        <CheckCircle2 
                          className={`h-5 w-5 ${
                            task.status === 'completed' 
                              ? 'text-green-500 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </Button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 
                            className={`text-lg font-semibold cursor-pointer hover:text-primary ${
                              task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                            }`}
                            onClick={() => openTaskModal(task)}
                          >
                            {task.title}
                          </h3>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">
                          {task.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Assigned to: {task.assignedTo}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Type: {task.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                No tasks found matching your criteria.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <TaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        task={selectedTask}
      />
    </DashboardLayout>
  );
}