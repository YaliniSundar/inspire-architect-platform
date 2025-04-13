
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DesignNestLogo from './DesignNestLogo';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar logo={<DesignNestLogo size="md" />} />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
