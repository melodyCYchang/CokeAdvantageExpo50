import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// Load languages
import en from '../locales/en.json';
import es from '../locales/es.json';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en,
  es,
};

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;
