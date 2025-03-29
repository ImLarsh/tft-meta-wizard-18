
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
  
  // Generate a consistent user ID - ideally this would be a logged-in user's ID
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Get or create a user ID from localStorage for anonymous voting
    const storedUserId = localStorage.getItem('anonymous_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = crypto.randomUUID();
      localStorage.setItem('anonymous_user_id', newUserId);
      setUserId(newUserId);
    }
  }, []);
  
  // Fetch current votes
  useEffect(() => {
    const fetchVotes = async () => {
      if (!compId) return;
      
      setIsLoading(true);
      
      // Get total likes
      const { data: likesData, error: likesError } = await supabase
        .from('comp_votes')
        .select('id')
        .eq('comp_id', compId)
        .eq('vote_type', 'like');
      
      if (likesError) {
        console.error('Error fetching likes:', likesError);
      } else {
        setLikes(likesData.length);
      }
      
      // Get total dislikes
      const { data: dislikesData, error: dislikesError } = await supabase
        .from('comp_votes')
        .select('id')
        .eq('comp_id', compId)
        .eq('vote_type', 'dislike');
      
      if (dislikesError) {
        console.error('Error fetching dislikes:', dislikesError);
      } else {
        setDislikes(dislikesData.length);
      }
      
      // Get user's current vote if they have one
      if (userId) {
        const { data: userVote, error: userVoteError } = await supabase
          .from('comp_votes')
          .select('vote_type')
          .eq('comp_id', compId)
          .eq('user_id', userId)
          .single();
        
        if (userVoteError && userVoteError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
          console.error('Error fetching user vote:', userVoteError);
        } else if (userVote) {
          setCurrentVote(userVote.vote_type as VoteType);
        }
      }
      
      setIsLoading(false);
    };
    
    if (compId && userId) {
      fetchVotes();
    }
  }, [compId, userId]);
  
  const handleVote = async (voteType: VoteType) => {
    if (!userId || isLoading) return;
    
    // If clicking the same vote type, remove the vote
    const newVoteType = voteType === currentVote ? null : voteType;
    
    try {
      if (currentVote) {
        // Delete existing vote
        const { error: deleteError } = await supabase
          .from('comp_votes')
          .delete()
          .eq('comp_id', compId)
          .eq('user_id', userId);
        
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
        const { error: insertError } = await supabase
          .from('comp_votes')
          .insert({
            comp_id: compId,
            user_id: userId,
            vote_type: newVoteType
          });
        
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
    </div>
  );
};

export default CompVoteSystem;
