
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your account');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL hash and query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Debug the URL parameters to help troubleshoot
        console.log('Auth callback URL:', window.location.href);
        console.log('Hash params:', Object.fromEntries(hashParams.entries()));
        console.log('Query params:', Object.fromEntries(queryParams.entries()));
        
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();

        console.log('Session after callback:', data);
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          setMessage('Authentication successful!');
          toast({
            title: "Authentication successful",
            description: "You are now logged in.",
          });

          // Wait a brief moment to ensure session is properly stored
          await new Promise(resolve => setTimeout(resolve, 500));
          
          navigate('/', { replace: true });
          return;
        }
        
        // If there's no session but we have auth parameters, process them
        if (hashParams.has('access_token') || queryParams.has('code')) {
          setMessage('Processing authentication...');
          
          try {
            // The token will be automatically handled by Supabase
            // Just wait for it to process
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check the session again after a delay
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) throw sessionError;
            
            if (sessionData?.session) {
              console.log('Auth callback successful, session established');
              setMessage('Authentication successful!');
              toast({
                title: "Authentication successful",
                description: "You are now logged in.",
              });
              
              // Navigate to home page with a small delay to ensure session is stored
              setTimeout(() => navigate('/', { replace: true }), 500);
              return;
            } else {
              console.log('No session after processing auth parameters');
              setMessage('Authentication failed');
              toast({
                title: "Authentication error",
                description: "Could not establish a session.",
                variant: "destructive",
              });
            }
          } catch (authError: any) {
            console.error('Error processing authentication:', authError);
            setMessage('Authentication error');
            toast({
              title: "Authentication error",
              description: authError.message || "There was a problem with authentication.",
              variant: "destructive",
            });
          }
        } else {
          console.log('No authentication parameters found in URL');
          setMessage('No authentication parameters found');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setMessage('An error occurred during authentication');
      } finally {
        // Redirect to home page after a delay if not already redirected
        setTimeout(() => {
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
