import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, MicOff, Volume2, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface VoiceInputProps {
  onVoiceCommand?: (command: string) => void;
}

export function VoiceInput({ onVoiceCommand }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { t, language } = useLanguage();
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        if (event.results[0].isFinal && onVoiceCommand) {
          onVoiceCommand(result);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="glass-panel w-full">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center justify-center gap-6">
          <Button
            size="lg"
            variant="default"
            onClick={isListening ? stopListening : startListening}
            className={`mic-btn p-0 ${isListening ? 'btn-calm glow-ring' : ''}`}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </Button>

          {transcript && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => speakText(transcript)}
              className="flex items-center gap-2 rounded-full"
            >
              <Volume2 className="w-5 h-5" />
              Speak
            </Button>
          )}
        </div>

        {isListening && (
          <div className="flex justify-center">
            <div className="listening-pill">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>Listening...</span>
            </div>
          </div>
        )}

        {transcript && (
          <div className="p-4 surface-soft rounded-2xl">
            <p className="font-medium mb-1 text-gray-700">Transcript:</p>
            <p className="text-muted-foreground">{transcript}</p>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">Try saying:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="chip">Take photo</span>
            <span className="chip">Health report</span>
            <span className="chip">Check milk yield</span>
            <span className="chip">Change language to Hindi</span>
          </div>
          <div className="flex justify-center mt-4">
            <span className="chip">
              <Sparkles className="size-3.5 text-green-600" />
              Tap the mic and speak in English, Hindi or Marathi
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}