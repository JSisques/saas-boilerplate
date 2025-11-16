import React from 'react';

interface PageTemplateProps {
  children: React.ReactNode;
}

const PageTemplate = ({ children }: PageTemplateProps) => {
  return <div className="p-4 h-full min-w-0">{children}</div>;
};

export default PageTemplate;
