import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useLanguage } from "../../contexts/LanguageContext";
import { ArrowLeft, Camera, Activity, Weight, Calendar, Droplets, ScanLine, Sparkles } from "lucide-react";

interface BreedDetectionResult {
  breed_name: string;
  confidence: number;
  type: "cattle" | "buffalo";
  age_estimate: string;
  weight_estimate: string;
  characteristics: string[];
}

interface BreedDetectionScreenProps {
  result: BreedDetectionResult | null;
  imageFile: File | null;
  isLoading: boolean;
  onBack: () => void;
  onHealthReport: () => void;
  onMilkYieldAnalysis: () => void;
  onBreedInfo: () => void;
}

export function BreedDetectionScreen({
  result,
  imageFile,
  isLoading,
  onBack,
  onHealthReport,
  onMilkYieldAnalysis,
  onBreedInfo
}: BreedDetectionScreenProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto space-y-6">
          <Button onClick={onBack} variant="outline" className="mb-4 rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>

          <Card className="glass-panel">
            <CardContent className="p-6 text-center space-y-5">
              <div className="scan-frame mx-auto w-full h-28 rounded-2xl surface-soft">
                <div className="scan-line"></div>
                <div className="flex items-center justify-center h-full">
                  <div className="icon-tile w-12 h-12">
                    <ScanLine className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="spinner-ring w-5 h-5"></span>
                  <h2 className="text-xl font-semibold text-gray-800">{t('analyzing')}</h2>
                </div>
                <p className="text-muted-foreground">AI is scanning the image...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto">
          <Button onClick={onBack} variant="outline" className="mb-4 rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <Card className="glass-panel">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No analysis result available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button onClick={onBack} variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-gradient-warm">{t('breedDetected')}</h1>
        </div>

        {/* Image with Bounding Box Effect */}
        <Card className="glass-panel overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {imageFile && (
                <ImageWithFallback
                  src={URL.createObjectURL(imageFile)}
                  alt="Analyzed animal"
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="absolute inset-0 img-shade"></div>
              <div className="absolute inset-4 border-2 border-white-soft rounded-2xl">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-md">
                  {result.breed_name} · {Math.round(result.confidence)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detection Results */}
        <Card className="glass-panel border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <div className="icon-tile w-10 h-10">
                <Camera className="w-5 h-5 text-green-700" />
              </div>
              Detection Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 surface-soft rounded-2xl">
                <div className="flex items-center justify-center mb-2">
                  <div className="icon-tile-blue w-10 h-10">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t('ageEstimate')}</p>
                <p className="font-bold text-lg text-gray-800">{result.age_estimate}</p>
              </div>
              <div className="text-center p-4 surface-soft rounded-2xl">
                <div className="flex items-center justify-center mb-2">
                  <div className="icon-tile-amber w-10 h-10">
                    <Weight className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t('weightEstimate')}</p>
                <p className="font-bold text-lg text-gray-800">{result.weight_estimate}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-800">{result.breed_name}</h3>
                <Badge variant={result.type === "cattle" ? "default" : "secondary"} className="rounded-full">
                  {result.type === "cattle" ? "Cattle" : "Buffalo"}
                </Badge>
              </div>
              <div className="confidence-track mb-2">
                <div
                  className="confidence-fill"
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-green-700">
                  {Math.round(result.confidence)}% {t('confidence')}
                </p>
                <span className="chip">
                  <Sparkles className="size-3.5 text-green-600" />
                  Verified match
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={onHealthReport}
            className="btn-calm h-14 text-lg flex items-center justify-center gap-3 group"
          >
            <div className="icon-tile-orange w-10 h-10">
              <Activity className="w-5 h-5 text-warm" />
            </div>
            {t('healthReport')}
          </button>

          <button
            onClick={onMilkYieldAnalysis}
            className="btn-warm h-14 text-lg flex items-center justify-center gap-3 group"
          >
            <div className="icon-tile-amber w-10 h-10">
              <Droplets className="w-5 h-5 text-yellow-600" />
            </div>
            {t('milkYield')}
          </button>

          <button
            onClick={onBreedInfo}
            className="btn-gradient h-14 text-lg flex items-center justify-center gap-3 group"
          >
            <div className="icon-tile w-10 h-10">
              <Camera className="w-5 h-5 text-white" />
            </div>
            {t('breedInfo')}
          </button>
        </div>
      </div>
    </div>
  );
}