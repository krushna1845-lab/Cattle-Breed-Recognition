import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CheckCircle, Info } from "lucide-react";

interface BreedPrediction {
  breed_name: string;
  confidence: number;
  type: "cattle" | "buffalo";
  characteristics: string[];
}

interface BreedRecognitionResultsProps {
  predictions: BreedPrediction[];
  isLoading: boolean;
}

export function BreedRecognitionResults({ predictions, isLoading }: BreedRecognitionResultsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            Analyzing Image...
          </CardTitle>
          <CardDescription>
            Our AI is identifying the breed characteristics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (predictions.length === 0) {
    return null;
  }

  const topPrediction = predictions[0];

  return (
    <div className="space-y-4">
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Breed Identified
          </CardTitle>
          <CardDescription>
            Analysis complete with high confidence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{topPrediction.breed_name}</h3>
              <Badge variant={topPrediction.type === "cattle" ? "default" : "secondary"}>
                {topPrediction.type === "cattle" ? "Cattle Breed" : "Buffalo Breed"}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(topPrediction.confidence)}%
              </div>
              <p className="text-sm text-muted-foreground">Confidence</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-2">Key Identifying Features:</p>
            <ul className="space-y-1">
              {topPrediction.characteristics.map((char, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {char}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {predictions.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Alternative Possibilities
            </CardTitle>
            <CardDescription>
              Other breeds with lower confidence scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.slice(1).map((prediction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{prediction.breed_name}</span>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {prediction.type}
                      </Badge>
                    </div>
                    <Progress 
                      value={prediction.confidence} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium ml-3">
                    {Math.round(prediction.confidence)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}