export interface HealthCondition {
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  symptoms: string[];
  precautions: string[];
  treatments: string[];
  severity: number; // 1-10
}

export interface MilkYieldFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation: string;
}

export const healthConditions: HealthCondition[] = [
  {
    name: "Foot and Mouth Disease",
    riskLevel: "high",
    symptoms: ["Fever", "Loss of appetite", "Blisters on mouth and feet"],
    precautions: ["Regular vaccination", "Quarantine new animals", "Maintain hygiene"],
    treatments: ["Immediate veterinary care", "Symptomatic treatment", "Isolation"],
    severity: 8
  },
  {
    name: "Mastitis",
    riskLevel: "medium",
    symptoms: ["Swollen udder", "Reduced milk quality", "Heat in udder"],
    precautions: ["Clean milking equipment", "Proper milking technique", "Dry cow therapy"],
    treatments: ["Antibiotic therapy", "Frequent milking", "Cold compress"],
    severity: 6
  },
  {
    name: "Tick Infestation",
    riskLevel: "low",
    symptoms: ["Visible ticks", "Skin irritation", "Reduced feed intake"],
    precautions: ["Regular inspection", "Use tick repellent", "Clean surroundings"],
    treatments: ["Tick removal", "Antiseptic application", "Antihistamines if needed"],
    severity: 3
  },
  {
    name: "Nutritional Deficiency",
    riskLevel: "medium",
    symptoms: ["Weight loss", "Dull coat", "Reduced milk production"],
    precautions: ["Balanced diet", "Regular feeding schedule", "Mineral supplements"],
    treatments: ["Improve nutrition", "Vitamin supplements", "Gradual diet change"],
    severity: 5
  }
];

export const generateHealthReport = (imageAnalysis: any) => {
  // Mock health analysis based on image
  const detectedConditions = healthConditions.filter(() => Math.random() > 0.7);
  
  if (detectedConditions.length === 0) {
    detectedConditions.push(healthConditions[2]); // Add at least one low-risk condition
  }
  
  return detectedConditions.sort((a, b) => b.severity - a.severity);
};

export const milkYieldFactors: MilkYieldFactor[] = [
  {
    factor: "High quality mixed feed",
    impact: "positive",
    recommendation: "Continue providing balanced nutrition with proteins and minerals"
  },
  {
    factor: "Adequate water supply",
    impact: "positive", 
    recommendation: "Ensure 50-80 liters of clean water per day"
  },
  {
    factor: "Regular milking schedule",
    impact: "positive",
    recommendation: "Maintain 2-3 times daily milking at consistent intervals"
  },
  {
    factor: "Stress from overcrowding", 
    impact: "negative",
    recommendation: "Provide adequate space - 40-50 sq ft per animal"
  },
  {
    factor: "Poor quality fodder",
    impact: "negative",
    recommendation: "Improve fodder quality with green feed and concentrates"
  }
];

export const generateMilkYieldAnalysis = (milkQuantity: number, feedType: string, breed: string) => {
  const expectedYield = {
    "Gir": { min: 6, max: 10 },
    "Sahiwal": { min: 8, max: 12 },
    "Red Sindhi": { min: 5, max: 8 },
    "Murrah Buffalo": { min: 8, max: 15 },
    "Surti Buffalo": { min: 4, max: 8 }
  };

  const breedExpected = expectedYield[breed as keyof typeof expectedYield] || { min: 5, max: 10 };
  const isLowYield = milkQuantity < breedExpected.min;
  
  let factors = [...milkYieldFactors];
  
  if (feedType === 'grass') {
    factors.push({
      factor: "Grass-only diet",
      impact: "negative", 
      recommendation: "Add concentrates and mineral supplements to improve milk yield"
    });
  } else if (feedType === 'mixed') {
    factors.push({
      factor: "Balanced mixed diet",
      impact: "positive",
      recommendation: "Good nutrition choice - continue this feeding pattern"
    });
  }
  
  return {
    currentYield: milkQuantity,
    expectedYield: breedExpected,
    isLowYield,
    factors: factors.slice(0, 4),
    recommendations: isLowYield 
      ? [
          "Increase protein content in feed",
          "Check for health issues",
          "Ensure adequate rest periods",
          "Monitor water intake"
        ]
      : [
          "Maintain current feeding schedule",
          "Monitor for any changes",
          "Regular health checkups"
        ]
  };
};