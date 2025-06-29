"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Building, Calendar, Shield, Bell, Key, Camera, Save, Edit, Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser, uploadAvatar } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'Green Valley, CA',
    farmName: user?.farmName || 'Green Valley Ranch',
    farmSize: '250 acres',
    farmType: 'Mixed Livestock',
    bio: 'Passionate farmer with 15+ years of experience in sustainable agriculture and livestock management.',
    timezone: user?.preferences?.timezone || 'America/Los_Angeles',
    language: user?.preferences?.language || 'English',
    currency: user?.preferences?.currency || 'USD',
    dateFormat: user?.preferences?.dateFormat || 'MM/DD/YYYY',
    temperatureUnit: user?.preferences?.temperatureUnit || 'Celsius',
    weightUnit: user?.preferences?.weightUnit || 'Kilograms',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    sessionTimeout: '30',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    healthAlerts: true,
    taskReminders: true,
    breedingUpdates: true,
    inventoryAlerts: true,
    weatherAlerts: true,
    systemUpdates: false,
    emailFrequency: 'immediate',
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '06:00',
  });

  const handleSaveProfile = () => {
    updateUser({
      name: profileData.name,
      email: profileData.email,
      farmName: profileData.farmName,
      preferences: {
        currency: profileData.currency,
        language: profileData.language,
        timezone: profileData.timezone,
        dateFormat: profileData.dateFormat,
        temperatureUnit: profileData.temperatureUnit,
        weightUnit: profileData.weightUnit,
      }
    });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      toast.success('Profile photo updated successfully');
    } catch (error) {
      toast.error('Failed to upload profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSecurityUpdate = (key: string, value: boolean | string) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
    toast.success('Security settings updated');
  };

  const handleNotificationUpdate = (key: string, value: boolean | string) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Notification settings updated');
  };

  const handleChangePassword = () => {
    toast.success('Password change email sent to your inbox');
  };

  const handleExportData = () => {
    toast.success('Data export initiated. You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion initiated. Please check your email for confirmation.');
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      KES: 'KSh',
      CAD: 'C$',
      AUD: 'A$',
    };
    return symbols[currency] || '$';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="farm">Farm Details</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data & Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-2xl">{user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="mb-2"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Farm Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input
                      id="farmName"
                      value={profileData.farmName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, farmName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Input
                      id="farmSize"
                      value={profileData.farmSize}
                      onChange={(e) => setProfileData(prev => ({ ...prev, farmSize: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmType">Farm Type</Label>
                    <Select 
                      value={profileData.farmType} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, farmType: value }))}
                      disabled={!isEditing}
                    >
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
                    <Label>Established</Label>
                    <Input value="2008" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={profileData.timezone} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={profileData.language} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, language: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                        <SelectItem value="Italian">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={profileData.currency} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, currency: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">US Dollar (USD) - $</SelectItem>
                        <SelectItem value="EUR">Euro (EUR) - €</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP) - £</SelectItem>
                        <SelectItem value="KES">Kenyan Shilling (KES) - KSh</SelectItem>
                        <SelectItem value="CAD">Canadian Dollar (CAD) - C$</SelectItem>
                        <SelectItem value="AUD">Australian Dollar (AUD) - A$</SelectItem>
                        <SelectItem value="JPY">Japanese Yen (JPY) - ¥</SelectItem>
                        <SelectItem value="CNY">Chinese Yuan (CNY) - ¥</SelectItem>
                        <SelectItem value="INR">Indian Rupee (INR) - ₹</SelectItem>
                        <SelectItem value="BRL">Brazilian Real (BRL) - R$</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Current symbol: {getCurrencySymbol(profileData.currency)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select 
                      value={profileData.dateFormat} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, dateFormat: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                        <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperatureUnit">Temperature Unit</Label>
                    <Select 
                      value={profileData.temperatureUnit} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, temperatureUnit: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Celsius">Celsius (°C)</SelectItem>
                        <SelectItem value="Fahrenheit">Fahrenheit (°F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weightUnit">Weight Unit</Label>
                    <Select 
                      value={profileData.weightUnit} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, weightUnit: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kilograms">Kilograms (kg)</SelectItem>
                        <SelectItem value="Pounds">Pounds (lbs)</SelectItem>
                        <SelectItem value="Stones">Stones (st)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isEditing && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> Changing currency and unit preferences will update how values are displayed throughout the application.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
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
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="health-alerts">Health Alerts</Label>
                      <p className="text-sm text-muted-foreground">Animal health and medical alerts</p>
                    </div>
                    <Switch
                      id="health-alerts"
                      checked={notificationSettings.healthAlerts}
                      onCheckedChange={(checked) => handleNotificationUpdate('healthAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="task-reminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Upcoming tasks and deadlines</p>
                    </div>
                    <Switch
                      id="task-reminders"
                      checked={notificationSettings.taskReminders}
                      onCheckedChange={(checked) => handleNotificationUpdate('taskReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="breeding-updates">Breeding Updates</Label>
                      <p className="text-sm text-muted-foreground">Breeding schedules and pregnancy updates</p>
                    </div>
                    <Switch
                      id="breeding-updates"
                      checked={notificationSettings.breedingUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate('breedingUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="inventory-alerts">Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">Low stock and inventory warnings</p>
                    </div>
                    <Switch
                      id="inventory-alerts"
                      checked={notificationSettings.inventoryAlerts}
                      onCheckedChange={(checked) => handleNotificationUpdate('inventoryAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weather-alerts">Weather Alerts</Label>
                      <p className="text-sm text-muted-foreground">Weather warnings and forecasts</p>
                    </div>
                    <Switch
                      id="weather-alerts"
                      checked={notificationSettings.weatherAlerts}
                      onCheckedChange={(checked) => handleNotificationUpdate('weatherAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Software updates and maintenance notices</p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate('systemUpdates', checked)}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Email Preferences</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailFrequency">Email Frequency</Label>
                      <Select value={notificationSettings.emailFrequency} onValueChange={(value) => handleNotificationUpdate('emailFrequency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="hourly">Hourly Digest</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="quietHours">Quiet Hours</Label>
                        <p className="text-sm text-muted-foreground">Disable notifications during specified hours</p>
                      </div>
                      <Switch
                        id="quietHours"
                        checked={notificationSettings.quietHours}
                        onCheckedChange={(checked) => handleNotificationUpdate('quietHours', checked)}
                      />
                    </div>

                    {notificationSettings.quietHours && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quietStart">Start Time</Label>
                          <Input
                            id="quietStart"
                            type="time"
                            value={notificationSettings.quietStart}
                            onChange={(e) => handleNotificationUpdate('quietStart', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quietEnd">End Time</Label>
                          <Input
                            id="quietEnd"
                            type="time"
                            value={notificationSettings.quietEnd}
                            onChange={(e) => handleNotificationUpdate('quietEnd', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityUpdate('twoFactorAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={securitySettings.emailNotifications}
                      onCheckedChange={(checked) => handleSecurityUpdate('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="login-alerts">Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new device logins</p>
                    </div>
                    <Switch
                      id="login-alerts"
                      checked={securitySettings.loginAlerts}
                      onCheckedChange={(checked) => handleSecurityUpdate('loginAlerts', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select value={securitySettings.sessionTimeout} onValueChange={(value) => handleSecurityUpdate('sessionTimeout', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Password & Authentication</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={handleChangePassword}>
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      View Active Sessions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Security Log
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Data Export</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download a copy of all your farm data including animals, records, and analytics.
                    </p>
                    <Button variant="outline" onClick={handleExportData}>
                      Export My Data
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Account Deletion</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
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