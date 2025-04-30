'use client';

import RootTemplate from '@/components/templates/root-template/root-template';
import { HomePageProps } from './home-page.interface';

const HomePage = ({ dictionary }: HomePageProps) => {
  return (
    <RootTemplate dictionary={dictionary}>
      <div>Home</div>
    </RootTemplate>
  );
};

export default HomePage;
