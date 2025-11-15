import React from 'react';

interface PageTemplateProps {
  children: React.ReactNode;
}

const PageTemplate = ({ children }: PageTemplateProps) => {
  return <div className="p-4 w-full">{children}</div>;
};

export default PageTemplate;
