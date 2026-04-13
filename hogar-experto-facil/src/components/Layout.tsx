import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      <Header />
      <main className="flex-1 min-h-0 flex flex-col overflow-y-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
