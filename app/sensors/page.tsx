"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Thermometer, Heart, MapPin, Scale, Zap, AlertTriangle, Wifi, WifiOff, Battery, BatteryLow, Signal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmAnimals } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

interface SensorDevice {
  id: string;
  name: string;
  type: 'temperature' | 'heart_rate' | 'activity' | 'location' | 'weight' | 'rumination';
  animalId: string;
  status: 'online' | 'offline' | 'error' | 'low_battery';
  batteryLevel: number;
  signalStrength: number;
  lastReading: number;
  unit: string;
  timestamp: string;
  alerts: string[];
}

export default function EnhancedSensorsPage() {
  const animals = useFarmAnimals();
  const [selectedAnimal, setSelectedAnimal] = useState<string>('all');
  const [selectedSensorType, setSelectedSensorType] = useState<string>('all');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Mock sensor data - in a real app, this would come from your sensor network
  const [sensorDevices, setSensorDevices] = useState<SensorDevice[]>([
    {
      id: 'sensor_001',
      name: 'Temp Sensor - Bella',
      type: 'temperature',
      animalId: 'animal_1',
      status: 'online',
      batteryLevel: 85,
      signalStrength: 92,
      lastReading: 38.5,
      unit: '°C',
      timestamp: new Date().toISOString(),
      alerts: []
    },
    {
      id: 'sensor_002',
      name: 'Heart Monitor - Charlie',
      type: 'heart_rate',
      animalId: 'animal_2',
      status: 'online',
      batteryLevel: 67,
      signalStrength: 88,
      lastReading: 72,
      unit: 'BPM',
      timestamp: new Date().toISOString(),
      alerts: ['Elevated heart rate detected']
    },
    {
      id: 'sensor_003',
      name: 'Activity Tracker - Luna',
      type: 'activity',
      animalId: 'animal_3',
      status: 'low_battery',
      batteryLevel: 15,
      signalStrength: 78,
      lastReading: 4200,
      unit: 'steps',
      timestamp: new Date().toISOString(),
      alerts: ['Low battery warning']
    },
    {
      id: 'sensor_004',
      name: 'GPS Tracker - Daisy',
      type: 'location',
      animalId: 'animal_4',
      status: 'offline',
      batteryLevel: 0,
      signalStrength: 0,
      lastReading: 0,
      unit: 'coords',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      alerts: ['Device offline for 2 hours']
    }
  ]);

  // Generate realistic sensor readings for charts
  const generateSensorData = (sensorType: string) => {
    const data = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      let value: number;

      switch (sensorType) {
        case 'temperature':
          value = 38 + Math.random() * 2 + Math.sin(i / 4) * 0.5;
          break;
        case 'heart_rate':
          value = 70 + Math.random() * 20 + Math.sin(i / 3) * 5;
          break;
        case 'activity':
          value = Math.floor(Math.random() * 1000) + (i > 18 || i < 6 ? 0 : 500);
          break;
        case 'weight':
          value = 450 + Math.random() * 10;
          break;
        default:
          value = Math.random() * 100;
      }

      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: Number(value.toFixed(1)),
        timestamp: time.toISOString()
      });
    }

    return data;
  };

  // Simulate real-time data updates
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      setSensorDevices(prev => prev.map(sensor => {
        if (sensor.status === 'offline') return sensor;

        let newReading = sensor.lastReading;

        switch (sensor.type) {
          case 'temperature':
            newReading = 38 + Math.random() * 2;
            break;
          case 'heart_rate':
            newReading = 70 + Math.random() * 20;
            break;
          case 'activity':
            newReading = Math.floor(Math.random() * 1000);
            break;
          case 'weight':
            newReading = sensor.lastReading + (Math.random() - 0.5) * 0.1;
            break;
        }

        // Check for alerts
        const newAlerts = [...sensor.alerts];
        if (sensor.type === 'temperature' && newReading > 39.5) {
          if (!newAlerts.includes('High temperature alert')) {
            newAlerts.push('High temperature alert');
            if (alertsEnabled) {
              toast.error(`High temperature detected in ${sensor.name}`);
            }
          }
        }

        if (sensor.type === 'heart_rate' && newReading > 90) {
          if (!newAlerts.includes('Elevated heart rate')) {
            newAlerts.push('Elevated heart rate');
            if (alertsEnabled) {
              toast.warning(`Elevated heart rate in ${sensor.name}`);
            }
          }
        }

        return {
          ...sensor,
          lastReading: Number(newReading.toFixed(1)),
          timestamp: new Date().toISOString(),
          alerts: newAlerts.slice(-3) // Keep only last 3 alerts
        };
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [realTimeEnabled, alertsEnabled]);

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'heart_rate': return Heart;
      case 'activity': return Activity;
      case 'location': return MapPin;
      case 'weight': return Scale;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100 dark:bg-green-950/50';
      case 'offline': return 'text-red-600 bg-red-100 dark:bg-red-950/50';
      case 'error': return 'text-orange-600 bg-orange-100 dark:bg-orange-950/50';
      case 'low_battery': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950/50';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-950/50';
    }
  };

  const getBatteryIcon = (level: number) => {
    return level < 20 ? BatteryLow : Battery;
  };

  const filteredSensors = sensorDevices.filter(sensor => {
    const matchesAnimal = selectedAnimal === 'all' || sensor.animalId === selectedAnimal;
    const matchesType = selectedSensorType === 'all' || sensor.type === selectedSensorType;
    return matchesAnimal && matchesType;
  });

  const onlineSensors = sensorDevices.filter(s => s.status === 'online').length;
  const offlineSensors = sensorDevices.filter(s => s.status === 'offline').length;
  const lowBatterySensors = sensorDevices.filter(s => s.status === 'low_battery').length;
  const totalAlerts = sensorDevices.reduce((sum, sensor) => sum + sensor.alerts.length, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sensor Monitoring System
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time monitoring of animal health and activity sensors
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Switch checked={realTimeEnabled} onCheckedChange={setRealTimeEnabled} />
              <Label>Real-time Updates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              <Label>Alerts</Label>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Online Sensors', value: onlineSensors, icon: Wifi, color: 'green' },
            { title: 'Offline Sensors', value: offlineSensors, icon: WifiOff, color: 'red' },
            { title: 'Low Battery', value: lowBatterySensors, icon: BatteryLow, color: 'yellow' },
            { title: 'Active Alerts', value: totalAlerts, icon: AlertTriangle, color: 'orange' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-950/50`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="animal-filter">Filter by Animal</Label>
                <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
                  <SelectTrigger id="animal-filter">
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Animals</SelectItem>
                    {animals.map(animal => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.name} ({animal.species})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label htmlFor="sensor-filter">Filter by Sensor Type</Label>
                <Select value={selectedSensorType} onValueChange={setSelectedSensorType}>
                  <SelectTrigger id="sensor-filter">
                    <SelectValue placeholder="Select sensor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sensors</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="heart_rate">Heart Rate</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Monitoring Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {['temperature', 'heart_rate', 'activity', 'weight'].map((sensorType) => (
                <Card key={sensorType} className="premium-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {React.createElement(getSensorIcon(sensorType), { className: "h-5 w-5" })}
                      <span className="capitalize">{sensorType.replace('_', ' ')} Monitoring</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={generateSensorData(sensorType)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSensors.map((sensor, index) => {
                const IconComponent = getSensorIcon(sensor.type);
                const BatteryIcon = getBatteryIcon(sensor.batteryLevel);
                const animal = animals.find(a => a.id === sensor.animalId);

                return (
                  <motion.div
                    key={sensor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="premium-card hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg">{sensor.name}</CardTitle>
                          </div>
                          <Badge className={getStatusColor(sensor.status)}>
                            {sensor.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {animal && (
                          <p className="text-sm text-muted-foreground">
                            Animal: {animal.name} ({animal.species})
                          </p>
                        )}
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Latest Reading */}
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                          <span className="text-sm font-medium">Latest Reading</span>
                          <span className="text-lg font-bold text-blue-600">
                            {sensor.lastReading} {sensor.unit}
                          </span>
                        </div>

                        {/* Device Status */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <BatteryIcon className={`h-4 w-4 ${sensor.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                            <span className="text-sm">{sensor.batteryLevel}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Signal className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{sensor.signalStrength}%</span>
                          </div>
                        </div>

                        {/* Alerts */}
                        {sensor.alerts.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-orange-600">Active Alerts</h4>
                            {sensor.alerts.map((alert, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-xs">
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                                <span>{alert}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Last Update */}
                        <p className="text-xs text-muted-foreground">
                          Last update: {new Date(sensor.timestamp).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Sensor Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Temperature Trends (24h)</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={generateSensorData('temperature')}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Heart Rate Patterns (24h)</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={generateSensorData('heart_rate')}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Alert Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sensorDevices
                    .filter(sensor => sensor.alerts.length > 0)
                    .map((sensor) => (
                      <div key={sensor.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{sensor.name}</h4>
                          <Badge variant="outline" className="text-orange-600">
                            {sensor.alerts.length} alert(s)
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {sensor.alerts.map((alert, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span>{alert}</span>
                              <Button size="sm" variant="outline" className="ml-auto">
                                Acknowledge
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  {sensorDevices.every(sensor => sensor.alerts.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}