"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Zap, Thermometer, Droplets, Wind, Activity, AlertTriangle, Plus, Settings, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'air_quality' | 'water_level' | 'motion' | 'weight';
  location: string;
  status: 'online' | 'offline' | 'warning';
  value: number;
  unit: string;
  lastUpdate: string;
  batteryLevel: number;
  threshold?: { min: number; max: number };
}

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([
    {
      id: '1',
      name: 'Barn Temperature',
      type: 'temperature',
      location: 'Main Barn',
      status: 'online',
      value: 22.5,
      unit: '°C',
      lastUpdate: '2 minutes ago',
      batteryLevel: 85,
      threshold: { min: 18, max: 28 },
    },
    {
      id: '2',
      name: 'Humidity Monitor',
      type: 'humidity',
      location: 'Main Barn',
      status: 'online',
      value: 65,
      unit: '%',
      lastUpdate: '1 minute ago',
      batteryLevel: 92,
      threshold: { min: 40, max: 80 },
    },
    {
      id: '3',
      name: 'Air Quality Sensor',
      type: 'air_quality',
      location: 'Chicken Coop',
      status: 'warning',
      value: 78,
      unit: 'AQI',
      lastUpdate: '5 minutes ago',
      batteryLevel: 45,
      threshold: { min: 0, max: 100 },
    },
    {
      id: '4',
      name: 'Water Tank Level',
      type: 'water_level',
      location: 'Pasture A',
      status: 'online',
      value: 85,
      unit: '%',
      lastUpdate: '3 minutes ago',
      batteryLevel: 78,
      threshold: { min: 20, max: 100 },
    },
    {
      id: '5',
      name: 'Motion Detector',
      type: 'motion',
      location: 'Feed Storage',
      status: 'offline',
      value: 0,
      unit: 'events/hr',
      lastUpdate: '2 hours ago',
      batteryLevel: 12,
    },
    {
      id: '6',
      name: 'Cattle Scale',
      type: 'weight',
      location: 'Weighing Station',
      status: 'online',
      value: 650,
      unit: 'kg',
      lastUpdate: '30 minutes ago',
      batteryLevel: 67,
    },
  ]);

  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sensorModalOpen, setSensorModalOpen] = useState(false);
  const [newSensor, setNewSensor] = useState({
    name: '',
    type: 'temperature' as Sensor['type'],
    location: '',
    threshold: { min: 0, max: 100 },
  });

  const sensorData = [
    { time: '00:00', temperature: 20, humidity: 70, airQuality: 85 },
    { time: '04:00', temperature: 18, humidity: 75, airQuality: 82 },
    { time: '08:00', temperature: 22, humidity: 65, airQuality: 88 },
    { time: '12:00', temperature: 26, humidity: 60, airQuality: 85 },
    { time: '16:00', temperature: 28, humidity: 55, airQuality: 80 },
    { time: '20:00', temperature: 24, humidity: 62, airQuality: 87 },
  ];

  const filteredSensors = sensors.filter(sensor => {
    const matchesLocation = selectedLocation === 'all' || sensor.location === selectedLocation;
    const matchesType = selectedType === 'all' || sensor.type === selectedType;
    return matchesLocation && matchesType;
  });

  const sensorStats = {
    total: sensors.length,
    online: sensors.filter(s => s.status === 'online').length,
    offline: sensors.filter(s => s.status === 'offline').length,
    warning: sensors.filter(s => s.status === 'warning').length,
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'humidity': return Droplets;
      case 'air_quality': return Wind;
      case 'water_level': return Droplets;
      case 'motion': return Activity;
      case 'weight': return Activity;
      default: return Zap;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const addSensor = () => {
    if (!newSensor.name || !newSensor.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const sensor: Sensor = {
      id: `sensor_${Date.now()}`,
      ...newSensor,
      status: 'online',
      value: Math.random() * 100,
      unit: newSensor.type === 'temperature' ? '°C' : 
            newSensor.type === 'humidity' ? '%' : 
            newSensor.type === 'weight' ? 'kg' : 'units',
      lastUpdate: 'Just now',
      batteryLevel: 100,
    };

    setSensors(prev => [...prev, sensor]);
    setNewSensor({
      name: '',
      type: 'temperature',
      location: '',
      threshold: { min: 0, max: 100 },
    });
    setSensorModalOpen(false);
    toast.success('Sensor added successfully');
  };

  const toggleSensorStatus = (sensorId: string) => {
    setSensors(prev => prev.map(sensor => 
      sensor.id === sensorId 
        ? { ...sensor, status: sensor.status === 'online' ? 'offline' : 'online' }
        : sensor
    ));
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prevSensors => 
        prevSensors.map(sensor => ({
          ...sensor,
          value: sensor.status === 'online' ? 
            Math.max(0, sensor.value + (Math.random() - 0.5) * 5) : 
            sensor.value,
          lastUpdate: sensor.status === 'online' ? 
            `${Math.floor(Math.random() * 5) + 1} minutes ago` : 
            sensor.lastUpdate,
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">IoT Sensors</h1>
            <p className="text-muted-foreground">
              Monitor environmental conditions and equipment status in real-time
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button onClick={() => setSensorModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sensor
            </Button>
          </div>
        </div>

        {/* Sensor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Sensors</p>
                  <p className="text-2xl font-bold text-blue-600">{sensorStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Online</p>
                  <p className="text-2xl font-bold text-green-600">{sensorStats.online}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">{sensorStats.warning}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <WifiOff className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Offline</p>
                  <p className="text-2xl font-bold text-red-600">{sensorStats.offline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Main Barn">Main Barn</SelectItem>
                  <SelectItem value="Chicken Coop">Chicken Coop</SelectItem>
                  <SelectItem value="Pasture A">Pasture A</SelectItem>
                  <SelectItem value="Feed Storage">Feed Storage</SelectItem>
                  <SelectItem value="Weighing Station">Weighing Station</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                  <SelectItem value="air_quality">Air Quality</SelectItem>
                  <SelectItem value="water_level">Water Level</SelectItem>
                  <SelectItem value="motion">Motion</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Tabs */}
        <Tabs defaultValue="sensors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sensors">Sensor Status</TabsTrigger>
            <TabsTrigger value="charts">Real-time Data</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="sensors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSensors.map((sensor, index) => {
                const IconComponent = getSensorIcon(sensor.type);
                const isOutOfRange = sensor.threshold && 
                  (sensor.value < sensor.threshold.min || sensor.value > sensor.threshold.max);
                
                return (
                  <motion.div
                    key={sensor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-950/50 rounded-lg">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{sensor.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {sensor.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getStatusColor(sensor.status)}>
                              {sensor.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSensorStatus(sensor.id)}
                            >
                              {sensor.status === 'online' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${isOutOfRange ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                              {sensor.value.toFixed(1)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {sensor.unit}
                            </div>
                            {isOutOfRange && (
                              <Badge variant="destructive" className="mt-2">
                                Out of Range
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Last Update:</span>
                              <div className="font-medium">{sensor.lastUpdate}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Battery:</span>
                              <div className={`font-medium ${getBatteryColor(sensor.batteryLevel)}`}>
                                {sensor.batteryLevel}%
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Battery Level</span>
                              <span>{sensor.batteryLevel}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  sensor.batteryLevel > 50 ? 'bg-green-500' :
                                  sensor.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${sensor.batteryLevel}%` }}
                              />
                            </div>
                          </div>

                          {sensor.threshold && (
                            <div className="text-xs text-muted-foreground">
                              Range: {sensor.threshold.min} - {sensor.threshold.max} {sensor.unit}
                            </div>
                          )}

                          {sensor.status === 'warning' && (
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm">
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                <span className="text-yellow-700 dark:text-yellow-300">
                                  Low battery - replace soon
                                </span>
                              </div>
                            </div>
                          )}

                          {sensor.status === 'offline' && (
                            <div className="p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-sm">
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-red-700 dark:text-red-300">
                                  Sensor offline - check connection
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Environmental Data</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={sensorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(12px)',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      name="Temperature (°C)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                      name="Humidity (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="airQuality" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      name="Air Quality (AQI)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      type: 'warning', 
                      message: 'Air Quality Sensor battery low (45%)', 
                      time: '5 minutes ago',
                      sensor: 'Chicken Coop - Air Quality'
                    },
                    { 
                      type: 'error', 
                      message: 'Motion Detector offline', 
                      time: '2 hours ago',
                      sensor: 'Feed Storage - Motion'
                    },
                    { 
                      type: 'info', 
                      message: 'Temperature spike detected', 
                      time: '3 hours ago',
                      sensor: 'Main Barn - Temperature'
                    },
                    { 
                      type: 'warning', 
                      message: 'Water level below threshold', 
                      time: '6 hours ago',
                      sensor: 'Pasture A - Water Tank'
                    },
                  ].map((alert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`p-4 border rounded-lg ${
                        alert.type === 'error' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20' :
                        alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20' :
                        'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                          alert.type === 'error' ? 'text-red-500' :
                          alert.type === 'warning' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium">{alert.message}</h4>
                          <p className="text-sm text-muted-foreground">{alert.sensor}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Sensor Modal */}
      <Dialog open={sensorModalOpen} onOpenChange={setSensorModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Sensor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sensor-name">Sensor Name *</Label>
              <Input
                id="sensor-name"
                value={newSensor.name}
                onChange={(e) => setNewSensor(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter sensor name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sensor-type">Sensor Type *</Label>
              <Select value={newSensor.type} onValueChange={(value: Sensor['type']) => setNewSensor(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                  <SelectItem value="air_quality">Air Quality</SelectItem>
                  <SelectItem value="water_level">Water Level</SelectItem>
                  <SelectItem value="motion">Motion</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sensor-location">Location *</Label>
              <Input
                id="sensor-location"
                value={newSensor.location}
                onChange={(e) => setNewSensor(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter sensor location"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="threshold-min">Min Threshold</Label>
                <Input
                  id="threshold-min"
                  type="number"
                  value={newSensor.threshold.min}
                  onChange={(e) => setNewSensor(prev => ({ 
                    ...prev, 
                    threshold: { ...prev.threshold, min: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold-max">Max Threshold</Label>
                <Input
                  id="threshold-max"
                  type="number"
                  value={newSensor.threshold.max}
                  onChange={(e) => setNewSensor(prev => ({ 
                    ...prev, 
                    threshold: { ...prev.threshold, max: parseFloat(e.target.value) || 100 }
                  }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setSensorModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addSensor}>
                Add Sensor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}