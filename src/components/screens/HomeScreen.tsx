import { Card, CardContent } from "../ui/card";
import { LanguageSelector } from "../LanguageSelector";
import { Logo3D } from "../Logo3D";
import { useLanguage } from "../../contexts/LanguageContext";
import { Camera, Mic, Wheat, Heart, ShieldCheck, Sparkles, Lock, ChevronRight } from "lucide-react";

interface HomeScreenProps {
  onTakePhoto: () => void;
  onVoiceInput: () => void;
}

export function HomeScreen({ onTakePhoto, onVoiceInput }: HomeScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden farm-pattern">
      <div className="relative z-10 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header with 3D Logo */}
          <div className="text-center space-y-4 pt-10">
            <div className="flex justify-center mb-4">
              <Logo3D />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-gradient-warm drop-shadow-md tracking-tight">
                {t('appName')}
              </h1>
              <div className="flex justify-center">
                <span className="chip">
                  <Sparkles className="size-3.5 text-green-600" />
                  {t('appTagline')}
                </span>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex justify-center">
            <div className="glass-panel p-3">
              <LanguageSelector />
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-5">
            {/* Take Photo */}
            <button
              onClick={onTakePhoto}
              className="w-full h-28 text-white rounded-2xl btn-gradient group relative"
            >
              <div className="flex items-center justify-center gap-4 relative z-10">
                <div className="icon-tile w-12 h-12">
                  <Camera className="w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left">
                  <span className="block text-xl font-bold drop-shadow-md">{t('takePhoto')}</span>
                  <span className="block text-xs text-white/90">Tap to capture a clear photo</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-4 bg-gradient-to-r from-green-400/20 to-yellow-400/20 rounded-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
            </button>

            {/* Voice Input */}
            <button
              onClick={onVoiceInput}
              className="w-full h-28 text-white rounded-2xl btn-warm group relative"
            >
              <div className="flex items-center justify-center gap-4 relative z-10">
                <div className="icon-tile-amber w-12 h-12">
                  <Mic className="w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left">
                  <span className="block text-xl font-bold drop-shadow-md">{t('voiceInput')}</span>
                  <span className="block text-xs text-white/90">Speak in your own language</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-4 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
            </button>
          </div>

          {/* Instructions Card - Farmer Friendly */}
          <Card className="glass-panel border-yellow-600/20 field-gradient overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center space-y-5">
                <div className="flex justify-center">
                  <div className="icon-tile-orange w-12 h-12">
                    <Heart className="w-7 h-7 text-warm" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">किसान भाइयों के लिए:</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-3 text-left">
                    <div className="icon-tile w-10 h-10 shrink-0">
                      <Camera className="w-5 h-5 text-green-700" />
                    </div>
                    <p className="text-sm font-medium">अपने गाय-भैंस की साफ तस्वीर लें</p>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="icon-tile-amber w-10 h-10 shrink-0">
                      <Mic className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-sm font-medium">अपनी भाषा में बात करें</p>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="icon-tile-blue w-10 h-10 shrink-0">
                      <Wheat className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">तुरंत नस्ल और स्वास्थ्य की जांच पाएं</p>
                  </div>
                </div>

                {/* Farmer testimonial */}
                <div className="p-4 surface-soft rounded-xl border-l-4 border-green-600">
                  <p className="text-sm text-gray-800 italic font-medium">
                    "सरल, भरोसेमंद और हमारी भाषा में - हर किसान के लिए बनाया गया"
                  </p>
                </div>

                {/* Features highlight */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center gap-2 surface-soft rounded-xl p-3">
                    <div className="icon-tile w-8 h-8 shrink-0">
                      <ShieldCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="text-xs text-gray-800 font-semibold">मुफ्त उपयोग</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 surface-soft rounded-xl p-3">
                    <div className="icon-tile-blue w-8 h-8 shrink-0">
                      <Lock className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-800 font-semibold">सुरक्षित डेटा</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}