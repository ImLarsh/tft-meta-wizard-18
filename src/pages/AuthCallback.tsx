
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your account');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Log the full URL to debug
        console.log('Auth callback URL:', window.location.href);
        
        // The PKCE flow will automatically handle the code exchange
        // Just check if we have a session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setMessage('Authentication error');
          toast({
            title: "Authentication error",
            description: sessionError.message,
            variant: "destructive",
          });
          return;
        }
        
        if (data?.session) {
          console.log('Session established successfully');
          setMessage('Authentication successful!');
          toast({
            title: "Authentication successful",
            description: "You are now logged in.",
          });
          
          // Wait a brief moment to ensure session is properly stored
          setTimeout(() => navigate('/', { replace: true }), 1000);
          return;
        }
        
        // If there's no session but we have hash or query parameters, log them for debugging
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        console.log('Hash params:', Object.fromEntries(hashParams.entries()));
        console.log('Query params:', Object.fromEntries(queryParams.entries()));
        
        // Special case: we might have the "error" parameter if something went wrong
        if (queryParams.has('error') || hashParams.has('error')) {
          const errorMsg = queryParams.get('error') || hashParams.get('error') || 'Unknown auth error';
          const errorDescription = queryParams.get('error_description') || hashParams.get('error_description') || '';
          
          console.error('Auth error from params:', errorMsg, errorDescription);
          setError(`${errorMsg}: ${errorDescription}`);
          setMessage('Authentication error');
          toast({
            title: "Authentication error",
            description: errorDescription || errorMsg,
            variant: "destructive",
          });
          return;
        }
        
        // If we reached here, we don't have enough information to proceed
        console.log('No authentication parameters or session found');
        setMessage('No authentication data found');
        
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setMessage('An error occurred during authentication');
      } finally {
        // Redirect to home page after a delay if not already redirected
        setTimeout(() => {
          if (document.location.pathname.includes('/auth/callback')) {
            navigate('/', { replace: true });
          }
        }, 5000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">{message}</h1>
      {error && <p className="text-destructive mb-4">{error}</p>}
      <p className="text-muted-foreground">Please wait, you will be redirected shortly...</p>
    </div>
  );
};

export default AuthCallback;
