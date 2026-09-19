export const indianBreeds = [
  {
    name: "Gir",
    scientific_name: "Bos indicus",
    origin: "Gujarat, India",
    characteristics: [
      "Distinctive dome-shaped forehead",
      "Long pendulous ears",
      "White to gray coat with red patches",
      "Docile temperament"
    ],
    milk_yield: "2,000-3,000 kg per lactation",
    weight_range: "385-454 kg (female), 545-680 kg (male)",
    image_url: "https://images.unsplash.com/photo-1712186136330-cb765939e44d",
    type: "cattle" as const
  },
  {
    name: "Red Sindhi",
    scientific_name: "Bos indicus",
    origin: "Sindh region (now Pakistan), India",
    characteristics: [
      "Red color with varying shades",
      "Compact and medium-sized",
      "Good heat tolerance",
      "Efficient milk producer"
    ],
    milk_yield: "1,800-2,500 kg per lactation",
    weight_range: "300-400 kg (female), 450-550 kg (male)",
    image_url: "https://images.unsplash.com/photo-1712186136330-cb765939e44d",
    type: "cattle" as const
  },
  {
    name: "Sahiwal",
    scientific_name: "Bos indicus",
    origin: "Punjab, Pakistan/India",
    characteristics: [
      "Reddish brown color",
      "Large size with good conformation",
      "Tick resistant",
      "High milk production"
    ],
    milk_yield: "2,500-3,500 kg per lactation",
    weight_range: "400-500 kg (female), 600-800 kg (male)",
    image_url: "https://images.unsplash.com/photo-1712186136330-cb765939e44d",
    type: "cattle" as const
  },
  {
    name: "Tharparkar",
    scientific_name: "Bos indicus",
    origin: "Thar Desert, Rajasthan",
    characteristics: [
      "White to light gray color",
      "Good draught capability",
      "Drought resistant",
      "Dual purpose breed"
    ],
    milk_yield: "1,500-2,000 kg per lactation",
    weight_range: "350-400 kg (female), 450-500 kg (male)",
    image_url: "https://images.unsplash.com/photo-1712186136330-cb765939e44d",
    type: "cattle" as const
  },
  {
    name: "Murrah Buffalo",
    scientific_name: "Bubalus bubalis",
    origin: "Haryana, India",
    characteristics: [
      "Jet black coat",
      "Curved horns",
      "Heavy milk producer",
      "Wall-eyed appearance"
    ],
    milk_yield: "2,000-4,000 kg per lactation",
    weight_range: "450-650 kg (female), 550-800 kg (male)",
    image_url: "https://images.unsplash.com/photo-1712186136330-cb765939e44d",
    type: "buffalo" as const
  },
  {
    name: "Surti Buffalo",
    scientific_name: "Bubalus bubalis", 
    origin: "Gujarat, India",
    characteristics: [
      "Black to dark brown coat",
      "Medium size",
      "Good quality milk with high fat",
      "Adaptable to various climates"
    ],
    milk_yield: "1,200-2,500 kg per lactation",
    weight_range: "350-450 kg (female), 450-550 kg (male)",
    image_url: "https://images.unsplash.com/photo-1712186136330-cb765939e44d",
    type: "buffalo" as const
  },
  {
    name: "Nili-Ravi Buffalo",
    scientific_name: "Bubalus bubalis",
    origin: "Punjab, Pakistan/India",
    characteristics: [
      "Black coat with white markings",
      "Large size",
      "High milk production",
      "White patches on face and legs"
    ],
    milk_yield: "2,500-3,500 kg per lactation", 
    weight_range: "450-650 kg (female), 600-900 kg (male)",
    image_url: "https://images.unsplash.com/photo-1712186136330-cb765939e44d",
    type: "buffalo" as const
  },
  {
    name: "Jaffarabadi Buffalo",
    scientific_name: "Bubalus bubalis",
    origin: "Gujarat, India",
    characteristics: [
      "Jet black coat",
      "Large curved horns",
      "Heavy build",
      "Good draught animal"
    ],
    milk_yield: "1,500-2,500 kg per lactation",
    weight_range: "500-700 kg (female), 700-1000 kg (male)", 
    image_url: "https://images.unsplash.com/photo-1712186136330-cb765939e44d",
    type: "buffalo" as const
  }
];

// Mock AI predictions for demonstration
export const generateMockPredictions = (imageFile: File) => {
  // Simulate AI processing delay
  return new Promise<Array<{
    breed_name: string;
    confidence: number;
    type: "cattle" | "buffalo";
    characteristics: string[];
  }>>((resolve) => {
    setTimeout(() => {
      // Mock predictions with random but realistic confidence scores
      const allBreeds = indianBreeds;
      const shuffled = [...allBreeds].sort(() => Math.random() - 0.5);
      const topBreeds = shuffled.slice(0, 3);
      
      const predictions = topBreeds.map((breed, index) => ({
        breed_name: breed.name,
        confidence: index === 0 ? 85 + Math.random() * 10 : 60 + Math.random() * 20,
        type: breed.type,
        characteristics: breed.characteristics.slice(0, 3)
      }));
      
      // Sort by confidence descending
      predictions.sort((a, b) => b.confidence - a.confidence);
      
      resolve(predictions);
    }, 2000);
  });
};