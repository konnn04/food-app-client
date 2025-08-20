import React from 'react';
import { useRandomBackground } from '../../hooks/useRandomBackground';
import logoImg from '../../assets/logo.png';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthLayout({
  title,
  subtitle,
  activeTab,
  tabs = [],
  onTabChange,
  error,
  success,
  children,
  footerContent
}) {
  const backgroundImage = useRandomBackground();

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Form container */}
      <div className="relative z-10 w-full max-w-md p-6">
        <Card className="shadow-2xl border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <img src={logoImg} alt="Logo" className="h-16 w-16 object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-2">
                {subtitle}
              </p>
            )}
            
            {/* Tab buttons */}
            {tabs && tabs.length > 0 && (
              <div className="flex gap-2 mt-4">
                {tabs.map((tab) => (
                  <Button
                    key={tab.value}
                    variant={activeTab === tab.value ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => onTabChange && onTabChange(tab.value)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error/Success messages */}
            {error && (
              <Alert variant="destructive" className="border-red-200 text-red-800 bg-red-50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-200 text-green-800 bg-green-50">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Main content */}
            {children}

            {/* Footer content */}
            {footerContent}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}