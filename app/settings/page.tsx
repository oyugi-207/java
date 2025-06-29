"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Save, Building, Bell, Shield, Database, Wifi, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [farmSettings, setFarmSettings] = useState({
    farmName: 'Green Valley Ranch',
    farmAddress: '123 Farm Road, Green Valley, CA 95945',
    farmSize: '250',
    farmType: 'Mixed Livestock',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    temperatureUnit: 'Celsius',
    weightUnit: 'Kilograms',
    autoBackup: true,
    dataRetention: '7',
    apiAccess: false,
    publicProfile: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
    sessionTimeout: '30',
    maxFileSize: '10',
    allowRegistration: true,
    requireEmailVerification: true,
    enableTwoFactor: false,
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    weatherApi: true,
    emailService: true,
    smsService: false,
    cloudSync: true,
    thirdPartyApps: false,
    webhooks: false,
  });

  const handleSaveFarmSettings = () => {
    toast.success('Farm settings saved successfully');
  };

  const handleSaveSystemSettings = () => {
    toast.success('System settings saved successfully');
  };

  const handleSaveIntegrationSettings = () => {
    toast.success('Integration settings saved successfully');
  };

  const handleExportSettings = () => {
    const settings = {
      farm: farmSettings,
      system: systemSettings,
      integrations: integrationSettings,
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'farm-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported successfully');
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            if (settings.farm) setFarmSettings(settings.farm);
            if (settings.system) setSystemSettings(settings.system);
            if (settings.integrations) setIntegrationSettings(settings.integrations);
            toast.success('Settings imported successfully');
          } catch (error) {
            toast.error('Invalid settings file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Farm Settings</h1>
            <p className="text-muted-foreground">
              Configure your farm management system settings and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportSettings}>
              Import Settings
            </Button>
            <Button variant="outline" onClick={handleExportSettings}>
              Export Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="farm" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="farm">Farm Details</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="backup">Backup & Data</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="farm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Farm Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input
                      id="farmName"
                      value={farmSettings.farmName}
                      onChange={(e) => setFarmSettings(prev => ({ ...prev, farmName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (acres)</Label>
                    <Input
                      id="farmSize"
                      value={farmSettings.farmSize}
                      onChange={(e) => setFarmSettings(prev => ({ ...prev, farmSize: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="farmAddress">Farm Address</Label>
                    <Textarea
                      id="farmAddress"
                      value={farmSettings.farmAddress}
                      onChange={(e) => setFarmSettings(prev => ({ ...prev, farmAddress: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmType">Farm Type</Label>
                    <Select value={farmSettings.farmType} onValueChange={(value) => setFarmSettings(prev => ({ ...prev, farmType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mixed Livestock">Mixed Livestock</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Beef Cattle">Beef Cattle</SelectItem>
                        <SelectItem value="Poultry">Poultry</SelectItem>
                        <SelectItem value="Swine">Swine</SelectItem>
                        <SelectItem value="Sheep & Goats">Sheep & Goats</SelectItem>
                        <SelectItem value="Organic">Organic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={farmSettings.timezone} onValueChange={(value) => setFarmSettings(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={farmSettings.currency} onValueChange={(value) => setFarmSettings(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                        <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                        <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={farmSettings.language} onValueChange={(value) => setFarmSettings(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveFarmSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Farm Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable maintenance mode for system updates</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="debugMode">Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable debug logging for troubleshooting</p>
                    </div>
                    <Switch
                      id="debugMode"
                      checked={systemSettings.debugMode}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, debugMode: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select value={systemSettings.sessionTimeout} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, sessionTimeout: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSystemSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save System Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wifi className="h-5 w-5" />
                  <span>External Integrations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weatherApi">Weather API</Label>
                      <p className="text-sm text-muted-foreground">Enable weather data integration</p>
                    </div>
                    <Switch
                      id="weatherApi"
                      checked={integrationSettings.weatherApi}
                      onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, weatherApi: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailService">Email Service</Label>
                      <p className="text-sm text-muted-foreground">Enable email notifications</p>
                    </div>
                    <Switch
                      id="emailService"
                      checked={integrationSettings.emailService}
                      onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, emailService: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cloudSync">Cloud Sync</Label>
                      <p className="text-sm text-muted-foreground">Sync data to cloud storage</p>
                    </div>
                    <Switch
                      id="cloudSync"
                      checked={integrationSettings.cloudSync}
                      onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, cloudSync: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="thirdPartyApps">Third-party Apps</Label>
                      <p className="text-sm text-muted-foreground">Allow third-party app integrations</p>
                    </div>
                    <Switch
                      id="thirdPartyApps"
                      checked={integrationSettings.thirdPartyApps}
                      onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, thirdPartyApps: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveIntegrationSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Integration Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Backup & Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoBackup">Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">Enable daily automatic backups</p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={farmSettings.autoBackup}
                      onCheckedChange={(checked) => setFarmSettings(prev => ({ ...prev, autoBackup: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention (years)</Label>
                    <Select value={farmSettings.dataRetention} onValueChange={(value) => setFarmSettings(prev => ({ ...prev, dataRetention: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 year</SelectItem>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="7">7 years</SelectItem>
                        <SelectItem value="10">10 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Manual Backup Actions</Label>
                    <div className="flex gap-2">
                      <Button variant="outline">Create Backup Now</Button>
                      <Button variant="outline">Restore from Backup</Button>
                      <Button variant="outline">Download Data Export</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Advanced Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="apiAccess">API Access</Label>
                      <p className="text-sm text-muted-foreground">Enable API access for external applications</p>
                    </div>
                    <Switch
                      id="apiAccess"
                      checked={farmSettings.apiAccess}
                      onCheckedChange={(checked) => setFarmSettings(prev => ({ ...prev, apiAccess: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="publicProfile">Public Farm Profile</Label>
                      <p className="text-sm text-muted-foreground">Make farm profile visible to public</p>
                    </div>
                    <Switch
                      id="publicProfile"
                      checked={farmSettings.publicProfile}
                      onCheckedChange={(checked) => setFarmSettings(prev => ({ ...prev, publicProfile: checked }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>System Actions</Label>
                    <div className="flex gap-2">
                      <Button variant="outline">Clear Cache</Button>
                      <Button variant="outline">Reset Settings</Button>
                      <Button variant="destructive">Factory Reset</Button>
                    </div>
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