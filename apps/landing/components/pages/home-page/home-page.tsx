'use client';

import RootTemplate from '@/components/templates/root-template/root-template';
import { HomePageProps } from './home-page.interface';
import { Button, Input, Textarea } from '@repo/ui';

const HomePage = ({ dictionary }: HomePageProps) => {
  return (
    <RootTemplate dictionary={dictionary}>
      <div>{dictionary.pages.home.title}</div>
      <Button>Click me</Button>
      <Input />
      <Textarea />
    </RootTemplate>
  );
};

export default HomePage;
