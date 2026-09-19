import { useState } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";
import { HomeScreen } from "./components/screens/HomeScreen";
import { VoiceInputScreen } from "./components/screens/VoiceInputScreen";
import { BreedDetectionScreen } from "./components/screens/BreedDetectionScreen";
import { HealthReportScreen } from "./components/screens/HealthReportScreen";
import { MilkYieldScreen } from "./components/screens/MilkYieldScreen";
import { ImageUpload } from "./components/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ArrowLeft } from "lucide-react";
import farmBackgroundImage from "./assets/baa9075524e9d2506bd365aea46131ae7fd2d2bf.png";

type Screen = 'home' | 'voice' | 'upload' | 'detection' | 'health' | 'milkYield' | 'breedInfo';

interface BreedDetectionResult {
  breed_name: string;
  confidence: number;
  type: "cattle" | "buffalo";
  age_estimate: string;
  weight_estimate: string;
  characteristics: string[];
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [detectionResult, setDetectionResult] = useState<BreedDetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthConditions, setHealthConditions] = useState<any[]>([]);

  const handleImageSelect = async (file: File) => {
  setSelectedImage(file);
  setIsAnalyzing(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Backend result:", data);

    const result: BreedDetectionResult = {
      breed_name: data.breed,
      confidence: data.confidence,
      type: "cattle", // you can refine this later
      age_estimate: `${2 + Math.floor(Math.random() * 6)} years`,
      weight_estimate: `${300 + Math.floor(Math.random() * 200)} kg`,
      characteristics: ["Strong", "Healthy", "Farm breed"], // dummy for now
    };

    setDetectionResult(result);
    setCurrentScreen("detection");
  } catch (error) {
    console.error("Analysis failed:", error);
  } finally {
    setIsAnalyzing(false);
  }
};


  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('take photo') || lowerCommand.includes('upload')) {
      setCurrentScreen('upload');
    } else if (lowerCommand.includes('health')) {
      if (detectionResult) {
        setCurrentScreen('health');
      }
    } else if (lowerCommand.includes('milk')) {
      if (detectionResult) {
        setCurrentScreen('milkYield');
      }
    } else if (lowerCommand.includes('home') || lowerCommand.includes('back')) {
      setCurrentScreen('home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onTakePhoto={() => setCurrentScreen('upload')}
            onVoiceInput={() => setCurrentScreen('voice')}
          />
        );

      case 'voice':
        return (
          <VoiceInputScreen
            onBack={() => setCurrentScreen('home')}
            onVoiceCommand={handleVoiceCommand}
          />
        );

      case 'upload':
        return (
          <div className="min-h-screen p-4">
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <Button onClick={() => setCurrentScreen('home')} variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-xl font-semibold">Upload Photo</h1>
              </div>

              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClearImage={() => setSelectedImage(null)}
              />
            </div>
          </div>
        );

      case 'detection':
        return (
          <BreedDetectionScreen
            result={detectionResult}
            imageFile={selectedImage}
            isLoading={isAnalyzing}
            onBack={() => setCurrentScreen('home')}
            onHealthReport={() => setCurrentScreen('health')}
            onMilkYieldAnalysis={() => setCurrentScreen('milkYield')}
            onBreedInfo={() => setCurrentScreen('breedInfo')}
          />
        );

      case 'health':
        return (
          <HealthReportScreen
            healthConditions={healthConditions}
            onBack={() => setCurrentScreen('detection')}
          />
        );

      case 'milkYield':
        return (
          <MilkYieldScreen
            breedName={detectionResult?.breed_name || ''}
            onBack={() => setCurrentScreen('detection')}
          />
        );

      case 'breedInfo':
        return (
          <div className="min-h-screen p-4">
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <Button onClick={() => setCurrentScreen('detection')} variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-xl font-semibold">Breed Information</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{detectionResult?.breed_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Ideal Climate</h4>
                      <p className="text-sm text-muted-foreground">
                        Tropical to subtropical climate with temperatures between 15–35°C
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Common Diseases</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Foot and Mouth Disease</li>
                        <li>• Mastitis</li>
                        <li>• Tick-borne diseases</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium">Preventive Care</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Regular vaccination schedule</li>
                        <li>• Clean housing and feeding areas</li>
                        <li>• Balanced nutrition</li>
                        <li>• Regular health checkups</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen relative">
        {/* Global Farm Background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <img
            src={farmBackgroundImage}
            alt="Farm Background"
            className="w-full h-full object-cover farm-bg-img"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/80"></div>
          <div className="ambient-blob blob-green" style={{ width: 280, height: 280, top: -80, left: -80 }}></div>
          <div className="ambient-blob blob-amber" style={{ width: 340, height: 340, top: '32%', right: -140 }}></div>
          <div className="ambient-blob blob-orange" style={{ width: 260, height: 260, bottom: -100, left: -60 }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 animate-fadein">
          {renderScreen()}
        </div>
      </div>
    </LanguageProvider>
  );
}
