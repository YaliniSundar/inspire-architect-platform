
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import DesignNestLogo from '@/components/DesignNestLogo';

interface AuthWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footer?: React.ReactNode;
  logo?: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  title, 
  description,
  footer,
  logo
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-center mt-6 mb-2">
          {logo || <DesignNestLogo size="lg" />}
        </div>
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footer && (
          <CardFooter className="flex justify-center pt-0">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AuthWrapper;
