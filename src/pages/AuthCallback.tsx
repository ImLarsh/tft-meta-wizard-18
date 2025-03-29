
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
        
        // Handle the auth callback
        if (hashParams.has('access_token') || queryParams.has('code')) {
          setMessage('Processing authentication...');
          
          try {
            // Explicitly handle the authentication callback
            // This ensures the API key is properly included in the request
            let authResponse;
            
            // Handle token in hash (implicit grant)
            if (hashParams.has('access_token')) {
              const accessToken = hashParams.get('access_token');
              const refreshToken = hashParams.get('refresh_token');
              
              if (accessToken && refreshToken) {
                authResponse = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                });
              }
            } 
            // Handle authorization code in query params
            else if (queryParams.has('code')) {
              // Let Supabase automatically handle the code exchange
              console.log('Processing authorization code flow');
            }
            
            // After processing the callback, check the session
            const { data, error } = await supabase.auth.getSession();
            
            console.log('Session data after callback:', data);
            
            if (error) {
              throw error;
            } else if (data?.session) {
              console.log('Auth callback successful, session established');
              setMessage('Email verified successfully!');
              toast({
                title: "Email verified successfully",
                description: "You are now logged in.",
              });

              // Explicitly set the session to ensure it's persisted
              await supabase.auth.setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
              });
            }
          } catch (authError: any) {
            console.error('Error processing authentication:', authError);
            setMessage('Authentication error');
            toast({
              title: "Authentication error",
              description: authError.message || "There was a problem verifying your email.",
              variant: "destructive",
            });
          }
        } else {
          console.log('No authentication parameters found in URL');
          setMessage('No verification parameters found');
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
