import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguage } from "../contexts/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4" />
      <Select value={language} onValueChange={(value: 'en' | 'hi' | 'mr') => setLanguage(value)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('english')}</SelectItem>
          <SelectItem value="hi">{t('hindi')}</SelectItem>
          <SelectItem value="mr">{t('marathi')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}