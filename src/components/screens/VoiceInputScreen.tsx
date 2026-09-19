import { Button } from "../ui/button";
import { VoiceInput } from "../VoiceInput";
import { LanguageSelector } from "../LanguageSelector";
import { useLanguage } from "../../contexts/LanguageContext";
import { ArrowLeft, Sparkles } from "lucide-react";

interface VoiceInputScreenProps {
  onBack: () => void;
  onVoiceCommand: (command: string) => void;
}

export function VoiceInputScreen({ onBack, onVoiceCommand }: VoiceInputScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button onClick={onBack} variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-gradient-warm">{t('voiceInput')}</h1>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center">
          <div className="glass-panel p-3">
            <LanguageSelector />
          </div>
        </div>

        {/* Voice Input Component */}
        <VoiceInput onVoiceCommand={onVoiceCommand} />

        {/* Voice Commands Help */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="icon-tile-blue w-10 h-10">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800">Available Voice Commands</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• &quot;Take photo&quot; — Opens camera</p>
            <p>• &quot;Upload image&quot; — Opens file picker</p>
            <p>• &quot;Health report&quot; — Shows health analysis</p>
            <p>• &quot;Milk yield&quot; — Opens milk production analysis</p>
            <p>• &quot;Breed information&quot; — Shows breed details</p>
            <p>• &quot;Change language to [Hindi/Marathi]&quot; — Switches language</p>
            <p>• &quot;Go back&quot; — Returns to previous screen</p>
            <p>• &quot;Home&quot; — Returns to main screen</p>
          </div>
        </div>

        <Button onClick={onBack} className="w-full h-12 text-lg rounded-2xl">
          Return to Home
        </Button>
      </div>
    </div>
  );
}