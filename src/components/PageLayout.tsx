
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <main>{children}</main>
    </div>
  );
};

export default PageLayout;
