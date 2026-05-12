import { Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Language } from '@/lib/i18n';

export function LanguageToggle() {
  const { language, setLanguage } = useAppStore();

  const toggleLanguage = () => {
    setLanguage(language === 'it' ? 'en' : 'it');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-ghost/30 rounded"
      aria-label={`Switch to ${language === 'it' ? 'English' : 'Italian'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase font-medium tracking-wider text-xs">
        {language === 'it' ? 'EN' : 'IT'}
      </span>
    </button>
  );
}
