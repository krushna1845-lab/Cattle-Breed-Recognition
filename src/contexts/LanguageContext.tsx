import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    appName: "Farm Friend",
    appTagline: "Simple & trusted cattle breed recognition for Indian farmers",
    takePhoto: "📸 Take Photo of Animal",
    voiceInput: "🎙 Voice Commands / भाषा",
    analyzeBreed: "Analyze Breed",
    breedDetected: "Breed Identified",
    ageEstimate: "Age Estimate",
    weightEstimate: "Weight Estimate",
    healthReport: "Health Report",
    milkYield: "Milk Production",
    breedInfo: "Breed Information",
    back: "Back",
    home: "Home",
    language: "Language",
    english: "English",
    hindi: "हिंदी",
    marathi: "मराठी",
    uploadImage: "Upload a clear photo of your cattle or buffalo",
    analyzing: "Analyzing your animal...",
    confidence: "Confidence",
    riskLevel: "Risk Level",
    low: "Low",
    medium: "Medium",
    high: "High",
    precautions: "Precautions",
    treatment: "Treatment",
    milkQuantity: "Daily Milk (Liters)",
    feedType: "Feed Type",
    grass: "Grass",
    silage: "Silage", 
    mixed: "Mixed Feed",
    suggestions: "Suggestions",
    idealClimate: "Best Climate",
    commonDiseases: "Common Diseases",
    preventiveCare: "Care Tips",
    manualInput: "Manual Input",
    combineData: "Combine with Photo Analysis"
  },
  hi: {
    appName: "फार्म फ्रेंड",
    appTagline: "भारतीय किसानों के लिए सरल और भरोसेमंद गोवंश नस्ल पहचान",
    takePhoto: "📸 जानवर की फोटो लें",
    voiceInput: "🎙 आवाज में कमांड / भाषा",
    analyzeBreed: "नस्ल की जांच करें",
    breedDetected: "नस्ल की पहचान हुई",
    ageEstimate: "उम्र का अनुमान",
    weightEstimate: "वजन का अनुमान",
    healthReport: "स्वास्थ्य रिपोर्ट",
    milkYield: "दूध उत्पादन",
    breedInfo: "नस्ल की जानकारी",
    back: "वापस",
    home: "होम",
    language: "भाषा",
    english: "English",
    hindi: "हिंदी",
    marathi: "मराठी",
    uploadImage: "अपने गाय-भैंस की साफ तस्वीर अपलोड करें",
    analyzing: "आपके जानवर की जांच हो रही है...",
    confidence: "भरोसा",
    riskLevel: "खतरे का स्तर",
    low: "कम",
    medium: "मध्यम", 
    high: "ज्यादा",
    precautions: "सावधानी",
    treatment: "इलाज",
    milkQuantity: "रोज का दूध (लीटर)",
    feedType: "चारे का प्रकार",
    grass: "घास",
    silage: "साइलेज",
    mixed: "मिला-जुला चारा",
    suggestions: "सलाह",
    idealClimate: "बेहतर मौसम",
    commonDiseases: "आम बीमारियां",
    preventiveCare: "देखभाल के तरीके",
    manualInput: "खुद से भरें",
    combineData: "फोटो जांच के साथ मिलाएं"
  },
  mr: {
    appName: "फार्म फ्रेंड",
    appTagline: "भारतीय शेतकऱ्यांसाठी सोपी आणि विश्वसनीय गुरांची जात ओळख",
    takePhoto: "📸 जनावराचा फोटो काढा",
    voiceInput: "🎙 आवाजातील आदेश / भाषा",
    analyzeBreed: "जातीची तपासणी करा",
    breedDetected: "जातीची ओळख झाली",
    ageEstimate: "वयाचा अंदाज",
    weightEstimate: "वजनाचा अंदाज",
    healthReport: "आरोग्य अहवाल",
    milkYield: "दूध उत्पादन",
    breedInfo: "जातीची माहिती",
    back: "मागे",
    home: "होम",
    language: "भाषा",
    english: "English",
    hindi: "हिंदी",
    marathi: "मराठी",
    uploadImage: "आपल्या गाय-म्हशीचा स्पष्ट फोटो अपलोड करा",
    analyzing: "आपल्या जनावराची तपासणी चालू आहे...",
    confidence: "भरवसा",
    riskLevel: "धोक्याची पातळी",
    low: "कमी",
    medium: "मध्यम",
    high: "जास्त", 
    precautions: "काळजी",
    treatment: "उपचार",
    milkQuantity: "दैनिक दूध (लिटर)",
    feedType: "आहाराचा प्रकार",
    grass: "गवत",
    silage: "सायलेज",
    mixed: "मिश्र आहार",
    suggestions: "सल्ला",
    idealClimate: "चांगले हवामान",
    commonDiseases: "सामान्य आजार",
    preventiveCare: "काळजीच्या पद्धती",
    manualInput: "स्वतः भरा",
    combineData: "फोटो तपासणीसह एकत्र करा"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}