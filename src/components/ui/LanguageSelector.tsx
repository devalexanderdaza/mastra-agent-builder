import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      <button
        className="p-2 hover:bg-accent rounded-md flex items-center gap-2"
        title={i18n.t('toolbar.language')}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(
              'w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2 first:rounded-t-md last:rounded-b-md',
              i18n.language === lang.code && 'bg-accent'
            )}
          >
            <span>{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
