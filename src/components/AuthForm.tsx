
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
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'signup') {
        if (!username.trim()) {
          throw new Error('Username is required');
        }
        
        // Generate a fake email based on username for Supabase
        const fakeEmail = `${username.toLowerCase().replace(/\s+/g, '_')}@example.com`;
        
        // For signup, create the account without email confirmation
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: fakeEmail,
          password,
          options: {
            data: {
              username,
            },
            // Don't redirect for email confirmation
            emailRedirectTo: undefined,
          },
        });

        if (signUpError) throw signUpError;

        // Auto sign in after signup is handled by Supabase's auth state change
        toast({
          title: "Account created successfully",
          description: "You are now logged in.",
        });
      } else {
        // For login, we need to find the user by username first
        // Get all users with this username
        const { data: users, error: getUserError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .single();

        if (getUserError) {
          throw new Error('Invalid username or password');
        }

        // Now login with the associated email
        const fakeEmail = `${username.toLowerCase().replace(/\s+/g, '_')}@example.com`;
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: fakeEmail,
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
