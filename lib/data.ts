import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Animal {
  id: string;
  farmId: string; // Add farmId to isolate data
  name: string;
  species: 'cow' | 'pig' | 'chicken' | 'sheep' | 'goat' | 'horse';
  breed: string;
  gender: 'male' | 'female';
  birthDate: string;
  weight: number;
  healthScore: number;
  status: 'healthy' | 'sick' | 'pregnant' | 'quarantine';
  location: string;
  motherId?: string;
  fatherId?: string;
  image?: string;
  notes: string;
  vaccinations: Vaccination[];
  treatments: Treatment[];
  rfidTag?: string;
  earTag?: string;
  microchipId?: string;
  qrCode?: string;
  measurements: Measurement[];
  createdAt: string;
  updatedAt: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDue: string;
  veterinarian: string;
  notes: string;
}

export interface Treatment {
  id: string;
  condition: string;
  medication: string;
  startDate: string;
  endDate: string;
  veterinarian: string;
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Measurement {
  id: string;
  type: 'weight' | 'height' | 'temperature' | 'heart_rate' | 'milk_production';
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface Task {
  id: string;
  farmId: string; // Add farmId to isolate data
  title: string;
  description: string;
  type: 'feeding' | 'health' | 'breeding' | 'maintenance' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: string;
  dueDate: string;
  animalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  farmId: string; // Add farmId to isolate data
  name: string;
  category: 'feed' | 'medicine' | 'equipment' | 'supplies';
  quantity: number;
  unit: string;
  minStock: number;
  cost: number;
  supplier: string;
  expiryDate?: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  farmId: string; // Add farmId to isolate data
  animalId: string;
  date: string;
  healthScore: number;
  temperature?: number;
  weight?: number;
  notes: string;
  veterinarian?: string;
  createdAt: string;
}

export interface FeedingRecord {
  id: string;
  farmId: string; // Add farmId to isolate data
  animalId: string;
  feedType: string;
  amount: number;
  unit: string;
  feedingTime: string;
  cost: number;
  notes: string;
  createdAt: string;
}

export interface BreedingRecord {
  id: string;
  farmId: string; // Add farmId to isolate data
  femaleId: string;
  maleId: string;
  breedingDate: string;
  method: 'natural' | 'ai' | 'embryo';
  expectedDueDate?: string;
  status: 'planned' | 'completed' | 'successful' | 'failed';
  notes: string;
  createdAt: string;
}

export interface ProductionRecord {
  id: string;
  farmId: string; // Add farmId to isolate data
  animalId: string;
  productType: 'milk' | 'eggs' | 'meat' | 'wool' | 'honey' | 'cheese';
  quantity: number;
  unit: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  date: string;
  notes: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  farmId: string; // Add farmId to isolate data
  name: string;
  email: string;
  role: 'manager' | 'worker' | 'veterinarian' | 'supervisor';
  department: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'on-leave';
  hireDate: string;
  permissions: string[];
  hoursWorked: number;
  performance: number;
  location: string;
  salary?: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface DataState {
  animals: Animal[];
  tasks: Task[];
  inventory: InventoryItem[];
  healthRecords: HealthRecord[];
  feedingRecords: FeedingRecord[];
  breedingRecords: BreedingRecord[];
  productionRecords: ProductionRecord[];
  staff: StaffMember[];
  
  // Animal operations
  addAnimal: (animal: Omit<Animal, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => void;
  updateAnimal: (id: string, animal: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Inventory operations
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Health record operations
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'farmId' | 'createdAt'>) => void;
  updateHealthRecord: (id: string, record: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;
  
  // Feeding record operations
  addFeedingRecord: (record: Omit<FeedingRecord, 'id' | 'farmId' | 'createdAt'>) => void;
  updateFeedingRecord: (id: string, record: Partial<FeedingRecord>) => void;
  deleteFeedingRecord: (id: string) => void;
  
  // Breeding record operations
  addBreedingRecord: (record: Omit<BreedingRecord, 'id' | 'farmId' | 'createdAt'>) => void;
  updateBreedingRecord: (id: string, record: Partial<BreedingRecord>) => void;
  deleteBreedingRecord: (id: string) => void;

  // Production record operations
  addProductionRecord: (record: Omit<ProductionRecord, 'id' | 'farmId' | 'createdAt'>) => void;
  updateProductionRecord: (id: string, record: Partial<ProductionRecord>) => void;
  deleteProductionRecord: (id: string) => void;

  // Staff operations
  addStaffMember: (staff: Omit<StaffMember, 'id' | 'farmId'>) => void;
  updateStaffMember: (id: string, staff: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;

  // Measurement operations
  addMeasurement: (animalId: string, measurement: Omit<Measurement, 'id'>) => void;
  updateMeasurement: (animalId: string, measurementId: string, measurement: Partial<Measurement>) => void;
  deleteMeasurement: (animalId: string, measurementId: string) => void;
}

// Helper function to get current user's farm ID
const getCurrentFarmId = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    return authState?.state?.user?.farmId || null;
  } catch {
    return null;
  }
};

// Initialize with sample data for farm-1 only
const sampleAnimals: Animal[] = [
  {
    id: 'animal_1',
    farmId: 'farm-1',
    name: 'Bella',
    species: 'cow',
    breed: 'Holstein',
    gender: 'female',
    birthDate: '2020-03-15',
    weight: 650,
    healthScore: 95,
    status: 'healthy',
    location: 'Pasture A',
    notes: 'High milk producer, excellent health record',
    vaccinations: [],
    treatments: [],
    rfidTag: 'RF001234',
    earTag: 'ET001',
    microchipId: 'MC123456789',
    measurements: [
      { id: 'm1', type: 'weight', value: 650, unit: 'kg', date: new Date().toISOString() },
      { id: 'm2', type: 'milk_production', value: 25, unit: 'liters/day', date: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'animal_2',
    farmId: 'farm-1',
    name: 'Max',
    species: 'cow',
    breed: 'Angus',
    gender: 'male',
    birthDate: '2019-08-22',
    weight: 850,
    healthScore: 92,
    status: 'healthy',
    location: 'Pasture B',
    notes: 'Prime breeding bull, excellent genetics',
    vaccinations: [],
    treatments: [],
    rfidTag: 'RF001235',
    earTag: 'ET002',
    measurements: [
      { id: 'm3', type: 'weight', value: 850, unit: 'kg', date: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleTasks: Task[] = [
  {
    id: 'task_1',
    farmId: 'farm-1',
    title: 'Vaccination - Cattle Group A',
    description: 'Annual vaccination for 12 cattle in Pasture A',
    type: 'health',
    priority: 'high',
    status: 'pending',
    assignedTo: 'Dr. Sarah Johnson',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleInventory: InventoryItem[] = [
  {
    id: 'inv_1',
    farmId: 'farm-1',
    name: 'Premium Cattle Feed',
    category: 'feed',
    quantity: 500,
    unit: 'kg',
    minStock: 100,
    cost: 2.50,
    supplier: 'Farm Supply Co.',
    location: 'Feed Storage A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleStaff: StaffMember[] = [
  {
    id: 'staff_1',
    farmId: 'farm-1',
    name: 'John Smith',
    email: 'john@farm.com',
    role: 'manager',
    department: 'Operations',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    status: 'active',
    hireDate: '2020-01-15',
    permissions: ['manage_animals', 'view_reports', 'manage_staff'],
    hoursWorked: 160,
    performance: 95,
    location: 'Main Farm',
    salary: 65000,
    emergencyContact: {
      name: 'Jane Smith',
      phone: '+1 (555) 123-4568',
      relationship: 'Spouse'
    }
  },
];

export const useData = create<DataState>()(
  persist(
    (set, get) => ({
      animals: sampleAnimals,
      tasks: sampleTasks,
      inventory: sampleInventory,
      healthRecords: [],
      feedingRecords: [],
      breedingRecords: [],
      productionRecords: [],
      staff: sampleStaff,
      
      // Animal operations
      addAnimal: (animalData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        const newAnimal: Animal = {
          ...animalData,
          id: `animal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          farmId,
          measurements: [],
          vaccinations: animalData.vaccinations || [],
          treatments: animalData.treatments || [],
          qrCode: `QR_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(state => ({ animals: [...state.animals, newAnimal] }));
      },
      
      updateAnimal: (id, animalData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          animals: state.animals.map(animal =>
            animal.id === id && animal.farmId === farmId
              ? { ...animal, ...animalData, updatedAt: new Date().toISOString() }
              : animal
          )
        }));
      },
      
      deleteAnimal: (id) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          animals: state.animals.filter(animal => !(animal.id === id && animal.farmId === farmId)),
          healthRecords: state.healthRecords.filter(record => !(record.animalId === id && record.farmId === farmId)),
          feedingRecords: state.feedingRecords.filter(record => !(record.animalId === id && record.farmId === farmId)),
          productionRecords: state.productionRecords.filter(record => !(record.animalId === id && record.farmId === farmId)),
        }));
      },
      
      // Task operations
      addTask: (taskData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        const newTask: Task = {
          ...taskData,
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          farmId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(state => ({ tasks: [...state.tasks, newTask] }));
      },
      
      updateTask: (id, taskData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id && task.farmId === farmId
              ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
              : task
          )
        }));
      },
      
      deleteTask: (id) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          tasks: state.tasks.filter(task => !(task.id === id && task.farmId === farmId))
        }));
      },
      
      // Inventory operations
      addInventoryItem: (itemData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        const newItem: InventoryItem = {
          ...itemData,
          id: `inventory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          farmId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(state => ({ inventory: [...state.inventory, newItem] }));
      },
      
      updateInventoryItem: (id, itemData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          inventory: state.inventory.map(item =>
            item.id === id && item.farmId === farmId
              ? { ...item, ...itemData, updatedAt: new Date().toISOString() }
              : item
          )
        }));
      },
      
      deleteInventoryItem: (id) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          inventory: state.inventory.filter(item => !(item.id === id && item.farmId === farmId))
        }));
      },
      
      // Health record operations
      addHealthRecord: (recordData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        const newRecord: HealthRecord = {
          ...recordData,
          id: `health_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          farmId,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ healthRecords: [...state.healthRecords, newRecord] }));
        
        // Update animal's health score
        const { updateAnimal } = get();
        updateAnimal(recordData.animalId, { healthScore: recordData.healthScore });
      },
      
      updateHealthRecord: (id, recordData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          healthRecords: state.healthRecords.map(record =>
            record.id === id && record.farmId === farmId ? { ...record, ...recordData } : record
          )
        }));
      },
      
      deleteHealthRecord: (id) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          healthRecords: state.healthRecords.filter(record => !(record.id === id && record.farmId === farmId))
        }));
      },
      
      // Feeding record operations
      addFeedingRecord: (recordData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        const newRecord: FeedingRecord = {
          ...recordData,
          id: `feeding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          farmId,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ feedingRecords: [...state.feedingRecords, newRecord] }));
      },
      
      updateFeedingRecord: (id, recordData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          feedingRecords: state.feedingRecords.map(record =>
            record.id === id && record.farmId === farmId ? { ...record, ...recordData } : record
          )
        }));
      },
      
      deleteFeedingRecord: (id) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          feedingRecords: state.feedingRecords.filter(record => !(record.id === id && record.farmId === farmId))
        }));
      },
      
      // Breeding record operations
      addBreedingRecord: (recordData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        const newRecord: BreedingRecord = {
          ...recordData,
          id: `breeding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          farmId,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ breedingRecords: [...state.breedingRecords, newRecord] }));
      },
      
      updateBreedingRecord: (id, recordData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          breedingRecords: state.breedingRecords.map(record =>
            record.id === id && record.farmId === farmId ? { ...record, ...recordData } : record
          )
        }));
      },
      
      deleteBreedingRecord: (id) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          breedingRecords: state.breedingRecords.filter(record => !(record.id === id && record.farmId === farmId))
        }));
      },

      // Production record operations
      addProductionRecord: (recordData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        const newRecord: ProductionRecord = {
          ...recordData,
          id: `production_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          farmId,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ productionRecords: [...state.productionRecords, newRecord] }));
      },

      updateProductionRecord: (id, recordData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          productionRecords: state.productionRecords.map(record =>
            record.id === id && record.farmId === farmId ? { ...record, ...recordData } : record
          )
        }));
      },

      deleteProductionRecord: (id) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          productionRecords: state.productionRecords.filter(record => !(record.id === id && record.farmId === farmId))
        }));
      },

      // Staff operations
      addStaffMember: (staffData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        const newStaff: StaffMember = {
          ...staffData,
          id: `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          farmId,
        };
        set(state => ({ staff: [...state.staff, newStaff] }));
      },

      updateStaffMember: (id, staffData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          staff: state.staff.map(member =>
            member.id === id && member.farmId === farmId
              ? { ...member, ...staffData }
              : member
          )
        }));
      },

      deleteStaffMember: (id) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          staff: state.staff.filter(member => !(member.id === id && member.farmId === farmId))
        }));
      },

      // Measurement operations
      addMeasurement: (animalId, measurementData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        const newMeasurement: Measurement = {
          ...measurementData,
          id: `measurement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set(state => ({
          animals: state.animals.map(animal =>
            animal.id === animalId && animal.farmId === farmId
              ? { 
                  ...animal, 
                  measurements: [...animal.measurements, newMeasurement],
                  updatedAt: new Date().toISOString()
                }
              : animal
          )
        }));
      },

      updateMeasurement: (animalId, measurementId, measurementData) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          animals: state.animals.map(animal =>
            animal.id === animalId && animal.farmId === farmId
              ? {
                  ...animal,
                  measurements: animal.measurements.map(measurement =>
                    measurement.id === measurementId
                      ? { ...measurement, ...measurementData }
                      : measurement
                  ),
                  updatedAt: new Date().toISOString()
                }
              : animal
          )
        }));
      },

      deleteMeasurement: (animalId, measurementId) => {
        const farmId = getCurrentFarmId();
        if (!farmId) return;
        
        set(state => ({
          animals: state.animals.map(animal =>
            animal.id === animalId && animal.farmId === farmId
              ? {
                  ...animal,
                  measurements: animal.measurements.filter(measurement => measurement.id !== measurementId),
                  updatedAt: new Date().toISOString()
                }
              : animal
          )
        }));
      },
    }),
    {
      name: 'agroinsight-data-storage',
      version: 6,
      migrate: (persistedState: any) => {
        return persistedState;
      },
    }
  )
);

// Create a hook that returns filtered data for the current user's farm
export const useData = () => {
  const store = useData();
  const farmId = getCurrentFarmId();
  
  return {
    // Filtered data
    animals: farmId ? store.animals.filter(a => a.farmId === farmId) : [],
    tasks: farmId ? store.tasks.filter(t => t.farmId === farmId) : [],
    inventory: farmId ? store.inventory.filter(i => i.farmId === farmId) : [],
    healthRecords: farmId ? store.healthRecords.filter(h => h.farmId === farmId) : [],
    feedingRecords: farmId ? store.feedingRecords.filter(f => f.farmId === farmId) : [],
    breedingRecords: farmId ? store.breedingRecords.filter(b => b.farmId === farmId) : [],
    productionRecords: farmId ? store.productionRecords.filter(p => p.farmId === farmId) : [],
    staff: farmId ? store.staff.filter(s => s.farmId === farmId) : [],
    
    // Actions
    addAnimal: store.addAnimal,
    updateAnimal: store.updateAnimal,
    deleteAnimal: store.deleteAnimal,
    addTask: store.addTask,
    updateTask: store.updateTask,
    deleteTask: store.deleteTask,
    addInventoryItem: store.addInventoryItem,
    updateInventoryItem: store.updateInventoryItem,
    deleteInventoryItem: store.deleteInventoryItem,
    addHealthRecord: store.addHealthRecord,
    updateHealthRecord: store.updateHealthRecord,
    deleteHealthRecord: store.deleteHealthRecord,
    addFeedingRecord: store.addFeedingRecord,
    updateFeedingRecord: store.updateFeedingRecord,
    deleteFeedingRecord: store.deleteFeedingRecord,
    addBreedingRecord: store.addBreedingRecord,
    updateBreedingRecord: store.updateBreedingRecord,
    deleteBreedingRecord: store.deleteBreedingRecord,
    addProductionRecord: store.addProductionRecord,
    updateProductionRecord: store.updateProductionRecord,
    deleteProductionRecord: store.deleteProductionRecord,
    addStaffMember: store.addStaffMember,
    updateStaffMember: store.updateStaffMember,
    deleteStaffMember: store.deleteStaffMember,
    addMeasurement: store.addMeasurement,
    updateMeasurement: store.updateMeasurement,
    deleteMeasurement: store.deleteMeasurement,
  };
};