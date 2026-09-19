import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BreedInfo {
  name: string;
  scientific_name: string;
  origin: string;
  characteristics: string[];
  milk_yield?: string;
  weight_range: string;
  image_url: string;
  type: "cattle" | "buffalo";
}

interface BreedCardProps {
  breed: BreedInfo;
}

export function BreedCard({ breed }: BreedCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <ImageWithFallback
          src={breed.image_url}
          alt={breed.name}
          className="w-full h-full object-cover"
        />
        <Badge 
          variant={breed.type === "cattle" ? "default" : "secondary"}
          className="absolute top-2 right-2"
        >
          {breed.type === "cattle" ? "Cattle" : "Buffalo"}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle>{breed.name}</CardTitle>
        <CardDescription className="italic">{breed.scientific_name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <span className="font-medium">Origin: </span>
          <span className="text-muted-foreground">{breed.origin}</span>
        </div>
        <div>
          <span className="font-medium">Weight Range: </span>
          <span className="text-muted-foreground">{breed.weight_range}</span>
        </div>
        {breed.milk_yield && (
          <div>
            <span className="font-medium">Milk Yield: </span>
            <span className="text-muted-foreground">{breed.milk_yield}</span>
          </div>
        )}
        <div>
          <span className="font-medium">Key Characteristics:</span>
          <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
            {breed.characteristics.map((char, index) => (
              <li key={index} className="text-sm">{char}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}