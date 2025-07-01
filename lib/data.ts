import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuth } from './auth';
import { dataService } from './supabase-data';

// Types
export interface Animal {
  id: string;
  farmId: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  gender: 'male' | 'female';
  motherId?: string;
  fatherId?: string;
  healthScore: number;
  location: string;
  weight?: number;
  height?: number;
  status: 'active' | 'sold' | 'deceased' | 'sick' | 'healthy' | 'pregnant' | 'quarantine';
  qrCode?: string;
  rfidTag?: string;
  earTag?: string;
  microchipId?: string;
  color?: string;
  markings?: string;
  purpose: 'dairy' | 'meat' | 'breeding' | 'pets' | 'work' | 'other';
  acquisitionDate?: string;
  acquisitionCost?: number;
  currentValue?: number;
  insurance?: boolean;
  insuranceProvider?: string;
  veterinarian?: string;
  feedType?: string;
  feedSchedule?: string;
  medicalHistory?: string;
  notes?: string;
  measurements: Measurement[];
  createdAt: string;
  updatedAt: string;
}

export interface Measurement {
  id: string;
  type: 'weight' | 'height' | 'temperature' | 'heartRate' | 'other';
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface Task {
  id: string;
  farmId: string;
  title: string;
  description: string;
  type: 'feeding' | 'health' | 'maintenance' | 'breeding' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo?: string;
  dueDate: string;
  animalId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  farmId: string;
  name: string;
  category: 'feed' | 'medicine' | 'equipment' | 'supplies' | 'other';
  quantity: number;
  unit: string;
  location: string;
  expiryDate?: string;
  minStockLevel: number;
  cost: number;
  supplier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  farmId: string;
  type: 'vaccination' | 'treatment' | 'checkup' | 'illness';
  title: string;
  description: string;
  veterinarian?: string;
  medications?: string;
  nextDueDate?: string;
  cost?: number;
  status: 'scheduled' | 'completed' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface FeedingRecord {
  id: string;
  animalId: string;
  farmId: string;
  feedType: string;
  amount: number;
  unit: string;
  cost?: number;
  fedBy: string;
  notes?: string;
  createdAt: string;
}

export interface BreedingRecord {
  id: string;
  motherId: string;
  fatherId: string;
  farmId: string;
  breedingDate: string;
  expectedBirthDate?: string;
  actualBirthDate?: string;
  offspringCount?: number;
  success?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionRecord {
  id: string;
  animalId: string;
  farmId: string;
  type: 'milk' | 'eggs' | 'wool' | 'meat' | 'other';
  quantity: number;
  unit: string;
  qualityGrade?: string;
  pricePerUnit?: number;
  totalValue?: number;
  recordedBy: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  farmId: string;
  userId: string;
  name: string;
  role: 'admin' | 'manager' | 'worker';
  permissions: string[];
  salary?: number;
  hireDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface DataState {
  // State
  animals: Animal[];
  tasks: Task[];
  inventory: InventoryItem[];
  healthRecords: HealthRecord[];
  feedingRecords: FeedingRecord[];
  breedingRecords: BreedingRecord[];
  productionRecords: ProductionRecord[];
  staff: StaffMember[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Data fetching
  fetchAllData: () => Promise<void>;

  // Animal operations
  addAnimal: (animalData: Omit<Animal, 'id' | 'farmId' | 'createdAt' | 'updatedAt' | 'measurements'>) => Promise<void>;
  updateAnimal: (id: string, animalData: Partial<Animal>) => Promise<void>;
  deleteAnimal: (id: string) => Promise<void>;

  // Task operations
  addTask: (taskData: Omit<Task, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Health record operations
  addHealthRecord: (recordData: Omit<HealthRecord, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHealthRecord: (id: string, recordData: Partial<HealthRecord>) => Promise<void>;
  deleteHealthRecord: (id: string) => Promise<void>;

  // Feeding record operations
  addFeedingRecord: (recordData: Omit<FeedingRecord, 'id' | 'farmId' | 'createdAt'>) => Promise<void>;

  // Breeding record operations
  addBreedingRecord: (recordData: Omit<BreedingRecord, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => Promise<void>;

  // Production record operations
  addProductionRecord: (recordData: Omit<ProductionRecord, 'id' | 'farmId' | 'createdAt'>) => Promise<void>;

  // Staff operations
  addStaffMember: (staffData: Omit<StaffMember, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateStaffMember: (id: string, staffData: Partial<StaffMember>) => Promise<void>;
  deleteStaffMember: (id: string) => Promise<void>;

  // Measurement operations
  addMeasurement: (animalId: string, measurementData: Omit<Measurement, 'id'>) => Promise<void>;
  updateMeasurement: (animalId: string, measurementId: string, measurementData: Partial<Measurement>) => Promise<void>;
  deleteMeasurement: (animalId: string, measurementId: string) => Promise<void>;
}

// Helper function to get current farm ID
const getCurrentFarmId = (): string => {
  const authState = useAuth.getState();
  if (!authState.user?.farmId) {
    throw new Error('No authenticated user or farm ID');
  }
  return authState.user.farmId;
};

// Transform Supabase data to local types
const transformSupabaseAnimal = (supabaseAnimal: any): Animal => ({
  id: supabaseAnimal.id,
  farmId: supabaseAnimal.farm_id,
  name: supabaseAnimal.name,
  species: supabaseAnimal.species,
  breed: supabaseAnimal.breed,
  birthDate: supabaseAnimal.birth_date,
  gender: supabaseAnimal.gender,
  motherId: supabaseAnimal.mother_id,
  fatherId: supabaseAnimal.father_id,
  healthScore: supabaseAnimal.health_score || 85,
  location: supabaseAnimal.location,
  weight: supabaseAnimal.weight,
  height: supabaseAnimal.height,
  status: supabaseAnimal.status || 'healthy',
  qrCode: supabaseAnimal.qr_code,
  rfidTag: supabaseAnimal.rfid_tag,
  earTag: supabaseAnimal.ear_tag,
  microchipId: supabaseAnimal.microchip_id,
  color: supabaseAnimal.color,
  markings: supabaseAnimal.markings,
  purpose: supabaseAnimal.purpose || 'other',
  acquisitionDate: supabaseAnimal.acquisition_date,
  acquisitionCost: supabaseAnimal.acquisition_cost,
  currentValue: supabaseAnimal.current_value,
  insurance: supabaseAnimal.insurance || false,
  insuranceProvider: supabaseAnimal.insurance_provider,
  veterinarian: supabaseAnimal.veterinarian,
  feedType: supabaseAnimal.feed_type,
  feedSchedule: supabaseAnimal.feed_schedule,
  medicalHistory: supabaseAnimal.medical_history,
  notes: supabaseAnimal.notes,
  measurements: [], // Initialize empty, can be loaded separately
  createdAt: supabaseAnimal.created_at,
  updatedAt: supabaseAnimal.updated_at,
});

const transformSupabaseTask = (supabaseTask: any): Task => ({
  id: supabaseTask.id,
  farmId: supabaseTask.farm_id,
  title: supabaseTask.title,
  description: supabaseTask.description,
  type: supabaseTask.type,
  priority: supabaseTask.priority,
  status: supabaseTask.status,
  assignedTo: supabaseTask.assigned_to,
  dueDate: supabaseTask.due_date,
  animalId: supabaseTask.animal_id,
  createdBy: supabaseTask.created_by,
  createdAt: supabaseTask.created_at,
  updatedAt: supabaseTask.updated_at,
});

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // Initial state
      animals: [],
      tasks: [],
      inventory: [],
      healthRecords: [],
      feedingRecords: [],
      breedingRecords: [],
      productionRecords: [],
      staff: [],
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Fetch all data from Supabase
      fetchAllData: async () => {
        try {
          set({ isLoading: true, error: null });

          const [
            animals,
            tasks,
            healthRecords,
            feedingRecords,
            breedingRecords,
            productionRecords,
            staff
          ] = await Promise.all([
            dataService.getAnimals(),
            dataService.getTasks(),
            dataService.getHealthRecords(),
            dataService.getFeedingRecords(),
            dataService.getBreedingRecords(),
            dataService.getProductionRecords(),
            dataService.getStaff(),
          ]);

          set({
            animals: animals.map(transformSupabaseAnimal),
            tasks: tasks.map(transformSupabaseTask),
            healthRecords,
            feedingRecords,
            breedingRecords,
            productionRecords,
            staff,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Error fetching data:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Animal operations
      addAnimal: async (animalData) => {
        try {
          const newAnimal = await dataService.createAnimal({
            name: animalData.name,
            species: animalData.species,
            breed: animalData.breed,
            birth_date: animalData.birthDate,
            gender: animalData.gender,
            mother_id: animalData.motherId,
            father_id: animalData.fatherId,
            health_score: animalData.healthScore,
            location: animalData.location,
            weight: animalData.weight,
            height: animalData.height,
            status: animalData.status,
            qr_code: animalData.qrCode,
            rfid_tag: animalData.rfidTag,
            ear_tag: animalData.earTag,
            microchip_id: animalData.microchipId,
            color: animalData.color,
            markings: animalData.markings,
            purpose: animalData.purpose,
            acquisition_date: animalData.acquisitionDate,
            acquisition_cost: animalData.acquisitionCost,
            current_value: animalData.currentValue,
            insurance: animalData.insurance,
            insurance_provider: animalData.insuranceProvider,
            veterinarian: animalData.veterinarian,
            feed_type: animalData.feedType,
            feed_schedule: animalData.feedSchedule,
            medical_history: animalData.medicalHistory,
            notes: animalData.notes,
          });

          const transformedAnimal = transformSupabaseAnimal(newAnimal);
          set(state => ({ animals: [...state.animals, transformedAnimal] }));
        } catch (error: any) {
          console.error('Error adding animal:', error);
          set({ error: error.message });
        }
      },

      updateAnimal: async (id, animalData) => {
        try {
          const updateData: any = {};
          if (animalData.name) updateData.name = animalData.name;
          if (animalData.species) updateData.species = animalData.species;
          if (animalData.breed) updateData.breed = animalData.breed;
          if (animalData.birthDate) updateData.birth_date = animalData.birthDate;
          if (animalData.gender) updateData.gender = animalData.gender;
          if (animalData.motherId) updateData.mother_id = animalData.motherId;
          if (animalData.fatherId) updateData.father_id = animalData.fatherId;
          if (animalData.healthScore !== undefined) updateData.health_score = animalData.healthScore;
          if (animalData.location) updateData.location = animalData.location;
          if (animalData.weight !== undefined) updateData.weight = animalData.weight;
          if (animalData.height !== undefined) updateData.height = animalData.height;
          if (animalData.status) updateData.status = animalData.status;
          if (animalData.qrCode) updateData.qr_code = animalData.qrCode;
          if (animalData.rfidTag) updateData.rfid_tag = animalData.rfidTag;
          if (animalData.earTag) updateData.ear_tag = animalData.earTag;
          if (animalData.microchipId) updateData.microchip_id = animalData.microchipId;
          if (animalData.color) updateData.color = animalData.color;
          if (animalData.markings) updateData.markings = animalData.markings;
          if (animalData.purpose) updateData.purpose = animalData.purpose;
          if (animalData.acquisitionDate) updateData.acquisition_date = animalData.acquisitionDate;
          if (animalData.acquisitionCost !== undefined) updateData.acquisition_cost = animalData.acquisitionCost;
          if (animalData.currentValue !== undefined) updateData.current_value = animalData.currentValue;
          if (animalData.insurance !== undefined) updateData.insurance = animalData.insurance;
          if (animalData.insuranceProvider) updateData.insurance_provider = animalData.insuranceProvider;
          if (animalData.veterinarian) updateData.veterinarian = animalData.veterinarian;
          if (animalData.feedType) updateData.feed_type = animalData.feedType;
          if (animalData.feedSchedule) updateData.feed_schedule = animalData.feedSchedule;
          if (animalData.medicalHistory) updateData.medical_history = animalData.medicalHistory;
          if (animalData.notes) updateData.notes = animalData.notes;

          const updatedAnimal = await dataService.updateAnimal(id, updateData);
          const transformedAnimal = transformSupabaseAnimal(updatedAnimal);

          set(state => ({
            animals: state.animals.map(animal =>
              animal.id === id ? transformedAnimal : animal
            )
          }));
        } catch (error: any) {
          console.error('Error updating animal:', error);
          set({ error: error.message });
        }
      },

      deleteAnimal: async (id) => {
        try {
          await dataService.deleteAnimal(id);
          set(state => ({
            animals: state.animals.filter(animal => animal.id !== id)
          }));
        } catch (error: any) {
          console.error('Error deleting animal:', error);
          set({ error: error.message });
        }
      },

      // Task operations
      addTask: async (taskData) => {
        try {
          const newTask = await dataService.createTask({
            title: taskData.title,
            description: taskData.description,
            type: taskData.type,
            priority: taskData.priority,
            status: taskData.status,
            assigned_to: taskData.assignedTo,
            due_date: taskData.dueDate,
            animal_id: taskData.animalId,
            created_by: taskData.createdBy,
          });

          const transformedTask = transformSupabaseTask(newTask);
          set(state => ({ tasks: [...state.tasks, transformedTask] }));
        } catch (error: any) {
          console.error('Error adding task:', error);
          set({ error: error.message });
        }
      },

      updateTask: async (id, taskData) => {
        try {
          const updateData: any = {};
          if (taskData.title) updateData.title = taskData.title;
          if (taskData.description) updateData.description = taskData.description;
          if (taskData.type) updateData.type = taskData.type;
          if (taskData.priority) updateData.priority = taskData.priority;
          if (taskData.status) updateData.status = taskData.status;
          if (taskData.assignedTo) updateData.assigned_to = taskData.assignedTo;
          if (taskData.dueDate) updateData.due_date = taskData.dueDate;
          if (taskData.animalId) updateData.animal_id = taskData.animalId;

          const updatedTask = await dataService.updateTask(id, updateData);
          const transformedTask = transformSupabaseTask(updatedTask);

          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === id ? transformedTask : task
            )
          }));
        } catch (error: any) {
          console.error('Error updating task:', error);
          set({ error: error.message });
        }
      },

      deleteTask: async (id) => {
        try {
          await dataService.deleteTask(id);
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== id)
          }));
        } catch (error: any) {
          console.error('Error deleting task:', error);
          set({ error: error.message });
        }
      },

      // Health record operations
      addHealthRecord: async (recordData) => {
        try {
          const newRecord = await dataService.createHealthRecord({
            animal_id: recordData.animalId,
            type: recordData.type,
            title: recordData.title,
            description: recordData.description,
            veterinarian: recordData.veterinarian,
            medications: recordData.medications,
            next_due_date: recordData.nextDueDate,
            cost: recordData.cost,
            status: recordData.status,
          });

          set(state => ({ healthRecords: [...state.healthRecords, newRecord] }));
        } catch (error: any) {
          console.error('Error adding health record:', error);
          set({ error: error.message });
        }
      },

      updateHealthRecord: async (id, recordData) => {
        try {
          const updateData: any = {};
          if (recordData.animalId) updateData.animal_id = recordData.animalId;
          if (recordData.type) updateData.type = recordData.type;
          if (recordData.title) updateData.title = recordData.title;
          if (recordData.description) updateData.description = recordData.description;
          if (recordData.veterinarian) updateData.veterinarian = recordData.veterinarian;
          if (recordData.medications) updateData.medications = recordData.medications;
          if (recordData.nextDueDate) updateData.next_due_date = recordData.nextDueDate;
          if (recordData.cost !== undefined) updateData.cost = recordData.cost;
          if (recordData.status) updateData.status = recordData.status;

          const updatedRecord = await dataService.updateHealthRecord(id, updateData);

          set(state => ({
            healthRecords: state.healthRecords.map(record =>
              record.id === id ? updatedRecord : record
            )
          }));
        } catch (error: any) {
          console.error('Error updating health record:', error);
          set({ error: error.message });
        }
      },

      deleteHealthRecord: async (id) => {
        try {
          await dataService.deleteHealthRecord(id);
          set(state => ({
            healthRecords: state.healthRecords.filter(record => record.id !== id)
          }));
        } catch (error: any) {
          console.error('Error deleting health record:', error);
          set({ error: error.message });
        }
      },

      // Feeding record operations
      addFeedingRecord: async (recordData) => {
        try {
          const newRecord = await dataService.createFeedingRecord({
            animal_id: recordData.animalId,
            feed_type: recordData.feedType,
            amount: recordData.amount,
            unit: recordData.unit,
            cost: recordData.cost,
            fed_by: recordData.fedBy,
            notes: recordData.notes,
          });

          set(state => ({ feedingRecords: [...state.feedingRecords, newRecord] }));
        } catch (error: any) {
          console.error('Error adding feeding record:', error);
          set({ error: error.message });
        }
      },

      // Breeding record operations
      addBreedingRecord: async (recordData) => {
        try {
          const newRecord = await dataService.createBreedingRecord({
            mother_id: recordData.motherId,
            father_id: recordData.fatherId,
            breeding_date: recordData.breedingDate,
            expected_birth_date: recordData.expectedBirthDate,
            actual_birth_date: recordData.actualBirthDate,
            offspring_count: recordData.offspringCount,
            success: recordData.success,
            notes: recordData.notes,
          });

          set(state => ({ breedingRecords: [...state.breedingRecords, newRecord] }));
        } catch (error: any) {
          console.error('Error adding breeding record:', error);
          set({ error: error.message });
        }
      },

      // Production record operations
      addProductionRecord: async (recordData) => {
        try {
          const newRecord = await dataService.createProductionRecord({
            animal_id: recordData.animalId,
            type: recordData.type,
            quantity: recordData.quantity,
            unit: recordData.unit,
            quality_grade: recordData.qualityGrade,
            price_per_unit: recordData.pricePerUnit,
            total_value: recordData.totalValue,
            recorded_by: recordData.recordedBy,
          });

          set(state => ({ productionRecords: [...state.productionRecords, newRecord] }));
        } catch (error: any) {
          console.error('Error adding production record:', error);
          set({ error: error.message });
        }
      },

      // Staff operations
      addStaffMember: async (staffData) => {
        try {
          const newStaff = await dataService.createStaff({
            user_id: staffData.userId,
            name: staffData.name,
            role: staffData.role,
            permissions: staffData.permissions,
            salary: staffData.salary,
            hire_date: staffData.hireDate,
            status: staffData.status,
          });

          set(state => ({ staff: [...state.staff, newStaff] }));
        } catch (error: any) {
          console.error('Error adding staff member:', error);
          set({ error: error.message });
        }
      },

      updateStaffMember: async (id, staffData) => {
        try {
          const updateData: any = {};
          if (staffData.userId) updateData.user_id = staffData.userId;
          if (staffData.name) updateData.name = staffData.name;
          if (staffData.role) updateData.role = staffData.role;
          if (staffData.permissions) updateData.permissions = staffData.permissions;
          if (staffData.salary !== undefined) updateData.salary = staffData.salary;
          if (staffData.hireDate) updateData.hire_date = staffData.hireDate;
          if (staffData.status) updateData.status = staffData.status;

          const updatedStaff = await dataService.updateStaff(id, updateData);

          set(state => ({
            staff: state.staff.map(member =>
              member.id === id ? updatedStaff : member
            )
          }));
        } catch (error: any) {
          console.error('Error updating staff member:', error);
          set({ error: error.message });
        }
      },

      deleteStaffMember: async (id) => {
        try {
          await dataService.deleteStaff(id);
          set(state => ({
            staff: state.staff.filter(member => member.id !== id)
          }));
        } catch (error: any) {
          console.error('Error deleting staff member:', error);
          set({ error: error.message });
        }
      },

      // Measurement operations (local only for now)
      addMeasurement: async (animalId, measurementData) => {
        try {
          const farmId = getCurrentFarmId();

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
        } catch (error: any) {
          console.error('Error adding measurement:', error);
          set({ error: error.message });
        }
      },

      updateMeasurement: async (animalId, measurementId, measurementData) => {
        try {
          const farmId = getCurrentFarmId();

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
        } catch (error: any) {
          console.error('Error updating measurement:', error);
          set({ error: error.message });
        }
      },

      deleteMeasurement: async (animalId, measurementId) => {
        try {
          const farmId = getCurrentFarmId();

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
        } catch (error: any) {
          console.error('Error deleting measurement:', error);
          set({ error: error.message });
        }
      },
    }),
    {
      name: 'agroinsight-data-storage',
      version: 8,
      migrate: (persistedState: any) => {
        return persistedState;
      },
    }
  )
);

// Create filtered data hooks for the current user's farm
export const useFarmData = () => {
  const store = useDataStore();

  try {
    const farmId = getCurrentFarmId();

    return {
      ...store,
      animals: store.animals.filter(animal => animal.farmId === farmId),
      tasks: store.tasks.filter(task => task.farmId === farmId),
      inventory: store.inventory.filter(item => item.farmId === farmId),
      healthRecords: store.healthRecords.filter(record => record.farm_id === farmId),
      feedingRecords: store.feedingRecords.filter(record => record.farm_id === farmId),
      breedingRecords: store.breedingRecords.filter(record => record.farm_id === farmId),
      productionRecords: store.productionRecords.filter(record => record.farm_id === farmId),
      staff: store.staff.filter(member => member.farm_id === farmId),
    };
  } catch (error) {
    return store;
  }
};

// Specific hooks for different data types
export const useFarmAnimals = () => {
  const data = useFarmData();
  return data.animals;
};

export const useFarmTasks = () => {
  const data = useFarmData();
  return data.tasks;
};

export const useFarmInventory = () => {
  const data = useFarmData();
  return data.inventory;
};
// Create a hook that returns filtered data for the current user's farm
export const useFarmDataHook = () => {
  const store = useDataStore();
  const farmId = getCurrentFarmId();
};