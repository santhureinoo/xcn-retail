import React from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu } from './dropdown-menu';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' }
  ];
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };
  
  return (
    <DropdownMenu
      trigger={
        <button className="flex items-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
          <span className="mr-1 text-lg">{currentLanguage.flag}</span>
          <span className="sr-only">{currentLanguage.name}</span>
        </button>
      }
      align="right"
    >
      {languages.map(language => (
        <button
          key={language.code}
          className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
            language.code === i18n.language ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
          onClick={() => changeLanguage(language.code)}
        >
          <span className="mr-2 text-lg">{language.flag}</span>
          <span>{language.name}</span>
        </button>
      ))}
    </DropdownMenu>
  );
};

export default LanguageSelector;