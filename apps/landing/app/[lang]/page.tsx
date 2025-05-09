import HomePage from '@/components/pages/home-page/home-page';

export default function Home() {
  const dictionary = {
    pages: {
      home: {
        title: 'Home',
      },
    },
  };
  return <HomePage dictionary={dictionary} />;
}
