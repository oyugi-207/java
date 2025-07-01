"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Scan, Nfc, Search, Plus, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFarmData } from '@/lib/data';
import toast from 'react-hot-toast';

export default function QRRFIDPage() {
  const { animals } = useFarmData();
  const [scanResult, setScanResult] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [rfidTag, setRfidTag] = useState('');

  const generateQRCode = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    // In a real app, this would generate an actual QR code
    const qrData = {
      id: animal.id,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      healthScore: animal.healthScore,
      location: animal.location,
    };

    // Simulate QR code generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    if (ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(animal.name, 10, 20);
      ctx.fillText(animal.species, 10, 40);
      ctx.fillText(`ID: ${animal.id.slice(0, 8)}`, 10, 60);
    }

    const link = document.createElement('a');
    link.download = `qr-${animal.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast.success(`QR code generated for ${animal.name}`);
  };

  const handleScan = () => {
    // Simulate scanning
    const mockScanResults = [
      'animal_123_cow_bella',
      'animal_456_pig_wilbur',
      'animal_789_chicken_henrietta',
    ];
    
    const result = mockScanResults[Math.floor(Math.random() * mockScanResults.length)];
    setScanResult(result);
    
    const animal = animals.find(a => result.includes(a.name.toLowerCase()));
    if (animal) {
      toast.success(`Scanned: ${animal.name} (${animal.species})`);
    } else {
      toast.success('QR code scanned successfully');
    }
  };

  const registerRFID = () => {
    if (!selectedAnimal || !rfidTag) {
      toast.error('Please select an animal and enter RFID tag');
      return;
    }

    const animal = animals.find(a => a.id === selectedAnimal);
    if (animal) {
      toast.success(`RFID tag ${rfidTag} registered for ${animal.name}`);
      setRfidTag('');
    }
  };

  const scanRFID = () => {
    // Simulate RFID scanning
    const mockRFIDTags = ['RF001234', 'RF005678', 'RF009012'];
    const scannedTag = mockRFIDTags[Math.floor(Math.random() * mockRFIDTags.length)];
    
    setRfidTag(scannedTag);
    toast.success(`RFID tag scanned: ${scannedTag}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">QR Code & RFID Management</h1>
            <p className="text-muted-foreground">
              Generate QR codes and manage RFID tags for quick animal identification
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">QR Codes Generated</p>
                  <p className="text-2xl font-bold text-blue-600">{animals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Nfc className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">RFID Tags Active</p>
                  <p className="text-2xl font-bold text-green-600">{Math.floor(animals.length * 0.8)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Scan className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Scans Today</p>
                  <p className="text-2xl font-bold text-purple-600">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="qr-codes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
            <TabsTrigger value="rfid">RFID Tags</TabsTrigger>
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="bulk-operations">Bulk Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="qr-codes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate QR Codes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="animal-select">Select Animal</Label>
                    <select
                      id="animal-select"
                      value={selectedAnimal}
                      onChange={(e) => setSelectedAnimal(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Choose an animal...</option>
                      {animals.map(animal => (
                        <option key={animal.id} value={animal.id}>
                          {animal.name} ({animal.species} - {animal.breed})
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button 
                    onClick={() => generateQRCode(selectedAnimal)}
                    disabled={!selectedAnimal}
                    className="w-full"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg">
                    {selectedAnimal ? (
                      <div className="text-center">
                        <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-muted-foreground">
                          QR code for {animals.find(a => a.id === selectedAnimal)?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <QrCode className="h-16 w-16 mx-auto mb-4" />
                        <p>Select an animal to preview QR code</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Animal QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {animals.slice(0, 6).map((animal, index) => (
                    <motion.div
                      key={animal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <QrCode className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{animal.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {animal.species} • {animal.breed}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => generateQRCode(animal.id)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <Scan className="h-3 w-3 mr-1" />
                              Scan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rfid" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Register RFID Tag</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rfid-animal">Select Animal</Label>
                    <select
                      id="rfid-animal"
                      value={selectedAnimal}
                      onChange={(e) => setSelectedAnimal(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Choose an animal...</option>
                      {animals.map(animal => (
                        <option key={animal.id} value={animal.id}>
                          {animal.name} ({animal.species} - {animal.breed})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rfid-tag">RFID Tag ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="rfid-tag"
                        value={rfidTag}
                        onChange={(e) => setRfidTag(e.target.value)}
                        placeholder="Enter RFID tag ID"
                      />
                      <Button variant="outline" onClick={scanRFID}>
                        <Nfc className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={registerRFID} className="w-full">
                    <Nfc className="h-4 w-4 mr-2" />
                    Register RFID Tag
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>RFID Tag Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {animals.slice(0, 5).map((animal, index) => (
                      <div key={animal.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{animal.name}</h4>
                          <p className="text-sm text-muted-foreground">{animal.species}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            RF{String(index + 1).padStart(6, '0')}
                          </Badge>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Scanner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <div className="text-center">
                      <Scan className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-muted-foreground mb-4">Position QR code within the frame</p>
                      <Button onClick={handleScan}>
                        <Scan className="h-4 w-4 mr-2" />
                        Simulate Scan
                      </Button>
                    </div>
                  </div>
                  {scanResult && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800">Scan Result:</h4>
                      <p className="text-sm text-green-700">{scanResult}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>RFID Scanner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                    <div className="text-center">
                      <Nfc className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                      <p className="text-muted-foreground mb-4">Hold RFID tag near scanner</p>
                      <Button onClick={scanRFID} variant="outline">
                        <Nfc className="h-4 w-4 mr-2" />
                        Simulate RFID Scan
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manual-search">Manual Search</Label>
                    <div className="flex gap-2">
                      <Input
                        id="manual-search"
                        placeholder="Enter animal ID or tag"
                      />
                      <Button variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bulk-operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk QR Code Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Generate QR codes for all animals or selected groups
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate All QR Codes
                    </Button>
                    <Button variant="outline" className="w-full">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate by Species
                    </Button>
                    <Button variant="outline" className="w-full">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate by Location
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bulk RFID Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Import/export RFID tag assignments
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Import RFID Tags (CSV)
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export RFID Registry
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Nfc className="h-4 w-4 mr-2" />
                      Bulk Tag Assignment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}