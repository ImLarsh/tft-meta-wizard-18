
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // The PKCE flow is handled automatically by the Supabase client
      // We just need to check if it was successful and redirect
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Verification failed",
            description: error.message,
            variant: "destructive",
          });
        } else if (data?.session) {
          console.log('Auth callback successful, session established');
          toast({
            title: "Email verified successfully",
            description: "You are now logged in.",
          });
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
      } finally {
        // Redirect to home page regardless of outcome
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Verifying your account</h1>
      <p className="text-muted-foreground">Please wait, you will be redirected shortly...</p>
    </div>
  );
};

export default AuthCallback;
