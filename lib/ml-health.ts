// Machine Learning Health Prediction System
export interface HealthPrediction {
  animalId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  predictedIssues: string[];
  recommendations: string[];
  timeframe: string;
}

export interface HealthTrend {
  date: string;
  healthScore: number;
  weight: number;
  temperature?: number;
  activity?: number;
}

export class MLHealthPredictor {
  private static instance: MLHealthPredictor;
  
  static getInstance(): MLHealthPredictor {
    if (!MLHealthPredictor.instance) {
      MLHealthPredictor.instance = new MLHealthPredictor();
    }
    return MLHealthPredictor.instance;
  }

  async predictHealthRisks(animalId: string, healthHistory: HealthTrend[]): Promise<HealthPrediction> {
    // Simulate ML prediction based on health trends
    const recentTrends = healthHistory.slice(-10);
    const avgHealthScore = recentTrends.reduce((sum, t) => sum + t.healthScore, 0) / recentTrends.length;
    const healthDecline = this.calculateHealthDecline(recentTrends);
    const weightTrend = this.calculateWeightTrend(recentTrends);
    
    let riskLevel: HealthPrediction['riskLevel'] = 'low';
    let confidence = 0.7;
    const predictedIssues: string[] = [];
    const recommendations: string[] = [];

    // Health score analysis
    if (avgHealthScore < 70) {
      riskLevel = 'critical';
      confidence = 0.9;
      predictedIssues.push('Severe health decline detected');
      recommendations.push('Immediate veterinary consultation required');
    } else if (avgHealthScore < 80) {
      riskLevel = 'high';
      confidence = 0.85;
      predictedIssues.push('Health deterioration trend');
      recommendations.push('Schedule health check within 48 hours');
    } else if (healthDecline > 0.1) {
      riskLevel = 'medium';
      confidence = 0.75;
      predictedIssues.push('Declining health trend');
      recommendations.push('Monitor closely and consider preventive care');
    }

    // Weight trend analysis
    if (weightTrend < -0.05) {
      predictedIssues.push('Significant weight loss detected');
      recommendations.push('Review feeding schedule and nutritional intake');
      if (riskLevel === 'low') riskLevel = 'medium';
    } else if (weightTrend > 0.1) {
      predictedIssues.push('Rapid weight gain detected');
      recommendations.push('Adjust feeding portions and increase exercise');
    }

    // Temperature analysis
    const recentTemps = recentTrends.filter(t => t.temperature).map(t => t.temperature!);
    if (recentTemps.length > 0) {
      const avgTemp = recentTemps.reduce((sum, t) => sum + t, 0) / recentTemps.length;
      if (avgTemp > 39.5) {
        predictedIssues.push('Elevated body temperature pattern');
        recommendations.push('Monitor for signs of infection or stress');
        if (riskLevel === 'low') riskLevel = 'medium';
      }
    }

    return {
      animalId,
      riskLevel,
      confidence,
      predictedIssues,
      recommendations,
      timeframe: this.getTimeframe(riskLevel),
    };
  }

  private calculateHealthDecline(trends: HealthTrend[]): number {
    if (trends.length < 2) return 0;
    
    const first = trends[0].healthScore;
    const last = trends[trends.length - 1].healthScore;
    return (first - last) / first;
  }

  private calculateWeightTrend(trends: HealthTrend[]): number {
    if (trends.length < 2) return 0;
    
    const first = trends[0].weight;
    const last = trends[trends.length - 1].weight;
    return (last - first) / first;
  }

  private getTimeframe(riskLevel: HealthPrediction['riskLevel']): string {
    switch (riskLevel) {
      case 'critical': return 'Immediate action required';
      case 'high': return 'Within 24-48 hours';
      case 'medium': return 'Within 1 week';
      case 'low': return 'Monitor over next month';
      default: return 'Monitor regularly';
    }
  }

  async generateNutritionalRecommendations(animalId: string, species: string, weight: number, age: number): Promise<{
    dailyCalories: number;
    proteinRequirement: number;
    feedType: string;
    supplements: string[];
    feedingSchedule: string[];
  }> {
    // Simulate nutritional AI recommendations
    const baseCalories = this.calculateBaseCalories(species, weight, age);
    const proteinRequirement = this.calculateProteinRequirement(species, weight);
    
    return {
      dailyCalories: baseCalories,
      proteinRequirement,
      feedType: this.recommendFeedType(species, age),
      supplements: this.recommendSupplements(species, age),
      feedingSchedule: this.generateFeedingSchedule(species),
    };
  }

  private calculateBaseCalories(species: string, weight: number, age: number): number {
    const baseRates = {
      cow: 2.5,
      pig: 3.0,
      sheep: 2.8,
      goat: 2.7,
      horse: 2.2,
      chicken: 4.5,
    };
    
    const rate = baseRates[species as keyof typeof baseRates] || 2.5;
    const ageMultiplier = age < 1 ? 1.3 : age > 5 ? 0.9 : 1.0;
    
    return Math.round(weight * rate * ageMultiplier);
  }

  private calculateProteinRequirement(species: string, weight: number): number {
    const proteinRates = {
      cow: 0.12,
      pig: 0.16,
      sheep: 0.14,
      goat: 0.13,
      horse: 0.10,
      chicken: 0.18,
    };
    
    const rate = proteinRates[species as keyof typeof proteinRates] || 0.12;
    return Math.round(weight * rate * 100) / 100;
  }

  private recommendFeedType(species: string, age: number): string {
    if (age < 0.5) return 'Starter feed with high protein content';
    if (age < 2) return 'Grower feed with balanced nutrients';
    return 'Maintenance feed with optimal energy levels';
  }

  private recommendSupplements(species: string, age: number): string[] {
    const supplements = [];
    
    if (age < 1) {
      supplements.push('Vitamin D3 for bone development');
      supplements.push('Probiotics for digestive health');
    }
    
    if (species === 'cow' || species === 'sheep') {
      supplements.push('Calcium supplement');
      supplements.push('Mineral block');
    }
    
    return supplements;
  }

  private generateFeedingSchedule(species: string): string[] {
    const schedules = {
      cow: ['06:00 - Morning feed', '12:00 - Midday grazing', '18:00 - Evening feed'],
      pig: ['07:00 - Morning feed', '13:00 - Afternoon feed', '19:00 - Evening feed'],
      chicken: ['06:30 - Morning feed', '12:30 - Midday feed', '17:30 - Evening feed'],
      sheep: ['07:30 - Morning feed', '14:00 - Afternoon grazing', '18:30 - Evening feed'],
      goat: ['07:00 - Morning browse', '13:30 - Afternoon feed', '18:00 - Evening hay'],
      horse: ['06:00 - Morning hay', '12:00 - Midday pasture', '18:00 - Evening grain'],
    };
    
    return schedules[species as keyof typeof schedules] || schedules.cow;
  }
}

export const mlHealthPredictor = MLHealthPredictor.getInstance();