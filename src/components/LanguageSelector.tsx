import { useLanguage } from "@/hooks/useLanguage";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('pt')}
        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
          language === 'pt' 
            ? 'bg-white/20 ring-2 ring-white/40' 
            : 'hover:bg-white/10'
        }`}
        title="Português"
      >
        <span className="text-lg">🇧🇷</span>
        <span className="text-xs font-medium hidden sm:inline text-black">PT</span>
      </button>
      
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
          language === 'en' 
            ? 'bg-white/20 ring-2 ring-white/40' 
            : 'hover:bg-white/10'
        }`}
        title="English"
      >
        <span className="text-lg">🇺🇸</span>
        <span className="text-xs font-medium hidden sm:inline text-black">EN</span>
      </button>
    </div>
  );
};

export default LanguageSelector;