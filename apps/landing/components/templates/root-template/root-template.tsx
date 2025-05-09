'use client';

import { RootTemplateProps } from './root-template.interface';

const RootTemplate = ({ children }: RootTemplateProps) => {
  return (
    <div className="flex h-screen">
      <div id="content" className="flex flex-col gap-6 w-full p-4 md:p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default RootTemplate;
