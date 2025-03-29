
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthForm from './AuthForm';

interface CompVoteSystemProps {
  compId: string;
  className?: string;
}

type VoteType = 'like' | 'dislike' | null;

const CompVoteSystem: React.FC<CompVoteSystemProps> = ({ compId, className }) => {
  const [currentVote, setCurrentVote] = useState<VoteType>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  // Check for authentication
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  // Fetch current votes
  useEffect(() => {
    const fetchVotes = async () => {
      if (!compId) return;
      
      setIsLoading(true);
      
      // Get total likes - using filter() instead of eq() for type safety
      const { data: likesData, error: likesError } = await supabase
        .from('comp_votes')
        .select('id')
        .filter('comp_id', 'eq', compId)
        .filter('vote_type', 'eq', 'like');
      
      if (likesError) {
        console.error('Error fetching likes:', likesError);
      } else {
        setLikes(likesData.length);
      }
      
      // Get total dislikes - using filter() instead of eq() for type safety
      const { data: dislikesData, error: dislikesError } = await supabase
        .from('comp_votes')
        .select('id')
        .filter('comp_id', 'eq', compId)
        .filter('vote_type', 'eq', 'dislike');
      
      if (dislikesError) {
        console.error('Error fetching dislikes:', dislikesError);
      } else {
        setDislikes(dislikesData.length);
      }
      
      // Get user's current vote if they have one and are logged in
      if (user) {
        const { data: userVote, error: userVoteError } = await supabase
          .from('comp_votes')
          .select('vote_type')
          .filter('comp_id', 'eq', compId)
          .filter('user_id', 'eq', user.id)
          .maybeSingle();
        
        if (userVoteError) {
          console.error('Error fetching user vote:', userVoteError);
        } else if (userVote) {
          setCurrentVote(userVote.vote_type as VoteType);
        }
      }
      
      setIsLoading(false);
    };
    
    fetchVotes();
  }, [compId, user]);
  
  const handleVote = async (voteType: VoteType) => {
    if (isLoading) return;
    
    // If not logged in, show login dialog
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }
    
    // If clicking the same vote type, remove the vote
    const newVoteType = voteType === currentVote ? null : voteType;
    
    try {
      if (currentVote) {
        // Delete existing vote - using filter() instead of eq() for type safety
        const { error: deleteError } = await supabase
          .from('comp_votes')
          .delete()
          .filter('comp_id', 'eq', compId)
          .filter('user_id', 'eq', user.id);
        
        if (deleteError) throw deleteError;
        
        // Update counts
        if (currentVote === 'like') {
          setLikes(prev => prev - 1);
        } else {
          setDislikes(prev => prev - 1);
        }
      }
      
      // Insert new vote if not null
      if (newVoteType) {
        // Using typed insert with proper structure
        const { error: insertError } = await supabase
          .from('comp_votes')
          .insert({
            comp_id: compId,
            user_id: user.id,
            vote_type: newVoteType
          } as any); // Using type assertion until we can fix the database types
        
        if (insertError) throw insertError;
        
        // Update counts
        if (newVoteType === 'like') {
          setLikes(prev => prev + 1);
        } else {
          setDislikes(prev => prev + 1);
        }
      }
      
      setCurrentVote(newVoteType);
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "There was a problem with your vote. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${currentVote === 'like' ? 'text-green-500 dark:text-green-400' : 'text-muted-foreground'}`}
          onClick={() => handleVote('like')}
          disabled={isLoading}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{likes}</span>
        </Button>
      </div>
      
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${currentVote === 'dislike' ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground'}`}
          onClick={() => handleVote('dislike')}
          disabled={isLoading}
        >
          <ThumbsDown className="h-4 w-4" />
          <span>{dislikes}</span>
        </Button>
      </div>
      
      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to vote on compositions.
            </DialogDescription>
          </DialogHeader>
          <AuthForm mode="login" onSuccess={() => setLoginDialogOpen(false)} />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => {
                setLoginDialogOpen(false);
                // Open signup dialog (this would be handled at a higher level in Header)
                document.querySelector('[data-dialog-trigger="signup"]')?.dispatchEvent(
                  new MouseEvent('click', { bubbles: true })
                );
              }}
            >
              Create one
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompVoteSystem;
