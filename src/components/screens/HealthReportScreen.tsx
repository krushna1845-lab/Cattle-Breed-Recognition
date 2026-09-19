import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { useLanguage } from "../../contexts/LanguageContext";
import { ArrowLeft, AlertTriangle, Shield, Stethoscope, Volume2 } from "lucide-react";
import { HealthCondition } from "../../data/health";

interface HealthReportScreenProps {
  healthConditions: HealthCondition[];
  onBack: () => void;
}

export function HealthReportScreen({ healthConditions, onBack }: HealthReportScreenProps) {
  const { t } = useLanguage();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive' as const;
      case 'medium': return 'secondary' as const;
      case 'low': return 'default' as const;
      default: return 'outline' as const;
    }
  };

  const speakReport = () => {
    if ('speechSynthesis' in window) {
      let reportText = "Health Report: ";
      healthConditions.forEach(condition => {
        reportText += `${condition.name} - ${condition.riskLevel} risk. `;
        reportText += `Precautions: ${condition.precautions.join(', ')}. `;
      });
      
      const utterance = new SpeechSynthesisUtterance(reportText);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
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
            <h1 className="text-xl font-bold text-gradient-warm">{t('healthReport')}</h1>
          </div>
          <Button onClick={speakReport} variant="outline" size="sm">
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Overall Health Status */}
        <Card className="glass-panel bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Overall Health Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthConditions.length === 0 ? (
              <div className="text-center py-4">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-800">Excellent Health</p>
                <p className="text-sm text-green-600">No health issues detected</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                <p className="font-semibold text-yellow-800">
                  {healthConditions.length} condition(s) detected
                </p>
                <p className="text-sm text-yellow-600">Review recommendations below</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Conditions */}
        {healthConditions.map((condition, index) => (
          <Card key={index} className={`border-2 ${getRiskColor(condition.riskLevel)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{condition.name}</CardTitle>
                <Badge variant={getRiskBadgeVariant(condition.riskLevel)}>
                  {t(condition.riskLevel)} {t('riskLevel')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Symptoms */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Symptoms Observed
                </h4>
                <ul className="text-sm space-y-1">
                  {condition.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Precautions */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t('precautions')}
                </h4>
                <ul className="text-sm space-y-1">
                  {condition.precautions.map((precaution, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  {t('treatment')}
                </h4>
                <ul className="text-sm space-y-1">
                  {condition.treatments.map((treatment, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {treatment}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Emergency Alert */}
        {healthConditions.some(c => c.riskLevel === 'high') && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              High-risk condition detected. Please consult a veterinarian immediately.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        <Button onClick={onBack} className="w-full h-12 text-lg rounded-2xl">
          Return to Analysis
        </Button>
      </div>
    </div>
  );
}