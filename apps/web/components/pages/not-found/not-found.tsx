'use client';
import React from 'react';
import { NotFoundPageProps } from './not-found.interface';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/button/button';
import { routes } from '@/config/routes/routes';
import AuthTemplate from '@/components/templates/auth-template/auth-template';

const NotFoundPage = ({ dictionary }: NotFoundPageProps) => {
  const router = useRouter();

  return (
    <AuthTemplate dictionary={dictionary}>
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <div className="text-9xl font-extrabold text-primary-900 dark:text-primary-100">404</div>
        <h1 className="text-4xl font-bold text-primary-800 dark:text-primary-200">{dictionary.pages.notFound.title}</h1>
        <p className="text-lg text-primary-600 dark:text-primary-400">{dictionary.pages.notFound.description}</p>
        <Button className="mt-4 px-6 py-2" onClick={() => router.push(routes.home.path)}>
          {dictionary.pages.notFound.goHome}
        </Button>
      </div>
    </AuthTemplate>
  );
};

export default NotFoundPage;
