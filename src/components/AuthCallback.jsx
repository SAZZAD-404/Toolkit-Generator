import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from URL
        const hashFragment = window.location.hash;
        
        if (hashFragment) {
          // Parse the hash fragment
          const params = new URLSearchParams(hashFragment.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken) {
            // Set the session
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              setMessage('Error confirming email: ' + error.message);
            } else {
              setMessage('Email confirmed successfully! Redirecting...');
              // Redirect to dashboard after 2 seconds
              setTimeout(() => {
                window.location.href = '/';
              }, 2000);
            }
          }
        } else {
          setMessage('Invalid confirmation link');
        }
      } catch (error) {
        setMessage('Error processing confirmation: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-theme-primary font-medium">Confirming your email...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="bg-theme-secondary rounded-lg p-8 border border-theme">
          <h2 className="text-2xl font-bold text-theme-primary mb-4">
            Email Confirmation
          </h2>
          <p className="text-theme-secondary mb-6">
            {message}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}