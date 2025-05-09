import 'server-only';

const dictionaries = {
  en: () => import('../dictionaries/en.json').then(module => module.default),
  es: () => import('../dictionaries/es.json').then(module => module.default),
};

export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>;

export async function getDictionary(locale: string) {
  const selectedLocale = locale in dictionaries ? locale : 'en';
  return dictionaries[selectedLocale as keyof typeof dictionaries]();
}
