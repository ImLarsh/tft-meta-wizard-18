
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { v4 as uuidv4 } from 'uuid';
import ChampionIcon from './ChampionIcon';
import { Button } from './ui/button';
import { Champion, Position } from '@/data/comps';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Trash2, Save } from 'lucide-react';

const ItemTypes = {
  CHAMPION: 'champion',
  HEXCELL: 'hexcell'
};

// Detect touch devices for mobile support
const isTouchDevice = () => {
  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
};

interface HexCellProps {
  position: Position;
  champion: Champion | null;
  onDrop: (position: Position, champion: Champion) => void;
  onRemove: (position: Position) => void;
}

// Individual hexagon cell component
const HexCell: React.FC<HexCellProps> = ({ position, champion, onDrop, onRemove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHAMPION,
    drop: (item: { champion: Champion }) => {
      onDrop(position, item.champion);
      return { dropped: true };
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Allow removing a champion from the cell
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(position);
  };

  return (
    <div 
      ref={drop} 
      className={`hexagon ${isOver ? 'bg-primary/30' : champion ? 'bg-primary/20' : 'bg-secondary/20'} 
                  border border-primary/30 hover:border-primary/60 transition-all duration-200
                  relative flex items-center justify-center`}
    >
      {champion && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ChampionIcon 
            name={champion.name} 
            cost={champion.cost}
            isCarry={champion.isCarry}
          />
          <button 
            onClick={handleRemove} 
            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-80 hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

interface DraggableChampionProps {
  champion: Champion;
}

// Draggable champion component for the champion pool
const DraggableChampion: React.FC<DraggableChampionProps> = ({ champion }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHAMPION,
    item: { champion },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag} 
      className={`champion-item ${isDragging ? 'opacity-50' : 'opacity-100'} 
                  cursor-grab active:cursor-grabbing transition-opacity duration-200
                  p-1 m-1 rounded-md hover:bg-primary/10`}
    >
      <ChampionIcon 
        name={champion.name} 
        cost={champion.cost} 
        isCarry={champion.isCarry}
      />
    </div>
  );
};

interface TFTBoardBuilderProps {
  initialChampions?: Champion[];
  availableChampions: Champion[];
  onSave: (champions: Champion[]) => void;
}

// The main board builder component
const TFTBoardBuilder: React.FC<TFTBoardBuilderProps> = ({ 
  initialChampions = [], 
  availableChampions, 
  onSave 
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [placedChampions, setPlacedChampions] = useState<{[key: string]: Champion}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCost, setFilteredCost] = useState<number | null>(null);
  const [filteredChampions, setFilteredChampions] = useState(availableChampions);
  
  // Create the board grid - 7 columns x 4 rows
  const boardPositions: Position[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      boardPositions.push({ row, col });
    }
  }

  // Initialize with any provided champions
  useEffect(() => {
    const initialPlaced: {[key: string]: Champion} = {};
    initialChampions.forEach(champ => {
      if (champ.position) {
        const key = `${champ.position.row}-${champ.position.col}`;
        initialPlaced[key] = champ;
      }
    });
    setPlacedChampions(initialPlaced);
  }, [initialChampions]);
  
  // Update filtered champions when filters change
  useEffect(() => {
    let filtered = availableChampions;
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filteredCost !== null) {
      filtered = filtered.filter(c => c.cost === filteredCost);
    }
    
    setFilteredChampions(filtered);
  }, [searchTerm, filteredCost, availableChampions]);

  // Handle placing a champion on the board
  const handleDrop = (position: Position, champion: Champion) => {
    const posKey = `${position.row}-${position.col}`;
    setPlacedChampions(prev => {
      const newPlaced = {...prev};
      newPlaced[posKey] = {
        ...champion,
        position
      };
      return newPlaced;
    });
  };

  // Handle removing a champion from the board
  const handleRemove = (position: Position) => {
    const posKey = `${position.row}-${position.col}`;
    setPlacedChampions(prev => {
      const newPlaced = {...prev};
      delete newPlaced[posKey];
      return newPlaced;
    });
  };

  // Clear the entire board
  const handleClearBoard = () => {
    setPlacedChampions({});
    toast({
      title: "Board cleared",
      description: "All champions have been removed from the board."
    });
  };

  // Save the current board configuration
  const handleSaveBoard = () => {
    const champions = Object.values(placedChampions);
    if (champions.length === 0) {
      toast({
        title: "Empty board",
        description: "Please place at least one champion on the board.",
        variant: "destructive"
      });
      return;
    }
    
    onSave(champions);
    toast({
      title: "Board saved",
      description: `Saved ${champions.length} champions to your composition.`
    });
  };

  // Toggle a champion's carry status
  const toggleCarry = (position: Position) => {
    const posKey = `${position.row}-${position.col}`;
    if (placedChampions[posKey]) {
      setPlacedChampions(prev => {
        const newPlaced = {...prev};
        newPlaced[posKey] = {
          ...newPlaced[posKey],
          isCarry: !newPlaced[posKey].isCarry
        };
        return newPlaced;
      });
    }
  };

  // Cost filter buttons
  const CostFilters = () => (
    <div className="flex space-x-2 mb-4">
      <button 
        onClick={() => setFilteredCost(null)} 
        className={`px-3 py-1 rounded-md ${filteredCost === null ? 'bg-primary text-white' : 'bg-secondary/40'}`}
      >
        All
      </button>
      {[1, 2, 3, 4, 5].map(cost => (
        <button 
          key={cost}
          onClick={() => setFilteredCost(filteredCost === cost ? null : cost)} 
          className={`px-3 py-1 rounded-md ${filteredCost === cost ? 'bg-primary text-white' : `bg-cost-${cost} bg-opacity-20`}`}
        >
          ${cost}
        </button>
      ))}
    </div>
  );

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <div className="tft-board-builder glass-effect p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-center">TFT Board Builder</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left side - Champion Pool */}
          <Card className="p-4 backdrop-blur-md bg-card/20 border-primary/20">
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Search champions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded-md bg-background/50 border border-input focus:border-primary/50 focus:outline-none"
              />
            </div>
            
            <CostFilters />
            
            <CardContent className="bg-secondary/10 rounded-md p-2 min-h-[300px] max-h-[400px] overflow-y-auto grid grid-cols-4 md:grid-cols-5 gap-1 content-start">
              {filteredChampions.map((champion) => (
                <DraggableChampion key={`${champion.name}-${uuidv4().slice(0, 8)}`} champion={champion} />
              ))}
              {filteredChampions.length === 0 && (
                <div className="col-span-full text-center py-6 text-muted-foreground">
                  No champions found. Try adjusting your filters.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right side - Board */}
          <Card className="p-4 backdrop-blur-md bg-card/20 border-primary/20">
            <div className="tft-board bg-secondary/10 p-2 rounded-md grid grid-cols-7 gap-1 relative overflow-hidden">
              {boardPositions.map((position) => {
                const posKey = `${position.row}-${position.col}`;
                return (
                  <HexCell
                    key={posKey}
                    position={position}
                    champion={placedChampions[posKey] || null}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                  />
                );
              })}
              
              {/* Fancy background patterns */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleClearBoard}
                className="hover-lift"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Board
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSaveBoard}
                className="hover-lift shine-effect"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Board
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Drag and drop champions to the board. Click to mark a champion as a carry.
            </div>
          </Card>
        </div>
      </div>
    </DndProvider>
  );
};

export default TFTBoardBuilder;
