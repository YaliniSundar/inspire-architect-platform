
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  logo?: React.ReactNode;
}

const AuthWrapper = ({ title, description, children, footer, logo }: AuthWrapperProps) => {
  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          {logo && <div className="flex justify-center mb-4">{logo}</div>}
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </div>
  );
};

export default AuthWrapper;
