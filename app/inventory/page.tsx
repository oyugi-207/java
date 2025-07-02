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
import { Plus, Search, Package, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';
import { useFarmData} from '@/lib/data';
import { InventoryModal } from '@/components/inventory/inventory-modal';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function InventoryPage() {
  const { inventory } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const inventoryStats = {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => item.quantity <= item.minStock).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0),
    categories: [...new Set(inventory.map(item => item.category))].length,
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feed': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      case 'medicine': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'equipment': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300';
      case 'supplies': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  const getStockStatus = (item: any) => {
    if (item.quantity <= item.minStock) return 'low';
    if (item.quantity <= item.minStock * 2) return 'medium';
    return 'good';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      case 'good': return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">
              Track supplies, manage stock levels, and monitor inventory costs
            </p>
          </div>
          <Button onClick={() => setInventoryModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold text-blue-600">{inventoryStats.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-red-600">{inventoryStats.lowStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${inventoryStats.totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-purple-600">{inventoryStats.categories}</p>
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
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="feed">Feed</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedItem(item);
                  setInventoryModalOpen(true);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {item.supplier}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline" className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={getStockStatusColor(getStockStatus(item))}
                      >
                        {getStockStatus(item) === 'low' ? 'Low Stock' :
                         getStockStatus(item) === 'medium' ? 'Medium' : 'In Stock'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <div className="font-semibold text-lg">
                          {item.quantity} {item.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min Stock:</span>
                        <div className="font-medium">
                          {item.minStock} {item.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unit Cost:</span>
                        <div className="font-medium">
                          ${item.cost.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Value:</span>
                        <div className="font-medium">
                          ${(item.quantity * item.cost).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Stock Level</span>
                        <span>{Math.round((item.quantity / (item.minStock * 3)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getStockStatus(item) === 'low' ? 'bg-red-500' :
                            getStockStatus(item) === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (item.quantity / (item.minStock * 3)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 font-medium">{item.location}</span>
                    </div>

                    {item.expiryDate && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="ml-2 font-medium">
                          {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}

                    {getStockStatus(item) === 'low' && (
                      <div className="p-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded text-sm">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-orange-700 dark:text-orange-300">
                            Stock running low - consider reordering
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredInventory.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                No inventory items found matching your criteria.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <InventoryModal
        open={inventoryModalOpen}
        onOpenChange={setInventoryModalOpen}
        item={selectedItem}
      />
    </DashboardLayout>
  );
}