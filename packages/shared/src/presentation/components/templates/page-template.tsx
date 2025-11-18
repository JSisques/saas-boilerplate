import React from 'react';

interface PageTemplateProps {
  children: React.ReactNode;
}

const PageTemplate = ({ children }: PageTemplateProps) => {
  return <div className="p-4 h-full min-w-0 gap-4 space-y-4">{children}</div>;
};

export default PageTemplate;
