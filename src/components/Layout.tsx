
import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import DesignNestLogo from './DesignNestLogo';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar logo={<DesignNestLogo />} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
