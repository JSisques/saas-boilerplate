import NotFoundPage from '@/components/pages/not-found/not-found';
import { getDictionary } from '@/lib/dictionary';
import { Parameters } from '@/interfaces/parameters/parameters.interface';

export default async function NotFound({ params: { lang } }: Parameters) {
  const dictionary = await getDictionary(lang);
  console.log('lang', lang);
  console.log('dictionary', dictionary);

  return <NotFoundPage dictionary={dictionary} />;
}
