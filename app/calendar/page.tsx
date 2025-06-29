"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Users, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { useData } from '@/lib/data';
import toast from 'react-hot-toast';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'health' | 'breeding' | 'feeding' | 'vaccination' | 'appointment' | 'reminder';
  date: string;
  time: string;
  location?: string;
  animalId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attendees?: string[];
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function CalendarPage() {
  const { animals, addTask } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Vaccination - Cattle Group A',
      description: 'Annual vaccination for 12 cattle in Pasture A',
      type: 'vaccination',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      location: 'Pasture A',
      priority: 'high',
      attendees: ['Dr. Sarah Johnson', 'John Smith'],
      recurring: 'none',
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Breeding Check - Luna',
      description: 'Pregnancy confirmation for Luna',
      type: 'breeding',
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      time: '14:00',
      priority: 'medium',
      recurring: 'none',
      status: 'scheduled',
    },
    {
      id: '3',
      title: 'Feed Delivery',
      description: 'Monthly feed delivery from supplier',
      type: 'feeding',
      date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      time: '10:00',
      priority: 'medium',
      recurring: 'monthly',
      status: 'scheduled',
    },
    {
      id: '4',
      title: 'Health Check - Bella',
      description: 'Routine health examination',
      type: 'health',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '11:00',
      location: 'Veterinary Clinic',
      priority: 'high',
      animalId: 'animal_1',
      recurring: 'none',
      status: 'scheduled',
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'task' as CalendarEvent['type'],
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    location: '',
    animalId: '',
    priority: 'medium' as CalendarEvent['priority'],
    attendees: [] as string[],
    recurring: 'none' as CalendarEvent['recurring'],
  });

  const getCalendarDays = () => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    } else if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else {
      return [currentDate];
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'health': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'breeding': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300';
      case 'feeding': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'vaccination': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300';
      case 'appointment': return 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300';
      case 'task': return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const event: CalendarEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...newEvent,
      animalId: newEvent.animalId || undefined,
      status: 'scheduled',
    };

    setEvents(prev => [...prev, event]);

    // Also add as a task
    addTask({
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type === 'task' ? 'other' : newEvent.type,
      priority: newEvent.priority,
      status: 'pending',
      assignedTo: 'Current User',
      dueDate: new Date(`${newEvent.date}T${newEvent.time}`).toISOString(),
      animalId: newEvent.animalId || undefined,
    });

    setNewEvent({
      title: '',
      description: '',
      type: 'task',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      location: '',
      animalId: '',
      priority: 'medium',
      attendees: [],
      recurring: 'none',
    });
    setEventModalOpen(false);
    toast.success('Event added successfully');
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, -1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const calendarDays = getCalendarDays();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Farm Calendar</h1>
            <p className="text-muted-foreground">
              Schedule and track farm activities, tasks, and important events
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
            </div>
            <Button onClick={() => setEventModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
                  {viewMode === 'week' && `Week of ${format(startOfWeek(currentDate), 'MMM dd, yyyy')}`}
                  {viewMode === 'day' && format(currentDate, 'EEEE, MMMM dd, yyyy')}
                </span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={prevPeriod}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={nextPeriod}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'month' && (
              <>
                {/* Calendar Grid Header */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentDate);

                    return (
                      <motion.div
                        key={day.toISOString()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01, duration: 0.2 }}
                        className={`
                          min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-200
                          ${isCurrentMonth ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800 opacity-50'}
                          ${isToday ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-gray-200 dark:border-gray-700'}
                          ${isSelected ? 'ring-2 ring-emerald-500' : ''}
                          hover:shadow-md hover:border-emerald-300
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-emerald-600' : 
                          isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                        }`}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate border-l-2 ${getPriorityColor(event.priority)} ${getEventTypeColor(event.type)}`}
                              title={`${event.time} - ${event.title}`}
                            >
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{event.time}</span>
                              </div>
                              <div className="font-medium truncate">{event.title}</div>
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            {viewMode === 'week' && (
              <div className="space-y-4">
                <div className="grid grid-cols-8 gap-2">
                  <div className="p-2"></div>
                  {calendarDays.map(day => (
                    <div key={day.toISOString()} className="p-2 text-center">
                      <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                      <div className={`text-lg ${isSameDay(day, new Date()) ? 'text-emerald-600 font-bold' : ''}`}>
                        {format(day, 'd')}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Time slots */}
                {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
                  <div key={hour} className="grid grid-cols-8 gap-2 border-t">
                    <div className="p-2 text-sm text-gray-500">
                      {hour}:00
                    </div>
                    {calendarDays.map(day => {
                      const dayEvents = getEventsForDate(day).filter(event => 
                        parseInt(event.time.split(':')[0]) === hour
                      );
                      return (
                        <div key={`${day.toISOString()}-${hour}`} className="p-1 min-h-[60px]">
                          {dayEvents.map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-2 rounded mb-1 border-l-2 ${getPriorityColor(event.priority)} ${getEventTypeColor(event.type)}`}
                            >
                              <div className="font-medium truncate">{event.title}</div>
                              <div className="text-xs opacity-75">{event.time}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'day' && (
              <div className="space-y-2">
                {Array.from({ length: 14 }, (_, i) => i + 6).map(hour => {
                  const hourEvents = getEventsForDate(currentDate).filter(event => 
                    parseInt(event.time.split(':')[0]) === hour
                  );
                  return (
                    <div key={hour} className="flex border-t">
                      <div className="w-20 p-4 text-sm text-gray-500">
                        {hour}:00
                      </div>
                      <div className="flex-1 p-2 min-h-[80px]">
                        {hourEvents.map(event => (
                          <div
                            key={event.id}
                            className={`p-3 rounded-lg mb-2 border-l-4 ${getPriorityColor(event.priority)} ${getEventTypeColor(event.type)}`}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <Badge variant="outline">{event.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{event.time}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.attendees && event.attendees.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3" />
                                  <span>{event.attendees.length} attendees</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        {selectedDate && viewMode === 'month' && (
          <Card>
            <CardHeader>
              <CardTitle>Events for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getEventsForDate(selectedDate).map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start space-x-4 p-4 border rounded-lg border-l-4 ${getPriorityColor(event.priority)}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge variant="outline" className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        {event.recurring !== 'none' && (
                          <Badge variant="outline">
                            <Bell className="h-3 w-3 mr-1" />
                            {event.recurring}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {getEventsForDate(selectedDate).length === 0 && (
                  <p className="text-gray-500 text-center py-8">No events scheduled for this date</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter(event => new Date(event.date) >= new Date() && event.status === 'scheduled')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`flex items-center justify-between p-4 border rounded-lg border-l-4 ${getPriorityColor(event.priority)}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-500">
                          {format(new Date(event.date), 'MMM')}
                        </div>
                        <div className="text-lg font-bold">
                          {format(new Date(event.date), 'd')}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                          <span className="text-sm text-gray-500">{event.time}</span>
                          {event.recurring !== 'none' && (
                            <Badge variant="outline" className="text-xs">
                              <Bell className="h-3 w-3 mr-1" />
                              {event.recurring}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Event Modal */}
      <Dialog open={eventModalOpen} onOpenChange={setEventModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newEvent.type} onValueChange={(value: CalendarEvent['type']) => setNewEvent(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="breeding">Breeding</SelectItem>
                    <SelectItem value="feeding">Feeding</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newEvent.priority} onValueChange={(value: CalendarEvent['priority']) => setNewEvent(prev => ({ ...prev, priority: value }))}>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurring">Recurring</Label>
                <Select value={newEvent.recurring} onValueChange={(value: CalendarEvent['recurring']) => setNewEvent(prev => ({ ...prev, recurring: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animal">Related Animal (Optional)</Label>
              <Select value={newEvent.animalId} onValueChange={(value) => setNewEvent(prev => ({ ...prev, animalId: value === 'none' ? '' : value }))}>
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

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEventModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Add Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}