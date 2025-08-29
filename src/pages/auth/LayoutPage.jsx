import React from "react";
import { useRandomBackground } from "@/hooks/useRandomBackground";
import logoImg from "@/assets/logo.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthLayout({
  title,
  subtitle,
  error,
  success,
  children,
  footerContent,
}) {
  const backgroundImage = useRandomBackground();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      {/* Background image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to top, var(--background), var(--background), rgba(0,0,0,0.4))",
        }}
      ></div>

      {/* Form container */}
      <div className="relative z-20 w-full max-w-md p-6">
        <div className="flex justify-center mb-4">
          <img src={logoImg} alt="Logo" className="h-16 w-16 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-center">
            {title}
        </h1>
        <Card className="shadow-2xl border-0 bg-transparent">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">
              
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-gray-200 mt-2">{subtitle}</p>
            )}

          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error/Success messages */}
            {error && (
              <Alert
                variant="destructive"
                className="border-red-200 text-red-800 bg-red-50"
              >
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
