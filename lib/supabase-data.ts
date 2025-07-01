
import { supabase, type Animal, type HealthRecord, type FeedingRecord, type BreedingRecord, type ProductionRecord, type FinancialRecord, type Task, type Staff } from './supabase';
import { useAuth } from './auth';

class SupabaseDataService {
  private getCurrentFarmId(): string {
    const { user } = useAuth.getState();
    if (!user) throw new Error('No authenticated user');
    return user.farmId;
  }

  // Animals
  async getAnimals(): Promise<Animal[]> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createAnimal(animal: Omit<Animal, 'id' | 'farm_id' | 'created_at' | 'updated_at'>): Promise<Animal> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('animals')
      .insert({ ...animal, farm_id: farmId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateAnimal(id: string, updates: Partial<Animal>): Promise<Animal> {
    const { data, error } = await supabase
      .from('animals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteAnimal(id: string): Promise<void> {
    const { error } = await supabase
      .from('animals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Health Records
  async getHealthRecords(): Promise<HealthRecord[]> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createHealthRecord(record: Omit<HealthRecord, 'id' | 'farm_id' | 'created_at' | 'updated_at'>): Promise<HealthRecord> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('health_records')
      .insert({ ...record, farm_id: farmId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateHealthRecord(id: string, updates: Partial<HealthRecord>): Promise<HealthRecord> {
    const { data, error } = await supabase
      .from('health_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteHealthRecord(id: string): Promise<void> {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Feeding Records
  async getFeedingRecords(): Promise<FeedingRecord[]> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createFeedingRecord(record: Omit<FeedingRecord, 'id' | 'farm_id' | 'created_at'>): Promise<FeedingRecord> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('feeding_records')
      .insert({ ...record, farm_id: farmId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Breeding Records
  async getBreedingRecords(): Promise<BreedingRecord[]> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('breeding_records')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createBreedingRecord(record: Omit<BreedingRecord, 'id' | 'farm_id' | 'created_at' | 'updated_at'>): Promise<BreedingRecord> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('breeding_records')
      .insert({ ...record, farm_id: farmId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Production Records
  async getProductionRecords(): Promise<ProductionRecord[]> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('production_records')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createProductionRecord(record: Omit<ProductionRecord, 'id' | 'farm_id' | 'created_at'>): Promise<ProductionRecord> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('production_records')
      .insert({ ...record, farm_id: farmId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Financial Records
  async getFinancialRecords(): Promise<FinancialRecord[]> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('financial_records')
      .select('*')
      .eq('farm_id', farmId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createFinancialRecord(record: Omit<FinancialRecord, 'id' | 'farm_id' | 'created_at'>): Promise<FinancialRecord> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('financial_records')
      .insert({ ...record, farm_id: farmId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('farm_id', farmId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createTask(task: Omit<Task, 'id' | 'farm_id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...task, farm_id: farmId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Staff
  async getStaff(): Promise<Staff[]> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createStaff(staff: Omit<Staff, 'id' | 'farm_id' | 'created_at' | 'updated_at'>): Promise<Staff> {
    const farmId = this.getCurrentFarmId();
    const { data, error } = await supabase
      .from('staff')
      .insert({ ...staff, farm_id: farmId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateStaff(id: string, updates: Partial<Staff>): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteStaff(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const dataService = new SupabaseDataService();
