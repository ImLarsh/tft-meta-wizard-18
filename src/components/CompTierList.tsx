import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompCard from './CompCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchX, Filter, Sparkles } from 'lucide-react';
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
import { TFTComp } from '@/data/comps';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CompTierList: React.FC = () => {
  const { comps, removeComp, traitMappings } = useComps();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    tier: 'all',
    playstyle: 'all',
    tftVersion: 'all',
  });
  const [compToDelete, setCompToDelete] = useState<string | null>(null);
  const [groupedComps, setGroupedComps] = useState<Record<string, TFTComp[]>>({});
  const [activeTab, setActiveTab] = useState('S');
  const navigate = useNavigate();
  const [availableVersions, setAvailableVersions] = useState<string[]>([]);

  // Get available TFT versions
  useEffect(() => {
    const versions = Object.keys(traitMappings);
    // Sort versions to get the latest sets first
    const sortedVersions = [...versions].sort().reverse();
    setAvailableVersions(sortedVersions);
  }, [traitMappings]);

  useEffect(() => {
    // Sort comps to show latest sets first
    const sortedComps = [...comps].sort((a, b) => {
      const versionA = a.tftVersion || "Set 10";
      const versionB = b.tftVersion || "Set 10";
      return versionB.localeCompare(versionA);
    });

    const tierOrder = ['S', 'A', 'B', 'C'];
    const grouped: Record<string, TFTComp[]> = {};
    
    tierOrder.forEach(tier => {
      grouped[tier] = sortedComps.filter(comp => comp.tier === tier);
    });
    
    setGroupedComps(grouped);
  }, [comps]);

  const filteredComps = comps.filter((comp) => {
    const matchesSearch = searchTerm === '' || 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.traits.some(trait => trait.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTier = filters.tier === 'all' || comp.tier === filters.tier;
    
    const matchesPlaystyle = filters.playstyle === 'all' || comp.playstyle === filters.playstyle;
    
    const matchesVersion = filters.tftVersion === 'all' || comp.tftVersion === filters.tftVersion;
    
    return matchesSearch && matchesTier && matchesPlaystyle && matchesVersion;
  }).sort((a, b) => {
    // Sort by version (latest first) then by tier
    const versionA = a.tftVersion || "Set 10";
    const versionB = b.tftVersion || "Set 10";
    const versionCompare = versionB.localeCompare(versionA);
    
    if (versionCompare !== 0) return versionCompare;
    
    const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
    return (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0);
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

  const handleEditComp = (compId: string) => {
    navigate(`/edit/${compId}`);
  };

  const shouldShowFilteredView = !(filters.tier === 'all' && filters.playstyle === 'all' && filters.tftVersion === 'all' && searchTerm === '');

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <Sparkles className="h-6 w-6 text-primary mr-2" />
              <span>Top TFT Comps</span>
            </h2>
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
            <span className="text-sm font-medium mr-2 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Tier:
            </span>
            <div className="flex flex-wrap gap-1">
              <Button 
                variant={filters.tier === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('tier', 'all')}
                className={filters.tier === 'all' ? 'gaming-button' : ''}
              >
                All
              </Button>
              {['S', 'A', 'B', 'C'].map(tier => (
                <Button 
                  key={tier}
                  variant={filters.tier === tier ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('tier', tier)}
                  className={`${filters.tier === tier ? 'gaming-button' : 'opacity-80'}`}
                >
                  {tier}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium mr-2 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Playstyle:
            </span>
            <div className="flex flex-wrap gap-1">
              <Button 
                variant={filters.playstyle === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('playstyle', 'all')}
                className={filters.playstyle === 'all' ? 'gaming-button' : ''}
              >
                All
              </Button>
              {['Fast 8', 'Slow Roll', 'Standard', 'Hyper Roll'].map(style => (
                <Button 
                  key={style}
                  variant={filters.playstyle === style ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('playstyle', style)}
                  className={filters.playstyle === style ? 'gaming-button' : ''}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium mr-2 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              TFT Set:
            </span>
            <div className="w-48">
              <Select 
                value={filters.tftVersion} 
                onValueChange={(value) => handleFilterChange('tftVersion', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Set" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sets</SelectItem>
                  {availableVersions.map((version) => (
                    <SelectItem key={version} value={version}>
                      {version} - {traitMappings[version]?.name || ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {shouldShowFilteredView ? (
          <>
            {filteredComps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComps.map(comp => (
                  <CompCard 
                    key={comp.id}
                    comp={comp}
                    onEdit={handleEditComp}
                    onDelete={(compId) => setCompToDelete(compId)}
                  />
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
                    setFilters({ tier: 'all', playstyle: 'all', tftVersion: 'all' });
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </>
        ) : (
          <Tabs defaultValue="S" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              {['S', 'A', 'B', 'C'].map(tier => (
                <TabsTrigger key={tier} value={tier} className="flex-1">
                  Tier {tier}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {['S', 'A', 'B', 'C'].map(tier => (
              <TabsContent key={tier} value={tier} className="space-y-4">
                {groupedComps[tier]?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedComps[tier]?.map(comp => (
                      <CompCard 
                        key={comp.id}
                        comp={comp}
                        onEdit={handleEditComp}
                        onDelete={(compId) => setCompToDelete(compId)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No compositions in Tier {tier}</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

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
