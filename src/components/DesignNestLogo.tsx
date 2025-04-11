
import React from 'react';
import { cn } from '@/lib/utils';

interface DesignNestLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showDNOnly?: boolean;
  className?: string;
}

const DesignNestLogo: React.FC<DesignNestLogoProps> = ({ 
  size = 'md', 
  showText = true,
  showDNOnly = false,
  className
}) => {
  // Size mapping
  const sizeMap = {
    sm: { text: 'text-lg', spacing: 'space-x-1', container: 'h-8' },
    md: { text: 'text-xl', spacing: 'space-x-2', container: 'h-10' },
    lg: { text: 'text-2xl', spacing: 'space-x-2', container: 'h-12' },
    xl: { text: 'text-3xl', spacing: 'space-x-3', container: 'h-14' }
  };
  
  const selectedSize = sizeMap[size];
  
  return (
    <div className={cn("flex items-center", selectedSize.spacing, className)}>
      <div className={cn("font-bold", selectedSize.text, "flex")}>
        <span className="text-blue-500">D</span>
        <span className="text-green-500">N</span>
      </div>
      
      {showText && !showDNOnly && (
        <div className={cn("font-bold", selectedSize.text, "flex flex-col ml-1")}>
          <span className="text-blue-500">Design</span>
          <span className="text-green-500 -mt-1.5">Nest</span>
        </div>
      )}
    </div>
  );
};

export default DesignNestLogo;
