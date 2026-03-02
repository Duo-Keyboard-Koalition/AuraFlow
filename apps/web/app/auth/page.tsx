"use client"
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

Amplify.configure(outputs);

export default function AuthPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">AuraSight</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in or create your account
          </p>
        </div>
        <Authenticator>
          {({ user }) => {
            // Set authentication state when user is available
            if (user && !isAuthenticated) {
              setIsAuthenticated(true);
            }
            return <div className="hidden">Redirecting...</div>; // Return a proper element
          }}
        </Authenticator>
      </div>
    </div>
  );
} 