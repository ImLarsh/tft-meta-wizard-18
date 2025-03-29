
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'signup') {
        if (!username.trim() || !email.trim()) {
          throw new Error('Username and email are required');
        }
        
        // Get the proper origin for redirection
        // This ensures we use the correct domain where the app is hosted
        const origin = window.location.origin;
        const redirectUrl = `${origin}/auth/callback`;
        
        console.log(`Signup with redirect to: ${redirectUrl}`);
        
        // For signup, create the account with proper redirection
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
            emailRedirectTo: redirectUrl,
          },
        });

        if (signUpError) throw signUpError;

        if (data.user && data.user.identities && data.user.identities.length === 0) {
          toast({
            title: "Account already exists",
            description: "Please login with your existing account",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Verification email sent",
            description: "Please check your email to verify your account before logging in.",
          });
        }
      } else {
        // Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrorMessage(error.message || 'An error occurred. Please try again.');
      
      toast({
        title: "Authentication error",
        description: error.message || 'An error occurred. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {mode === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="your_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          minLength={6}
        />
      </div>
      
      {errorMessage && (
        <div className="text-destructive text-sm">{errorMessage}</div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {mode === 'login' ? 'Logging in...' : 'Creating account...'}
          </>
        ) : (
          mode === 'login' ? 'Login' : 'Create Account'
        )}
      </Button>
    </form>
  );
};

export default AuthForm;
