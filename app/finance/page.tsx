"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Plus, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts';
import { useData } from '@/lib/data';
import toast from 'react-hot-toast';

const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, expenses: 41000, profit: 26000 },
];

const expenseData = [
  { name: 'Feed', value: 35, amount: 14000 },
  { name: 'Veterinary', value: 20, amount: 8000 },
  { name: 'Labor', value: 25, amount: 10000 },
  { name: 'Equipment', value: 10, amount: 4000 },
  { name: 'Utilities', value: 10, amount: 4000 },
];

const animalProfitability = [
  { species: 'Cattle', revenue: 25000, cost: 15000, profit: 10000, count: 12 },
  { species: 'Pigs', revenue: 18000, cost: 12000, profit: 6000, count: 25 },
  { species: 'Sheep', revenue: 8000, cost: 5000, profit: 3000, count: 30 },
  { species: 'Chickens', revenue: 12000, cost: 7000, profit: 5000, count: 150 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export default function FinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'income', description: 'Milk Sales - Dairy Co.', amount: 2500, category: 'Sales', date: '2024-01-20', createdAt: new Date().toISOString() },
    { id: '2', type: 'expense', description: 'Feed Purchase - Farm Supply', amount: 850, category: 'Feed', date: '2024-01-19', createdAt: new Date().toISOString() },
    { id: '3', type: 'income', description: 'Livestock Sale - 3 Cattle', amount: 4200, category: 'Sales', date: '2024-01-18', createdAt: new Date().toISOString() },
    { id: '4', type: 'expense', description: 'Veterinary Services', amount: 320, category: 'Healthcare', date: '2024-01-17', createdAt: new Date().toISOString() },
    { id: '5', type: 'expense', description: 'Equipment Maintenance', amount: 180, category: 'Maintenance', date: '2024-01-16', createdAt: new Date().toISOString() },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const financialStats = {
    totalRevenue: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    netProfit: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    profitMargin: 0,
  };

  financialStats.profitMargin = financialStats.totalRevenue > 0 ? (financialStats.netProfit / financialStats.totalRevenue) * 100 : 0;

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transaction: Transaction = {
      id: `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: newTransaction.type,
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      date: newTransaction.date,
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => [transaction, ...prev]);
    setNewTransaction({
      type: 'income',
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
    setTransactionModalOpen(false);
    toast.success('Transaction added successfully');
  };

  const exportData = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = [
        ['Date', 'Type', 'Description', 'Category', 'Amount'].join(','),
        ...transactions.map(t => [
          t.date,
          t.type,
          `"${t.description}"`,
          t.category,
          t.amount.toString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV report exported successfully');
    } else {
      toast.success('PDF report generation started');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
            <p className="text-muted-foreground">
              Track revenue, expenses, and profitability across your farm operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportData('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportData('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => setTransactionModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${financialStats.totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% from last period
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${financialStats.totalExpenses.toLocaleString()}
                  </p>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2% from last period
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${financialStats.netProfit.toLocaleString()}
                  </p>
                  <div className="flex items-center text-xs text-blue-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18.7% from last period
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {financialStats.profitMargin.toFixed(1)}%
                  </p>
                  <div className="flex items-center text-xs text-purple-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.1% from last period
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="profitability">Profitability</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue & Profit Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                        <XAxis dataKey="month" stroke="#6B7280" />
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
                          dataKey="revenue" 
                          stroke="#22c55e" 
                          strokeWidth={3}
                          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="profit" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Expense Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseData.map((expense, index) => (
                    <div key={expense.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <div>
                          <h4 className="font-medium">{expense.name}</h4>
                          <p className="text-sm text-muted-foreground">{expense.value}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${expense.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">This month</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profitability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Animal Profitability Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={animalProfitability}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="species" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(12px)',
                      }}
                    />
                    <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                    <Bar dataKey="cost" fill="#ef4444" name="Cost" />
                    <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {animalProfitability.map((animal, index) => (
                <motion.div
                  key={animal.species}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{animal.species}</h4>
                          <Badge variant="outline">{animal.count} animals</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Revenue:</span>
                            <span className="font-medium text-green-600">
                              ${animal.revenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cost:</span>
                            <span className="font-medium text-red-600">
                              ${animal.cost.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Profit:</span>
                            <span className="font-medium text-blue-600">
                              ${animal.profit.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ROI:</span>
                            <span className="font-medium">
                              {((animal.profit / animal.cost) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h4 className="font-medium">{transaction.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {transaction.category} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Transaction Modal */}
      <Dialog open={transactionModalOpen} onOpenChange={setTransactionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={newTransaction.type} onValueChange={(value: 'income' | 'expense') => setNewTransaction(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter transaction description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {newTransaction.type === 'income' ? (
                    <>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Livestock Sales">Livestock Sales</SelectItem>
                      <SelectItem value="Milk Sales">Milk Sales</SelectItem>
                      <SelectItem value="Egg Sales">Egg Sales</SelectItem>
                      <SelectItem value="Other Income">Other Income</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Feed">Feed</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Labor">Labor</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Other Expense">Other Expense</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setTransactionModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTransaction}>
                Add Transaction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}