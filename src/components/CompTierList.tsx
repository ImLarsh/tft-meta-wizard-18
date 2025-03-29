
import React, { useState, useEffect } from 'react';
import CompCard from './CompCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchX, Filter, Sparkles, HelpCircle, Star, Triangle, Square, Circle, Loader2 } from 'lucide-react';
import { useComps } from '@/contexts/CompsContext';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/use-toast';
import { TFTComp } from '@/data/comps';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TierLegend from './TierLegend';

const CompTierList: React.FC = () => {
  const { comps, traitMappings, loading } = useComps();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    tier: 'all',
    playstyle: 'all',
    tftVersion: 'all',
  });
  const [groupedComps, setGroupedComps] = useState<Record<string, TFTComp[]>>({});
  const [activeTab, setActiveTab] = useState('S');
  const [showLegend, setShowLegend] = useState(false);
  const [availableVersions, setAvailableVersions] = useState<string[]>([]);

  useEffect(() => {
    const versions = Object.keys(traitMappings);
    const sortedVersions = [...versions].sort().reverse();
    setAvailableVersions(sortedVersions);
  }, [traitMappings]);

  useEffect(() => {
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

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'S': return <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />;
      case 'A': return <Triangle className="h-5 w-5 text-cyan-400 fill-cyan-400" />;
      case 'B': return <Square className="h-5 w-5 text-purple-400 fill-purple-400" />;
      case 'C': return <Circle className="h-5 w-5 text-red-400 fill-red-400" />;
      default: return null;
    }
  };
  
  // Calculate if we should show filtered view based on if any filters or search are active
  const shouldShowFilteredView = searchTerm !== '' || 
                               filters.tier !== 'all' || 
                               filters.playstyle !== 'all' || 
                               filters.tftVersion !== 'all';

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
        
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => setShowLegend(!showLegend)}
          >
            <HelpCircle className="h-4 w-4" />
            {showLegend ? "Hide Tier Legend" : "Show Tier Legend"}
          </Button>
        </div>
        
        {showLegend && <TierLegend className="mb-6" />}
        
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
                  {getTierIcon(tier)}
                  <span className="ml-1">{tier}</span>
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
                      {traitMappings[version]?.name || version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-xl font-medium">Loading compositions...</p>
            <p className="text-muted-foreground">Please wait while we fetch the data</p>
          </div>
        ) : (
          <>
            {shouldShowFilteredView ? (
              <>
                {filteredComps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredComps.map(comp => (
                      <CompCard 
                        key={comp.id}
                        comp={comp}
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
                      <div className="flex items-center gap-2">
                        {getTierIcon(tier)}
                        <span>Tier {tier}</span>
                      </div>
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
          </>
        )}
      </div>
    </section>
  );
};

export default CompTierList;
