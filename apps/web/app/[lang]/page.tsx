import HomePage from '@/components/pages/home-page/home-page';
import { getDictionary } from '@/lib/dictionary';
import { Parameters } from '@/interfaces/parameters/parameters.interface';

export default async function Home({ params: { lang } }: Parameters) {
  const dictionary = await getDictionary(lang);

  return <HomePage dictionary={dictionary} />;
}
