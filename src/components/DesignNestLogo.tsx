
import React from 'react';
import { Palette, Feather, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesignNestLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const DesignNestLogo: React.FC<DesignNestLogoProps> = ({ 
  size = 'md', 
  showText = true,
  className
}) => {
  // Size mapping
  const sizeMap = {
    sm: { logo: 'h-6 w-6', text: 'text-lg', spacing: 'space-x-1', container: 'h-8' },
    md: { logo: 'h-8 w-8', text: 'text-xl', spacing: 'space-x-2', container: 'h-10' },
    lg: { logo: 'h-10 w-10', text: 'text-2xl', spacing: 'space-x-2', container: 'h-12' },
    xl: { logo: 'h-12 w-12', text: 'text-3xl', spacing: 'space-x-3', container: 'h-14' }
  };
  
  const selectedSize = sizeMap[size];
  
  return (
    <div className={cn("flex items-center", selectedSize.spacing, className)}>
      <div className={cn("relative", selectedSize.container)}>
        {/* Nest/Home base */}
        <Home 
          className={cn(
            selectedSize.logo, 
            "text-primary absolute top-0 left-0 transform -rotate-6"
          )} 
        />
        
        {/* Feather for design */}
        <Feather 
          className={cn(
            selectedSize.logo, 
            "text-secondary absolute top-0 left-0 transform rotate-12 translate-x-1"
          )} 
        />
        
        {/* Palette for creativity/design */}
        <Palette 
          className={cn(
            selectedSize.logo, 
            "text-accent absolute top-0 left-0 transform rotate-0 translate-x-0.5 translate-y-0.5"
          )} 
          strokeWidth={1.5}
        />
      </div>
      
      {showText && (
        <div className={cn("font-bold", selectedSize.text, "flex flex-col")}>
          <span className="text-primary">Design</span>
          <span className="text-secondary -mt-1.5">Nest</span>
        </div>
      )}
    </div>
  );
};

export default DesignNestLogo;
