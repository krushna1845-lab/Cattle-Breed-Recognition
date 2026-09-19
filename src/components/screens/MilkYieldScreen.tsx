import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { useLanguage } from "../../contexts/LanguageContext";
import { ArrowLeft, Droplets, TrendingUp, TrendingDown, Volume2 } from "lucide-react";
import { generateMilkYieldAnalysis, MilkYieldFactor } from "../../data/health";

interface MilkYieldScreenProps {
  breedName: string;
  onBack: () => void;
}

interface AnalysisResult {
  currentYield: number;
  expectedYield: { min: number; max: number };
  isLowYield: boolean;
  factors: MilkYieldFactor[];
  recommendations: string[];
}

export function MilkYieldScreen({ breedName, onBack }: MilkYieldScreenProps) {
  const { t } = useLanguage();
  const [milkQuantity, setMilkQuantity] = useState("");
  const [feedType, setFeedType] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (milkQuantity && feedType) {
      const result = generateMilkYieldAnalysis(parseFloat(milkQuantity), feedType, breedName);
      setAnalysis(result);
    }
  };

  const speakAnalysis = () => {
    if (!analysis || !('speechSynthesis' in window)) return;

    let text = `Milk yield analysis: Current production is ${analysis.currentYield} liters per day. `;
    text += `Expected range for ${breedName} is ${analysis.expectedYield.min} to ${analysis.expectedYield.max} liters. `;
    
    if (analysis.isLowYield) {
      text += "Production is below expected range. ";
      text += `Recommendations: ${analysis.recommendations.join(', ')}`;
    } else {
      text += "Production is within normal range. Continue current practices.";
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-gradient-warm">{t('milkYield')}</h1>
          </div>
          {analysis && (
            <Button onClick={speakAnalysis} variant="outline" size="sm">
              <Volume2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Input Form */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              Milk Production Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="milk-quantity">{t('milkQuantity')}</Label>
              <Input
                id="milk-quantity"
                type="number"
                placeholder="Enter daily milk quantity"
                value={milkQuantity}
                onChange={(e) => setMilkQuantity(e.target.value)}
                className="text-lg p-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feed-type">{t('feedType')}</Label>
              <Select value={feedType} onValueChange={setFeedType}>
                <SelectTrigger className="text-lg p-3">
                  <SelectValue placeholder="Select feed type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grass">{t('grass')}</SelectItem>
                  <SelectItem value="silage">{t('silage')}</SelectItem>
                  <SelectItem value="mixed">{t('mixed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleAnalyze}
              className="w-full h-12 text-lg"
              disabled={!milkQuantity || !feedType}
            >
              Analyze Milk Yield
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Yield Comparison */}
            <Card className={analysis.isLowYield ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${analysis.isLowYield ? "text-red-800" : "text-green-800"}`}>
                  {analysis.isLowYield ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  Yield Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-2xl font-bold">{analysis.currentYield}L</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-muted-foreground">Expected</p>
                    <p className="text-lg font-bold">
                      {analysis.expectedYield.min}-{analysis.expectedYield.max}L
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <Badge 
                    variant={analysis.isLowYield ? "destructive" : "default"}
                    className="text-lg px-4 py-2"
                  >
                    {analysis.isLowYield ? "Below Expected" : "Normal Range"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Factors Affecting Yield */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Factors Affecting Milk Yield</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.factors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      factor.impact === 'positive' ? 'bg-green-500' : 
                      factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{factor.factor}</p>
                      <p className="text-sm text-muted-foreground">{factor.recommendation}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>{t('suggestions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {/* Action Button */}
        <Button onClick={onBack} className="w-full h-12 text-lg rounded-2xl">
          Return to Analysis
        </Button>
      </div>
    </div>
  );
}