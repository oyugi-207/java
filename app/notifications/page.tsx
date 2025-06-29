"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, AlertTriangle, Heart, Calendar, Zap, CheckCircle, X, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'health' | 'task' | 'alert' | 'system' | 'breeding';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  createdAt: string;
  animalId?: string;
  actionRequired?: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'health',
      title: 'Health Alert: Bella',
      message: 'Temperature spike detected. Immediate veterinary attention recommended.',
      priority: 'urgent',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      animalId: 'animal_1',
      actionRequired: true,
    },
    {
      id: '2',
      type: 'task',
      title: 'Vaccination Due',
      message: 'Annual vaccination due for 5 cattle in Pasture A.',
      priority: 'high',
      read: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      actionRequired: true,
    },
    {
      id: '3',
      type: 'breeding',
      title: 'Breeding Success',
      message: 'Luna has been successfully bred. Expected due date: March 15, 2024.',
      priority: 'medium',
      read: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      type: 'alert',
      title: 'Feed Inventory Low',
      message: 'Hay inventory below minimum threshold. Reorder recommended.',
      priority: 'medium',
      read: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      actionRequired: true,
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update',
      message: 'AgroInsight v2.1.0 is now available with new AI features.',
      priority: 'low',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    healthAlerts: true,
    taskReminders: true,
    breedingUpdates: true,
    inventoryAlerts: true,
    systemUpdates: false,
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'health': return Heart;
      case 'task': return Calendar;
      case 'alert': return AlertTriangle;
      case 'system': return Zap;
      case 'breeding': return Heart;
      default: return Bell;
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

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Notification settings updated');
  };

  const filteredNotifications = (type?: string) => {
    if (!type || type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with important farm alerts and system notifications
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Notifications</p>
                  <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="task">Tasks</TabsTrigger>
            <TabsTrigger value="alert">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredNotifications().map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className={`${!notification.read ? 'border-l-4 border-l-blue-500' : ''} hover:shadow-lg transition-shadow`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-2 rounded-full ${
                            notification.priority === 'urgent' ? 'bg-red-100 dark:bg-red-950/50' :
                            notification.priority === 'high' ? 'bg-orange-100 dark:bg-orange-950/50' :
                            'bg-blue-100 dark:bg-blue-950/50'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              notification.priority === 'urgent' ? 'text-red-600' :
                              notification.priority === 'high' ? 'text-orange-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {notification.title}
                              </h3>
                              <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                                {notification.priority.toUpperCase()}
                              </Badge>
                              {!notification.read && (
                                <Badge variant="default" className="bg-blue-500">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            {filteredNotifications('health').map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className={`${!notification.read ? 'border-l-4 border-l-red-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-2 rounded-full bg-red-100 dark:bg-red-950/50">
                            <IconComponent className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                                {notification.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <span className="text-sm text-gray-500">
                              {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="task" className="space-y-4">
            {filteredNotifications('task').map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className={`${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-950/50">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                                {notification.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <span className="text-sm text-gray-500">
                              {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="alert" className="space-y-4">
            {filteredNotifications('alert').map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className={`${!notification.read ? 'border-l-4 border-l-orange-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-950/50">
                            <IconComponent className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                                {notification.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <span className="text-sm text-gray-500">
                              {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="health-alerts">Health Alerts</Label>
                      <p className="text-sm text-muted-foreground">Animal health and medical alerts</p>
                    </div>
                    <Switch
                      id="health-alerts"
                      checked={settings.healthAlerts}
                      onCheckedChange={(checked) => updateSetting('healthAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="task-reminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Upcoming tasks and deadlines</p>
                    </div>
                    <Switch
                      id="task-reminders"
                      checked={settings.taskReminders}
                      onCheckedChange={(checked) => updateSetting('taskReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="breeding-updates">Breeding Updates</Label>
                      <p className="text-sm text-muted-foreground">Breeding schedules and pregnancy updates</p>
                    </div>
                    <Switch
                      id="breeding-updates"
                      checked={settings.breedingUpdates}
                      onCheckedChange={(checked) => updateSetting('breedingUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="inventory-alerts">Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">Low stock and inventory warnings</p>
                    </div>
                    <Switch
                      id="inventory-alerts"
                      checked={settings.inventoryAlerts}
                      onCheckedChange={(checked) => updateSetting('inventoryAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Software updates and maintenance notices</p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={settings.systemUpdates}
                      onCheckedChange={(checked) => updateSetting('systemUpdates', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}