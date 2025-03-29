
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isUsingDefaultCredentials } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your account');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we're using default credentials
        if (isUsingDefaultCredentials()) {
          console.warn('Using default Supabase credentials. Authentication will not work correctly.');
          setMessage('Configuration issue detected');
          toast({
            title: "Configuration warning",
            description: "Supabase credentials are not set. Please configure the application with valid credentials.",
            variant: "destructive",
          });
          setTimeout(() => navigate('/', { replace: true }), 3000);
          return;
        }

        // Get the current URL hash and query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Debug the URL parameters to help troubleshoot
        console.log('Auth callback URL:', window.location.href);
        console.log('Hash params:', Object.fromEntries(hashParams.entries()));
        console.log('Query params:', Object.fromEntries(queryParams.entries()));
        
        // Manually handle the auth callback if needed
        if (hashParams.has('access_token') || queryParams.has('code')) {
          setMessage('Processing authentication...');
          
          // The PKCE flow is handled automatically by the Supabase client
          // We're just explicitly checking for the session
          const { data, error } = await supabase.auth.getSession();
          
          console.log('Session data after callback:', data);
          
          if (error) {
            console.error('Auth callback error:', error);
            setMessage('Verification failed');
            toast({
              title: "Verification failed",
              description: error.message,
              variant: "destructive",
            });
          } else if (data?.session) {
            console.log('Auth callback successful, session established');
            setMessage('Email verified successfully!');
            toast({
              title: "Email verified successfully",
              description: "You are now logged in.",
            });

            // Ensure session is persisted
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            });
          }
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setMessage('An error occurred during verification');
      } finally {
        // Give a short delay so user can see the success message
        setTimeout(() => {
          // Redirect to home page regardless of outcome
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">{message}</h1>
      <p className="text-muted-foreground">Please wait, you will be redirected shortly...</p>
    </div>
  );
};

export default AuthCallback;
