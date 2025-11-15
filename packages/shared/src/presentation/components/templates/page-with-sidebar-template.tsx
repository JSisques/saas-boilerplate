import {
  AppSidebar,
  AppSidebarProps,
} from '@repo/shared/presentation/components/organisms/app-sidebar';
import PageTemplate from '@repo/shared/presentation/components/templates/page-template';
import { SidebarProvider } from '@repo/shared/presentation/components/ui/sidebar';
import React from 'react';

interface PageWithSidebarTemplateProps {
  children: React.ReactNode;
  sidebarProps: AppSidebarProps;
}

const PageWithSidebarTemplate = ({
  sidebarProps,
  children,
}: PageWithSidebarTemplateProps) => {
  return (
    <SidebarProvider>
      <AppSidebar {...sidebarProps} />
      <PageTemplate>{children}</PageTemplate>
    </SidebarProvider>
  );
};

export default PageWithSidebarTemplate;
