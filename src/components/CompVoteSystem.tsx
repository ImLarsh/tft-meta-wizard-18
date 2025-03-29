
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
  
  // Fetch current votes
  useEffect(() => {
    const fetchVotes = async () => {
      if (!compId) return;
      
      setIsLoading(true);
      
      // Get total likes - using filter() instead of eq() for type safety
      const { data: likesData, error: likesError } = await supabase
        .from('comp_votes')
        .select('id')
        .filter('comp_id', 'eq', compId as any)
        .filter('vote_type', 'eq', 'like' as any);
      
      if (likesError) {
        console.error('Error fetching likes:', likesError);
      } else {
        setLikes(likesData.length);
      }
      
      // Get total dislikes - using filter() instead of eq() for type safety
      const { data: dislikesData, error: dislikesError } = await supabase
        .from('comp_votes')
        .select('id')
        .filter('comp_id', 'eq', compId as any)
        .filter('vote_type', 'eq', 'dislike' as any);
      
      if (dislikesError) {
        console.error('Error fetching dislikes:', dislikesError);
      } else {
        setDislikes(dislikesData.length);
      }
      
      setIsLoading(false);
    };
    
    fetchVotes();
  }, [compId]);
  
  const handleVote = async (voteType: VoteType) => {
    if (isLoading) return;
    
    // Generate a unique ID for anonymous voting
    const voteId = `${compId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      // Insert new vote without user authentication
      if (voteType) {
        // Using typed insert
        const { error: insertError } = await supabase
          .from('comp_votes')
          .insert({
            comp_id: compId as any,
            vote_type: voteType as any,
            // No user_id needed for anonymous votes
          } as any);
        
        if (insertError) throw insertError;
        
        // Update counts
        if (voteType === 'like') {
          setLikes(prev => prev + 1);
        } else {
          setDislikes(prev => prev + 1);
        }
      }
      
      setCurrentVote(voteType);
      
      // Save the vote in local storage to remember user's choice
      localStorage.setItem(`vote-${compId}`, voteType || '');
      
      toast({
        title: "Vote recorded",
        description: voteType === 'like' ? "You liked this comp!" : "You disliked this comp!",
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "There was a problem with your vote. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Load previous vote from localStorage on component mount
  useEffect(() => {
    const savedVote = localStorage.getItem(`vote-${compId}`);
    if (savedVote === 'like' || savedVote === 'dislike') {
      setCurrentVote(savedVote as VoteType);
    }
  }, [compId]);
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${currentVote === 'like' ? 'text-green-500 dark:text-green-400' : 'text-muted-foreground'}`}
          onClick={() => handleVote('like')}
          disabled={isLoading || currentVote === 'like'}
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
          disabled={isLoading || currentVote === 'dislike'}
        >
          <ThumbsDown className="h-4 w-4" />
          <span>{dislikes}</span>
        </Button>
      </div>
    </div>
  );
};

export default CompVoteSystem;
