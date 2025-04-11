
import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import DesignNestLogo from './DesignNestLogo';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar logo={<DesignNestLogo showDNOnly={false} size="md" />} />
      <main className="flex-1">
        {children}
      </main>
      <Footer logo={<DesignNestLogo showText size="sm" />} />
    </div>
  );
};

export default Layout;
