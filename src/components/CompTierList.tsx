
import React, { useState } from 'react';
import CompCard from './CompCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchX, Trash2 } from 'lucide-react';
import { useComps } from '@/contexts/CompsContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/use-toast';

const CompTierList: React.FC = () => {
  const { comps, removeComp } = useComps();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    tier: 'all',
    playstyle: 'all',
  });
  const [compToDelete, setCompToDelete] = useState<string | null>(null);
  
  // Filter comps based on search and filters
  const filteredComps = comps.filter((comp) => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.traits.some(trait => trait.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Tier filter
    const matchesTier = filters.tier === 'all' || comp.tier === filters.tier;
    
    // Playstyle filter
    const matchesPlaystyle = filters.playstyle === 'all' || comp.playstyle === filters.playstyle;
    
    return matchesSearch && matchesTier && matchesPlaystyle;
  });
  
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDeleteComp = (compId: string) => {
    removeComp(compId);
    setCompToDelete(null);
    toast({
      title: "Composition Deleted",
      description: "The composition has been removed successfully",
    });
  };
  
  // Group comps by tier if not filtering
  const tierOrder = ['S', 'A', 'B', 'C'];
  const groupedComps: Record<string, typeof comps> = {};
  
  if (filters.tier === 'all' && filters.playstyle === 'all' && searchTerm === '') {
    // Organize by tier
    tierOrder.forEach(tier => {
      groupedComps[tier] = comps.filter(comp => comp.tier === tier);
    });
  }
  
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Top TFT Comps</h2>
            <p className="text-muted-foreground">Discover the strongest team compositions for climbing the ranked ladder.</p>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search comps or traits..."
                className="w-full md:w-64 px-4 py-2 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <div>
            <span className="text-sm font-medium mr-2">Tier:</span>
            <div className="flex flex-wrap gap-1">
              <Button 
                variant={filters.tier === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('tier', 'all')}
              >
                All
              </Button>
              {tierOrder.map(tier => (
                <Button 
                  key={tier}
                  variant={filters.tier === tier ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('tier', tier)}
                  className={`${filters.tier === tier ? '' : 'opacity-80'}`}
                >
                  {tier}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium mr-2">Playstyle:</span>
            <div className="flex flex-wrap gap-1">
              <Button 
                variant={filters.playstyle === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('playstyle', 'all')}
              >
                All
              </Button>
              {['Fast 8', 'Slow Roll', 'Standard', 'Hyper Roll'].map(style => (
                <Button 
                  key={style}
                  variant={filters.playstyle === style ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('playstyle', style)}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Show comps */}
        {filters.tier === 'all' && filters.playstyle === 'all' && searchTerm === '' ? (
          // Organized by tier
          <Tabs defaultValue="S">
            <TabsList className="mb-6">
              {tierOrder.map(tier => (
                <TabsTrigger key={tier} value={tier}>
                  Tier {tier}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tierOrder.map(tier => (
              <TabsContent key={tier} value={tier}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedComps[tier]?.map(comp => (
                    <div key={comp.id} className="relative group">
                      <CompCard comp={comp} />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setCompToDelete(comp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          // Filtered view
          <>
            {filteredComps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComps.map(comp => (
                  <div key={comp.id} className="relative group">
                    <CompCard comp={comp} />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setCompToDelete(comp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <SearchX className="h-12 w-12 mx-auto text-muted mb-3" />
                <h3 className="text-xl font-medium mb-2">No comps found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ tier: 'all', playstyle: 'all' });
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!compToDelete} onOpenChange={() => setCompToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Composition</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this composition? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => compToDelete && handleDeleteComp(compToDelete)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default CompTierList;
